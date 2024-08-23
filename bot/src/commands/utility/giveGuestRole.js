const { ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const pool = require("../../lib/database");
const colors = require('../../lib/colors');

module.exports = {
    data: {
        name: 'Give Guest Role',
        type: ApplicationCommandType.User
    },

    run: async ({ interaction, client, handler}) => {

        // Check if user already exists in the guest table
        const guestTableQuery = 'SELECT discord_id, reason, given_by FROM guests WHERE discord_id=?';
        const guestResult = await pool.query(guestTableQuery, interaction.targetUser.id);

        // Check if the user already exists in the users table
        const usersTableQuery = 'SELECT discord_id FROM users WHERE discord_id=?';
        const usersResult = await pool.query(usersTableQuery, interaction.targetUser.id);

        if (interaction.targetUser.bot) {
            // User is bot
            const errorEmbed = new EmbedBuilder()
                .setColor(colors.red)
                .setTitle('Σφάλμα')
                .setDescription(`🤖 Προσπαθείς να δώσεις τον ρόλο <@&${process.env.GUEST_ROLE_ID}> σε ένα ρομποτ; Καλύτερα όχι... Είναι το πρώτο βήμα για την εξέγερση των μηχανών. 😨🤖`)

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (guestResult.length === 1) {
            // User is guest already
            const errorEmbed = new EmbedBuilder()
                .setColor(colors.red)
                .setTitle('Σφάλμα')
                .setDescription(`Ο χρήστης <@${interaction.targetUser.id}> έχει ήδη τον ρόλο <@&${process.env.GUEST_ROLE_ID}>`)

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        if (usersResult.length === 1) {
            // User is authed already
            const errorEmbed = new EmbedBuilder()
                .setColor(colors.red)
                .setTitle('Σφάλμα')
                .setDescription(`Ο χρήστης <@${interaction.targetUser.id}> έχει ήδη τον ρόλο <@&${process.env.STUDENT_ROLE_ID}> όποτε δεν χρειάζεται τον ρόλο <@&${process.env.GUEST_ROLE_ID}>`)

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const modal = new ModalBuilder({
            customId: `reason-${interaction.targetUser.id}`,
            title: `Give Guest Role`,
        })

        const reasonInput = new TextInputBuilder({
            customId: `guestRoleReason`,
            label: 'Reason',
            placeholder: `Παρακαλώ εξηγήστε γιατί ο/η ${interaction.targetUser.username} λαμβάνει τον ρόλο Guest.`,
            minLength: 10,
            maxLength: 500,
            required: true,
            style: TextInputStyle.Paragraph
        })

        const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
    },

    options: {
        modOnly: true
    },
};