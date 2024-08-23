import axios from 'axios';
import qs from 'qs'
import jwt from 'jsonwebtoken';
import mariadb from 'mariadb';
import { redirect } from 'sveltekit-flash-message/server';
import colors from '../../lib/colors';

const tokenURL = 'https://login.iee.ihu.gr/token'
const apiURL = 'https://api.iee.ihu.gr/profile';


const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

export async function load (event) {
    let connection;

    const { request } = event; // Destructure properties from event
    const url = new URL(request.url);
    
    let redirectData = { type: 'error', message: 'Κάτι πήγε στραβά. Παρακαλούμε δοκιμάστε ξανά αργότερα.' };
    
    try {
        connection = await pool.getConnection();
    
        const appsApiReturnCode = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const userDiscordData = jwt.verify(state, process.env.JWT_SECRET);
    
        const appsApiToken = await getToken(appsApiReturnCode);
        const userUniData = await getUser(appsApiToken.access_token);
    
        const user = {
            discord_id: userDiscordData.discord_id,
            iee_id: userUniData.iee_id,
            role: userUniData.role,
            regyear: userUniData.regyear
        };
    
        const rows = await pool.query('SELECT * FROM users WHERE iee_id=?', user.iee_id);
    
        if ( rows.length === 0 ) {
            redirectData = await handleNewUser(connection, user);
        } else {
            redirectData = await handleExistingUser(user, rows[0]);
        }
    } catch (err) {
        console.log(err);
        redirect(302, '/', { type: 'error', message: 'Κάτι πήγε στραβά. Παρακαλούμε δοκιμάστε ξανά αργότερα.'}, event);
    } finally {
        if (connection) connection.release();
    }
    redirect(302, '/', redirectData, event);
}

async function handleNewUser(connection, user) {

    // Check if user is in the guest list
    const guestListResult = await pool.query('SELECT * FROM guests WHERE discord_id=?', user.discord_id);

    if (guestListResult.length === 1) {
        await retryOperation(() => deleteGuestLogMsg(process.env.GUEST_CHANNEL_ID, guestListResult[0].msg_id));
        await retryOperation(() => removeRole(user.discord_id, process.env.GUEST_ROLE_ID));
        await connection.query(`DELETE FROM guests WHERE discord_id=?`, user.discord_id);
    }

    const sqlQuery = user.role === 'student'
        ? 'INSERT INTO `users` (`discord_id`, `user_role`, `iee_id`, `regyear`) VALUES (?, ?, ?, ?)'
        : 'INSERT INTO `users` (`discord_id`, `user_role`, `iee_id`) VALUES (?, ?, ?)';

    const queryParams = user.role === 'student'
        ? [user.discord_id, user.role, user.iee_id, user.regyear] 
        : [user.discord_id, user.role, user.iee_id];

    await retryOperation(() => connection.query(sqlQuery, queryParams));

    const adminMsg = {
        color: colors.blue,
        title: user.role === 'student' ? ':student: Νέος Φοιτητής Συνδέθηκε' : ':man_teacher: Νέος Καθηγητής Συνδέθηκε',
        description: user.role === 'student'
            ? `Ο χρήστης <@${user.discord_id}> με iee_id: #${user.iee_id} και έτος εισαγωγής: ${user.regyear} συνδέθηκε επιτυχώς ως φοιτητής.`
            : `<@&${process.env.ADMIN_ROLE_ID}> <@&${process.env.MODERATOR_ROLE_ID}> Ο χρήστης <@${user.discord_id}> με iee_id: #${user.iee_id} συνδέθηκε επιτυχώς ως καθηγητής.`,
    };

    await retryOperation(() => notifyAdmins(process.env.ADMIN_CHANNEL_ID, adminMsg));

    await retryOperation(() =>  applyRole(user.discord_id, user.role));

    const userMsg = {
        color: colors.green,
        title: ':white_check_mark: Ο λογαριασμός σας συνδέθηκε επιτυχώς',
        description: 'Ο λογαριασμός σας στο Discord συνδέθηκε επιτυχώς με τον ιδρυματικό σας λογαριασμό. Τώρα έχετε πρόσβαση στα αποκλειστικά κανάλια και τις πληροφορίες που προορίζονται για τους φοιτητές του τμήματος μας.',
        footer: { text: 'Επικοινωνήστε μαζί μας εάν αντιμετωπίσετε οποιοδήποτε πρόβλημα.' }
    };

    await retryOperation(() => sentDM(user.discord_id, userMsg));

    return { type: 'success', message: 'Ο λογαριασμός σας συνδέθηκε επιτυχώς.' };
}

