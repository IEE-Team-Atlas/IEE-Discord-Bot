const pool = require("../../lib/database");
const colors = require("../../lib/colors");
const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction) => {

    if (typeof interaction.customId === "string" && interaction.customId.startsWith("reason-")) {
        const reasonInput = interaction.fields.getTextInputValue('guestRoleReason')

        const user_disc_id = interaction.customId.substring(interaction.customId.lastIndexOf("-") + 1);

        const sqlQuery = 'INSERT INTO `guests` (`discord_id`, `reason`, `given_by`) VALUES (?, ?, ?)';
        await pool.query(sqlQuery, [user_disc_id, reasonInput, interaction.user.id]);

        const adminLogMsgEmbed = new EmbedBuilder()
            .setColor(colors.blue)
            .setTitle('New Guest User Added')
            .setDescription(`Ο <@${interaction.user.id}> έδωσε τον ρόλο <@&${process.env.GUEST_ROLE_ID}> στον χρήστη <@${user_disc_id}> με την αιτηολογία: \`${reasonInput}\``);

        await interaction.guild.channels.fetch(process.env.GUEST_CHANNEL_ID).then(channel => 
            channel.send({ embeds: [adminLogMsgEmbed]}).then(async msg => {
                const updateQuery = `UPDATE guests SET msg_id=? WHERE discord_id=?`;
                await pool.query(updateQuery, [msg.id, user_disc_id]);
            })
        )

        const userEmbed = new EmbedBuilder()
            .setColor(colors.blue)
            .setTitle('Απόκτηση Ρόλου: Guest')
            .setDescription(`Ένας διαχειριστής του διακομιστή μόλις σου έδωσε τον ρόλο του Guest! Εάν είσαι νεοεισακτέος και δεν έχεις ακόμα ιδρυματικό λογαριασμό, μόλις αποκτήσεις, μπορείς να χρησιμοποιήσεις την εντολή \`/auth\` για να αυθεντικοποιηθείς με τον ιδρυματικό σου λογαριασμό και να αποκτήσεις πλήρη πρόσβαση στα κανάλια.`)


        const user = await interaction.guild.members.fetch(user_disc_id);
        user.roles.add(process.env.GUEST_ROLE_ID);

        await user.send({embeds: [userEmbed]})


        interaction.reply({content: `<@&${process.env.GUEST_ROLE_ID}> role applied sucessfully.`, ephemeral: true});
    }
};