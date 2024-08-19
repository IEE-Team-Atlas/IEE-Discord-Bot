const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const colors = require('../../lib/colors');

let professors;
try {
    professors = require("../../../data/professors.json");
} catch (error) {
    console.error("Failed to load professors.json");
    professors = null;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('professors')
        .setDescription('Replies with the contact information of specified professor.')
        .addStringOption((option) => 
            option
                .setName('name')
                .setDescription('The name of the professor')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    run: async ({interaction, client, handler}) => {

        const isNotDM = interaction.guild === null ? false : true

        if (professors === null) {
            const errorEmbed = new EmbedBuilder()
                .setColor(colors.red)
                .setTitle('Σφάλμα')
                .setDescription('Δεν μπορούμε να προσπελάσουμε τη λίστα με τους καθηγητές αυτή τη στιγμή.')
                .setFooter({ text: 'Παρακαλώ δοκιμάστε ξανά αργότερα.' });
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        const targetProfessorId = interaction.options.getString('name');
        const targetProfessorObj = professors.find((professor) => professor.id === targetProfessorId);

        if (!targetProfessorObj) {
            const errorEmbed = new EmbedBuilder()
                .setColor(colors.red)
                .setTitle('Σφάλμα')
                .setDescription(`Ο καθηγητής με το συγκεκριμένο όνομα δεν βρέθηκε.`)
                .setFooter({text: 'Παρακαλώ ελέγξτε το όνομα και δοκιμάστε ξανά.'})
            interaction.reply({embeds: [errorEmbed], ephemeral: true});
            return;
        }

        const professorEmbed = new EmbedBuilder()
            .setColor(colors.blue)
            .setTitle(':information_source: Πληροφορίες Επικοινωνίας Καθηγητή')
            .addFields(
                { name: "Όνομα", value: `${targetProfessorObj.name}`},
                { name: "Email", value: `${targetProfessorObj.email}`},
                { name: "Γραφείο", value: `${targetProfessorObj.office}` || "Δεν διατίθεται"},
                { name: "Ώρες Γραφείου", value: `${targetProfessorObj.officeHours}` || "Δεν διατίθεται"},
                { name: "Σημείωση", value: `${targetProfessorObj.note}` || "Δεν υπάρχει επιπλέον σημείωση."},
            )
            .setFooter({text: "Επικοινωνήστε με τον καθηγητή για περισσότερες λεπτομέρειες."});

        await interaction.reply({embeds: [professorEmbed],  ephemeral: isNotDM});

    },

    autocomplete: async ({interaction, client, handler }) => {
        const focusedProfessorOption = interaction.options.getFocused(true);

        if (professors === null) return

        const filteredChoices = professors.filter((professor) => {
            const nameParts = professor.name.split(' ');

            return nameParts.some(part => 
                part.toLowerCase().startsWith(focusedProfessorOption.value.toLowerCase())
            );

        });

        const results = filteredChoices.map((p) => {
            return {
                name: p.name,
                value: p.id,
            };
        });

        await interaction.respond(results.slice(0, 25)).catch(() => {});
    },

    options: {
        userAuth: true
    },
};