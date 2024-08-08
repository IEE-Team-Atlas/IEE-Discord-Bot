const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const path = require("path");
const pool = require("../../database");
const jwt = require("jsonwebtoken");

module.exports = {
    data: {
        name: 'auth',
        description: 'Link your discord account with your university account.',
    },

    run: async ({interaction, client, handler}) => {

        const isNotDM = interaction.guild === null ? false : true

        try {

            const sqlQuery = 'SELECT id FROM users WHERE discord_id=?';
            const rows = await pool.query(sqlQuery, interaction.user.id)

            if (rows.length === 0) {
                const user = {
                    discord_id: interaction.user.id
                };

                const token = jwt.sign(user, process.env.JWT_SECRET);

                const authURL = `https://login.iee.ihu.gr/authorization/?client_id=${process.env.APPS_CLIENT_ID}&response_type=code&state=${token}&scope=profile&redirect_uri=${process.env.CALLBACK_URL}`;

                const authEmbed = new EmbedBuilder()
                    .setColor('#0d86e3')
                    .setTitle(':pencil: Σύνδεση λογαριασμού Discord με τον ιδρυματικό λογαριασμό.')
                    .setDescription(`Πατήστε το κουμπί παρακάτω για να συνδέσετε τον λογαριασμό σας στο Discord με τον ιδρυματικό σας λογαριασμό. Με αυτήν την ενέργεια θα αποκτήσετε πρόσβαση σε αποκλειστικά κανάλια και πληροφορίες που προορίζονται μόνο για τους φοιτητές του τμήματος μας.`)
                    .setFooter({ text: 'Επικοινωνήστε μαζί μας εάν αντιμετωπίσετε οποιοδήποτε πρόβλημα.' });
                

                const authButton = new ButtonBuilder()
                    .setLabel('Σύνδεση')
                    .setStyle(ButtonStyle.Link)
                    .setURL(authURL)

                const authActionRow = new ActionRowBuilder()
                    .addComponents(authButton)

                interaction.reply({ embeds: [authEmbed], components: [authActionRow], ephemeral: isNotDM });
                
            }

            if (rows.length === 1) {
                const  alreadyAuthedEmbed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle(':white_check_mark: Υπάρχων χρήστης')
                    .setDescription(`Είστε ήδη αυθεντικοποιημένοι. Αν πιστεύετε ότι αυτό είναι λάθος, παρακαλούμε επικοινωνήστε μαζί μας.`)
                    .setFooter({ text: 'Ευχαριστούμε για την κατανόηση.' });

                interaction.reply({ embeds: [alreadyAuthedEmbed], ephemeral: isNotDM });
            }


        } catch (error) {
            console.log(error)
        }
        
    },

    options: {
    },
};