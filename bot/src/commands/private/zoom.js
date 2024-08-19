const { EmbedBuilder } = require("discord.js");
const path = require("path");
const colors = require('../../lib/colors');

let zoomRooms;
try {
    zoomRooms = require("../../../data/zoom-rooms.json");
} catch (error) {
    console.error("Failed to load zoom-rooms.json");
    zoomRooms = null;
}

module.exports = {
    data: {
        name: 'zoom',
        description: 'Replies with the links for the ZOOM rooms.',
    },

    run: async ({interaction, client, handler}) => {

        const isNotDM = interaction.guild === null ? false : true

        if (zoomRooms === null) {
            const errorEmbed = new EmbedBuilder()
                .setColor(colors.red)
                .setTitle('Σφάλμα')
                .setDescription('Δεν μπορούμε να προσπελάσουμε τη λίστα με τις αίθουσες Zoom αυτή τη στιγμή.')
                .setFooter({ text: 'Παρακαλώ δοκιμάστε ξανά αργότερα.' });
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        const zoomEmbed = new EmbedBuilder()
            .setColor(colors.blue)
            .setTitle('Εικονικές αίθουσες του τμήματος ΜΠΗΣ.')
            .setDescription('Ακολουθούν οι σύνδεσμοι για όλες τις διαθέσιμες αίθουσες Zoom, του τμήματος Μηχανικών Πληροφορικής και Ηλεκτρονικών Συστημάτων. Κάντε κλικ στους συνδέσμους για να συνδεθείτε στις αίθουσες.')
            .setThumbnail(url = "attachment://zoom_logo.png")
            .addFields(zoomRooms)
        await interaction.reply({ files: [{ attachment: path.join(__dirname, '../../../assets/images/zoom_logo.png'), name: 'zoom_logo.png' }], embeds: [zoomEmbed],  ephemeral: isNotDM});
    },

    options: {
        userAuth: true
    },
};