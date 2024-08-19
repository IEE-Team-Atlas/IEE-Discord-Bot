const { EmbedBuilder } = require("discord.js");
const path = require("path");
const colors = require("../../lib/colors");

module.exports = {
    data: {
        name: 'contact',
        description: "Replies with the department's contact information",
    },

    run: ({interaction, client, handler}) => {

        const isNotDM = interaction.guild === null ? false : true

        const contactEmbed = new EmbedBuilder()
            .setColor(colors.blue)
            .setTitle('Tμήμα Μηχανικών Πληροφορικής και Ηλεκτρονικών Συστημάτων')
            .setURL('https://www.iee.ihu.gr/')
            .setDescription('Οι ώρες εξυπηρέτησης των φοιτητών και του κοινού είναι καθημερινά, από ώρα **12:00 έως 14:00** από τη θυρίδα της γραμματείας, στο ισόγειο του κτιρίου του  πρώην Τμήματος Ηλεκτρονικών Μηχανικών (ΤΕ) του ΑΤΕΙΘ.  Παρακαλούνται οι φοιτητές/τριες του τμήματος όταν συναλλάσσονται με τη Γραμματεία του Tμήματος να έχουν πάντα μαζί τους τη φοιτητική τους ταυτότητα.')
            .setThumbnail(url = "attachment://department_logo.png")
            .addFields(
                { name: 'Phone:', value: '2310 013621' },
                { name: "Ε-mail Γραμματείας:", value: 'info@iee.ihu.gr', inline: true }
            )
            .setFooter({ text: 'Για τα στοιχεία επικοινωνίας των καθηγητών χρησιμοποιήστε την εντολή: /professors' });

        interaction.reply({ files: [{ attachment: path.join(__dirname, '../../../assets/images/department_logo.png'), name: 'department_logo.png' }], embeds: [contactEmbed], ephemeral: isNotDM});
    },

    options: {
        
    },
};