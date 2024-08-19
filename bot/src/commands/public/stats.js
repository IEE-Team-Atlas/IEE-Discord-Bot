const { EmbedBuilder } = require("discord.js");
const pool = require("../../lib/database");
const colors = require("../../lib/colors");


module.exports = {
    data: {
        name: 'stats',
        description: 'Replies with some stats about the bot.',
    },

    run: async ({interaction, client, handler}) => {

        // Calculate Bot Uptime
        let totalSeconds = (interaction.client.uptime / 1000);

        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;

        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;

        let minutes = Math.floor(totalSeconds / 60);

        let seconds = Math.floor(totalSeconds % 60);


        const totalUsersByRoleQuery = 'SELECT * FROM user_role_totals';
        const totalUsersByRoleResults = await pool.query(totalUsersByRoleQuery);
        
        let studentCount = 0;
        let staffCount = 0;
        
        totalUsersByRoleResults.forEach(row => {
            if (row.user_role === 'student') {
                studentCount = row.user_count;
            } else if (row.user_role === 'staff') {
                staffCount = row.user_count;
            }
        })
        
        const userRegByYearQuery = 'SELECT registration_year, user_count FROM user_regyear_counts ORDER BY registration_year';
        const userRegByYearResults = await pool.query(userRegByYearQuery, interaction.user.id);

        yearly_registrations = '';
        userRegByYearResults.forEach(row => {
            yearly_registrations += `**${row.registration_year}**: \`${row.user_count}\` \n`
        });


        const statsEmbed = new EmbedBuilder()
            .setColor(colors.blue)
            .setTitle(':bar_chart: Bot Status Report')
            .setDescription(`**:hourglass: Διάρκεια Λειτουργίας ΒΟΤ:** \`${days}\` days, \`${hours}\` hours, \`${minutes}\` minutes and \`${seconds}\` seconds \n\n **:student: Συνολικός Αριθμός Εγγεγραμμένων Φοιτητών: ** \`${studentCount}\` \n **:man_teacher: Συνολικός Αριθμός Εγγεγραμμένων Καθηγητών: ** \`${staffCount}\` \n\n ${studentCount > 0 ? `**:calendar_spiral: Αριθμός Εγγραφών ανά Έτος:** \n ${yearly_registrations}`: ''}`)


        interaction.reply({ embeds: [statsEmbed] });
    },

    options: {
    },
};