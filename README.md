<div id="top"></div>
<!-- Project LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ThomasSoum/IEE-Discord-Bot">
    <img src="./banner.png" alt="Logo">
  </a>

  <h3 align="center">IEE Discord Bot</h3>

  <p align="center">
    The official Discord bot of the Department of Information and Electronic Engineering of the International Hellenic University.
    <br />
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## :ledger: Table of Contents

- [About](#question-about-the-project)
  - [Built With](#wrench-built-with)
- [Getting Started](#rocket-getting-started)
  - [Prerequisites](#memo-prerequisites)
  - [Installation](#installation)
  - [Disclaimer](#lock-disclaimer)
  - [Environment Variables](#key-environment-variables)
  - [Usage](#zap-usage)
- [Commands](#clipboard-commands)
- [License](#scroll-license)
- [Contact](#envelope-contact)

<!-- ABOUT THE PROJECT -->

## :question: About The Project

The IEE Discord Bot is an open-source tool created to simplify the account linking process for students from the [Department of Information and Electronic Engineering](https://www.iee.ihu.gr/en/), of the [International Hellenic University](https://www.ihu.gr/). It enables students to quickly and easily connect their Discord account with their university account. The bot also offers general information commands to help users with common questions and provide useful details about the department.

<p align="right">(<a href="#top">back to top</a>)</p>

### :wrench: Built With

* [![Node][Node.js]][Node-url]
* [![DiscordJS][discord.js]][discordjs-url]
* [![CommandKit][commandkit.js]][commandkit-url]
* [![MariaDB][MariaDB]][mariadb-url]
* [![SvelteKit][SvelteKit.dev]][sveltekit-url]

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->

## :rocket: Getting Started

### :memo: Prerequisites

- [Docker Engine](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Discord bot token and id. [Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
- IEE IHU API credentials. [Guide](https://login.iee.ihu.gr/) (NOTE: You need to be a registered student at the university to access the page.)

<p align="right">(<a href="#top">back to top</a>)</p>

<div id="installation"></div>

### :electric_plug: Installation

1. Clone the project
   ```bash
   git clone https://github.com/IEE-Team-Atlas/IEE-Discord-Bot.git
   ```
2. Go to the project directory
   ```bash
   cd IEE-Discord-Bot
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

### :lock: Disclaimer

This bot includes commands that require sensitive data, such as contact details and internal links. For privacy reasons, the real data files are not included in this repository.

#### How to use these commands
To enable these commands, you will need to create the required data files. Below is a list of the commands, the corresponding file names, locations, and templates for the data structure.

| Command               | File Name             | File Location        | Template File Name                                 |
|-----------------------|-----------------------|----------------------|----------------------------------------------------|
| `/professors`  | `professors.json`     | `/bot/data/`  | ```professors.template.json``` |
| `/zoom`      | `zoom-rooms.json`| `/bot/data/`    | ```zoom-rooms.template.json``` |

<p align="right">(<a href="#top">back to top</a>)</p>

### :key: Environment Variables

To run this project, you will need to create a ```.env``` file in the root directory of the project and add the following environment variables.

   ```sh
   # Discord Bot Variables
    DISCORD_CLIENT_ID = "<YOUR_CLIENT_TOKEN>"
    DISCORD_TOKEN = "<YOUR_CLIENT_ID>"

    # Discord Server ID
    GUILD_ID = "<YOUR_GUILD_ID>"

    # Discord Server Admin and Moderator Role Id
    ADMIN_ROLE_ID = "<YOUR_ADMIN_ROLE_ID>"
    MODERATOR_ROLE_ID = "<YOUR_MODERATOR_ROLE_ID>"


    # Discord Server Admin Log Channel ID
    ADMIN_CHANNEL_ID = "<YOUR_ADMIN_LOG_CHANNEL_ID>"

    # Discord Role IDs
    STUDENT_ROLE_ID = "<DISCORD_STUDENT_ROLE_ID>"
    PROFESSOR_ROLE_ID = "<DISCORD_PROFESSOR_ROLE_ID>"

    # IEE IHU API credentials
    APPS_CLIENT_ID = "<YOUR_APPS_API_CLIENT_ID>"
    APPS_SECRET = "<YOUR_APPS_API_CLIENT_SECRET>"
    CALLBACK_URL = "<YOUR_APPS_API_CALLBACK_URL>"

    # SECURE JWT SECRET
    JWT_SECRET = "<YOUR_JWT_SECRET>"

    # MariaDB Variables
    DB_USER = "<DB_USERNAME>"
    DB_PASSWORD = "<DB_USER_PASSWORD>"
    DB_NAME = "<DB_NAME>"
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

### :zap: Running the Application

Once you have completed all the necessary configurations, you can start the application with Docker. Simply navigate to the root of your project directory and run the following command:
```sh
docker compose up -d
```
This command will build and start the application in detached mode, meaning it will run in the background. You can then access the services as configured.

<p align="right">(<a href="#top">back to top</a>)</p>

## :scroll: License


This project is licensed under the MIT License.

You are free to use, modify, and distribute this software, subject to the following conditions:

- The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
- The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software.

For more details, you can view the full license text in the [LICENSE](./LICENSE) file.

<p align="right">(<a href="#top">back to top</a>)</p>

## :envelope: Contact

Thomas Soumpasis - thomasoumpasis@gmail.com

Project Link: [github.com/IEE-Team-Atlas/IEE-Discord-Bot](https://github.com/IEE-Team-Atlas/IEE-Discord-Bot)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Discord.js]: https://img.shields.io/badge/discord.js-7289DA?style=for-the-badge&logo=discord&logoColor=white
[Discordjs-url]: https://discord.js.org/
[commandkit.js]: https://img.shields.io/badge/CommandKit-FF4500?style=for-the-badge
[commandkit-url]: https://commandkit.js.org/
[MariaDB]: https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white
[mariadb-url]: https://mariadb.com/
[SvelteKit.dev]: https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white
[sveltekit-url]: https://kit.svelte.dev/