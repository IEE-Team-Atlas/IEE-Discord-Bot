const { EmbedBuilder } = require("discord.js");
const colors = require('../lib/colors');

module.exports = async ({interaction, commandObj, handler}) => {
    if (commandObj.options?.modOnly) {
      // console.log(interaction)
      // return true;
        try {
            if (!interaction.member.roles.cache.has(process.env.ADMIN_ROLE_ID) || !interaction.member.roles.cache.has(process.env.MODERATOR_ROLE_ID)) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(colors.red)
                    .setTitle('Σφάλμα Εκτέλεσης Εντολής')
                    .setDescription('Λυπούμαστε, αλλά αυτή η εντολή μπορεί να εκτελεστεί μόνο από διαχειριστές.')
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