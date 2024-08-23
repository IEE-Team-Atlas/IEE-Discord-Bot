const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const pool = require("../../lib/database");
const colors = require('../../lib/colors');


module.exports = {
    data: {
        name: 'Remove Guest Role',
        type: ApplicationCommandType.User
    },

    run: async ({ interaction, client, handler}) => {

        const guestTableQuery = 'SELECT discord_id, reason, given_by, msg_id FROM guests WHERE discord_id=?';
        const guestResult = await pool.query(guestTableQuery, interaction.targetUser.id);

        if (guestResult.length === 0) {
            const errorEmbed = new EmbedBuilder()
                .setColor(colors.red)
                .setTitle('Σφάλμα')
                .setDescription(`Ο χρήστης <@${interaction.targetUser.id}> δεν υπάρχέι στην λίστα των <@&${process.env.GUEST_ROLE_ID}>`)

            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        else {

            const adminEmbed = new EmbedBuilder()
                .setColor(colors.green)
                .setTitle('Επιτυχία')
                .setDescription(`Ο χρήστης <@${interaction.targetUser.id}> αφαιρέθηκε από την λίστα των <@&${process.env.GUEST_ROLE_ID}> επιτυχώς`)

            try {
                const sqlQuery = `DELETE FROM guests WHERE discord_id=?`;
                await pool.query(sqlQuery, interaction.targetUser.id);
            } catch (error) {
                const adminEmbed = new EmbedBuilder()
                    .setColor(colors.green)
                    .setTitle('Σφάλμα')
                    .setDescription(`Υπήρξε ένα σφάλμα στην προσπάθεια της διαγραφής του χρήστη <@${interaction.targetUser.id}> από την λίστα των <@&${process.env.GUEST_ROLE_ID}>`)
                
                await interaction.reply({ embeds: [adminEmbed], ephemeral: true });
            }

            try {
                const channel = await client.channels.fetch(process.env.GUEST_CHANNEL_ID);
                const message = await channel.messages.fetch(guestResult[0].msg_id);
                await message.delete();
            } catch (error) {
                const adminEmbed = new EmbedBuilder()
                    .setColor(colors.orange)
                    .setTitle('Μερικό Σφάλμα')
                    .setDescription(`Ο χρήστης <@${interaction.targetUser.id}> αφαιρέθηκε από την λίστα των <@&${process.env.GUEST_ROLE_ID}> επιτυχώς αλλά υπήρξε πρόβλημα στην διαδικασία διαγραφής του LOG μηνύματος απο το κανάλι.`)

                await interaction.reply({ embeds: [adminEmbed], ephemeral: true });
            }

            try {
                const guild = await client.guilds.fetch(process.env.GUILD_ID);
                const user = await guild.members.fetch(interaction.user.id);
                user.roles.remove(process.env.GUEST_ROLE_ID);
            } catch (error) {
                const adminEmbed = new EmbedBuilder()
                    .setColor(colors.orange)
                    .setTitle('Μερικό Σφάλμα')
                    .setDescription(`Ο χρήστης <@${interaction.targetUser.id}> αφαιρέθηκε από την λίστα των <@&${process.env.GUEST_ROLE_ID}> επιτυχώς αλλά υπήρξε πρόβλημα στην διαδικασία διαγραφής του ρόλου από τον χρήστη.`)

                await interaction.reply({ embeds: [adminEmbed], ephemeral: true });
            }

            await interaction.reply({ embeds: [adminEmbed], ephemeral: true });

        }
      
    },

    options: {
        modOnly: true
    },
};