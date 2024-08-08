const path = require("path");

module.exports = {
    data: {
        name: 'map',
        description: "Replies with an image of the university's campus.",
    },

    run: ({interaction, client, handler}) => {

        const isNotDM = interaction.guild === null ? false : true;

        interaction.reply({files: [path.join(__dirname, '../../../assets/images/campus_map.jpg')], ephemeral: isNotDM});
    },

    options: {
    },
};