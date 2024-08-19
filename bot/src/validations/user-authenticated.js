const pool = require('../lib/database');
const { EmbedBuilder } = require("discord.js");
const colors = require('../lib/colors');

module.exports = async ({interaction, commandObj, handler}) => {
    if (commandObj.options?.userAuth) {
        try {
            const sqlQuery = 'SELECT id FROM users WHERE discord_id=?';
            const rows = await pool.query(sqlQuery, interaction.user.id)

            if (rows.length === 0) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(colors.red)
                    .setTitle('Σφάλμα Εκτέλεσης Εντολής')
                    .setDescription('Λυπούμαστε, αλλά για λόγους ασφάλειας και ιδιωτικότητας χρειάζεται να είστε αυθεντικοποιημένοι για να εκτελέσετε αυτήν την εντολή. Μπορείτε να αυθεντικοποιηθείτε χρησιμοποιώντας την εντολή `/auth` προκειμένου να συνδέσετε τον ιδρυματικό σας λογαριασμό με τον λογαριασμό σας στο Discord.')
                    .setFooter({text: 'Ευχαριστούμε για την κατανόηση.'});
                interaction.reply({embeds: [errorEmbed], ephemeral: true});
                return true;
            }

        } catch (error) {
            console.log(error);
            return true;
        }
    }
}