async function handleExistingUser(user, existingUser) {

    if (existingUser.discord_id.toString() === user.discord_id.toString()) {
        const msg = {
            color: colors.green,
            title: ':white_check_mark: Ήδη Συνδεδεμένος Λογαριασμός',
            description: 'Ο λογαριασμός σας στο Discord είναι ήδη συνδεδεμένος με τον ιδρυματικό σας λογαριασμό. Δεν χρειάζεται να πραγματοποιήσετε ξανά την αυθεντικοποίηση.',
            footer: { text: 'Επικοινωνήστε μαζί μας εάν αντιμετωπίσετε οποιοδήποτε πρόβλημα.' }
        };

        await retryOperation(() => sentDM(user.discord_id, msg));

        return { type: 'success', message: 'Ο λογαριασμός σας είναι ήδη συνδεδεμένος.' };

    } else {
        const adminMsg = {
            color: colors.red,
            title: ':warning: Προσπάθεια Αυθεντικοποίησης Δεύτερου Λογαριασμού',
            description: `<@&${process.env.ADMIN_ROLE_ID}> <@&${process.env.MODERATOR_ROLE_ID}> Ο χρήστης <@${user.discord_id}> προσπάθησε να συνδέσει τον λογαριασμό του στο Discord με τον ιδρυματικό λογαριασμό με iee_id: #${existingUser.iee_id} που είναι ήδη συνδεδεμένος με τον χρήστη <@${existingUser.discord_id}>`
        };

        await retryOperation(() => notifyAdmins(process.env.ADMIN_CHANNEL_ID, adminMsg));

        const userMsg = {
            color: colors.red,
            title: ':exclamation: Ο Λογαριασμός Είναι Ήδη Συνδεδεμένος',
            description: `Ο ιδρυματικός λογαριασμός που προσπαθείτε να συνδέσετε είναι ήδη συνδεδεμένος με έναν άλλο λογαριασμό Discord.`,
            footer: { text: 'Αν πιστεύετε ότι αυτό είναι λάθος, παρακαλούμε επικοινωνήστε μαζί μας.' }
        };

        await retryOperation(() => sentDM(user.discord_id, userMsg));

        const orgUserMsg = {
            color: colors.red,
            title: ':rotating_light: Σημαντική Ειδοποίηση Ασφαλείας',
            description: `Εντοπίστηκε προσπάθεια σύνδεσης χρησιμοποιώντας τα διαπιστευτήρια του ιδρυματικού σου λογαριασμού. \n\n **Αν ήσουν εσύ που προσπάθησες να συνδεθείς:** \n Λυπούμαστε, αλλά δεν είναι δυνατόν να συνδέσεις δύο διαφορετικούς λογαριασμούς. Θα χρειαστεί να αποσυνδεθείς από τον πρώτο λογαριασμό για να ολοκληρώσεις την σύνδεση με τον δεύτερο. \n\n **Αν δεν ήσουν εσύ που προσπάθησες να συνδεθείς:** \n Για την ασφάλεια του ιδρυματικού σου λογαριασμού, σου συνιστούμε να αλλάξεις άμεσα τον κωδικό πρόσβασης σου. \n\n :lock: [Αλλαγή Κωδικού Πρόσβασης](https://apps.iee.ihu.gr/user)`,
            footer: { text: 'Επικοινωνήστε μαζί μας εάν αντιμετωπίσετε οποιοδήποτε πρόβλημα.' }
        };
        await retryOperation(() => sentDM(existingUser.discord_id.toString(), orgUserMsg));

        return { type: 'error', message: 'Ο συγκεκριμένος λογαριασμός είναι ήδη συνδεδεμένος με άλλον λογαριασμό Discord.'}
    }
}

async function sentDM(discord_id, embed) {

    try {
        await fetch(`https://discord.com/api/v10/users/@me/channels`, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recipient_id: discord_id })
        })
        .then(response => response.json())
        .then(channel => {
            fetch(`https://discord.com/api/v10/channels/${channel.id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ embeds: [embed] })
            });
        })
        .catch((err) => {
            console.log(`Error while trying to sent dm: ${err}`)
        })
    } catch(err) {
        console.log(err)
    }
    
}

async function applyRole(discord_id, role) {
    const roleId = role === 'student' ? process.env.STUDENT_ROLE_ID : process.env.PROFESSOR_ROLE_ID;

    try {
        await fetch(`https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${discord_id}/roles/${roleId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
            }
        });
    } catch (err) {
        console.error(`Error applying role: ${err} on user with discord ID=${discord_id}`);
    }
}

async function removeRole(discord_id, role) {
    const roleId = role === 'student' ? process.env.STUDENT_ROLE_ID : process.env.PROFESSOR_ROLE_ID;

    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${discord_id}/roles/${roleId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error removing role from user: ${response.statusText}`);
        }
    } catch (err) {
        console.error(`Error removing role from user: ${err}`);
    }
}

async function notifyAdmins(channelId, msg) {
    try {
        const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ embeds: [msg] })
        });

        if (!response.ok) {
            throw new Error(`Error sending message to admin: ${response.statusText}`);
        }
    } catch (err) {
        console.error(`Error notifying admins: ${err}`);
    }
}

async function deleteGuestLogMsg(channelId, msgId) {
    try {
        const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${msgId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(`Error deleting guest list log message: ${response.statusText}`)
        }
    } catch (err) {
        console.error(`Error deleting guest list log message: ${err}`)
    }

}

async function getToken(code) {
    try {
        const response = await axios.post(tokenURL, qs.stringify({
            client_id: process.env.APPS_CLIENT_ID,
            client_secret: process.env.APPS_SECRET,    
            grant_type: 'authorization_code',
            code: code
        }), {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        })
        return response.data;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
}

async function getUser(token) {
    try {
        const respone = await axios.get(apiURL, {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        });
        const { eduPersonAffiliation, id, regyear } = respone.data;

        return {
            iee_id: id,
            role: eduPersonAffiliation,
            regyear: regyear
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

async function retryOperation(operation, retries=3, delay=1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await operation();
        } catch (err) {
            if (attempt < retries) {
                console.warn(`Operation failed, retrying attempt ${attempt} of ${retries}...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                console.error('Operation failed maximum retries', err);
                throw err;
            }
        }
    }
}