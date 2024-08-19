const { EmbedBuilder } = require("discord.js");
const path = require("path");
const pool = require("../../lib/database");
const colors = require('../../lib/colors');

module.exports = {
    data: {
        name: 'deauth',
        description: 'Unlink your discord account with your university account.',
    },

    run: async ({interaction, client, handler}) => {

        const isNotDM = interaction.guild === null ? false : true

        const sqlQuery = 'SELECT id, user_role FROM users WHERE discord_id=?';
        const rows = await pool.query(sqlQuery, interaction.user.id)

        if (rows.length === 0) {
            const userDoesNotExist = new EmbedBuilder()
                .setColor(colors.red)
                .setTitle('Ουπς!')
                .setDescription(`Δεν σας βρήκαμε στο σύστημα μας. Αν πιστεύεται ότι προκειται για κάποιο λάθος, επικοινωνίστε μάζι μας.`)
    
            interaction.reply({ embeds: [userDoesNotExist], ephemeral: isNotDM });

        } else {

            const role = rows[0].user_role;
            const iee_id = rows[0].user.iee_id;

            const sqlQuery = `DELETE FROM users WHERE discord_id=?`;
            const result = await pool.query(sqlQuery, interaction.user.id);

            const guild = await client.guilds.fetch(process.env.GUILD_ID);
            const user = await guild.members.fetch(interaction.user.id);

            if (role === 'student') {
                user.roles.remove(process.env.STUDENT_ROLE_ID);
            } else {
                console.log('professor')
                user.roles.remove(process.env.PROFESSOR_ROLE_ID)
            }

            const adminMsg = new EmbedBuilder()
                .setColor(colors.orange)
                .setTitle(`:door: Αποσύνδεση ${role === 'student' ? 'Φοιτητή': 'Καθηγητή'}`)
                .setDescription(`<@&${process.env.ADMIN_ROLE_ID}> <@&${process.env.MODERATOR_ROLE_ID}> O χρήστης <@${interaction.user.id}> με iee_id: #${iee_id} αποσύνδεσε επιτυχώς τον ιδρυματικό του λογαριασμό απο τον λογαριασμό του στο Discord.`)

            client.channels.fetch(process.env.ADMIN_CHANNEL_ID).then(channel => channel.send({ embeds: [adminMsg]}))

            const userDeleted = new EmbedBuilder()
                .setColor(colors.blue)
                .setTitle(':x: Ο Λογαριασμός σας αποσυνδέθηκε')
                .setDescription(`Ο λογαριασμός σας στο Discord έχει αποσυνδεθεί από τον ιδρυματικό σας λογαριασμό. Έχετε χάσει την πρόσβαση στα αποκλειστικά κανάλια και τις πληροφορίες που προορίζονται για τα μέλη του τμήματος μας. Μπορείτε πάντα να συνδεθείτε ξανά χρησιμοποιώντας την εντολή /auth.`)
                .setFooter({ text: 'Επικοινωνήστε μαζί μας εάν αντιμετωπίσετε οποιοδήποτε πρόβλημα.' });

            interaction.reply({ embeds: [userDeleted], ephemeral: isNotDM });
        }


    },

    options: {
        
    },
};