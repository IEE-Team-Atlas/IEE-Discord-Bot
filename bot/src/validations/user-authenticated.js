const pool = require('../database');
const { EmbedBuilder } = require("discord.js");

module.exports = async ({interaction, commandObj, handler}) => {
    if (commandObj.options?.userAuth) {
        try {

            const sqlQuery = 'SELECT id FROM users WHERE discord_id=?';
            const rows = await pool.query(sqlQuery, interaction.user.id)

            if (rows.length === 0) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff3333')
                    .setTitle('Σφάλμα Εκτέλεσης Εντολής')
                    .setDescription('Λυπούμαστε, αλλά για λόγους ασφάλειας και ιδιωτικότητας χρειάζεται να είστε αυθεντικοποιημένοι για να εκτελέσετε αυτήν την εντολή. Μπορείτε να αυθεντικοποιηθείτε χρησιμοποιώντας την εντολή `/auth` προκειμένου να συνδέσετε τον ιδρυματικό σας λογαριασμό με το bot μας.')
                    .setFooter({text: 'Ευχαριστούμε για την κατανόηση. Μην διστάσετε να επικοινωνήσετε μαζί μας για οποιαδήποτε τυχόν απορία έχετε.'});
                interaction.reply({embeds: [errorEmbed]});
                return true;
            }

        } catch (error) {
            console.log(error);
            return true;
        }
    }
}