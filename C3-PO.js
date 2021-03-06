const Discord = require('discord.js');
const shell = require('shelljs');
const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config();

const projectId = process.env.GOOGLE_PROJECT_ID;

const translate = new Translate({
    projectId: projectId,
    credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL
    }
});

const client = new Discord.Client();
const prefix = process.env.BOT_PREFIX
const langtoflag = require("./langtoflag.json");

client.on("ready", () => {
    console.log("The bot is online.");
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`)
    client.user.setActivity("human/cyborg relations");
});

client.on("message", (message) => {

    if (message.author.bot) return;

    // Separate command and args
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "restart") {
        if (!(message.member.roles.cache.has(process.env.BOT_ADMIN_ID))) {
            return message.channel.send("Reboot command denied.")
        }
        if (message.content.startsWith(prefix)) {
            message.channel.send('C-3PO rebooting.')
                .then(() => client.destroy());
            shell.exec('./restart.sh');
        }
    }

    let target = ['af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'ny', 'zh-cn', 'zh-tw', 'co', 'hr', 'cs', 'da', 'nl',
        'en', 'eo', 'et', 'tl', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga',
        'it', 'ja', 'jw', 'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my',
        'ne', 'no', 'ps', 'fa', 'pl', 'pt', 'ma', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv',
        'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'
    ];
    let randomTarget = target[Math.floor(Math.random() * target.length)];

    let text;
    async function translateText(text, target) {
        let [translations] = await translate.translate(text, target);
        translations = Array.isArray(translations) ? translations : [translations];
        translations.forEach((translation, i) => {
            message.channel.send(`${translation}`)
                .then(m => m.react(langtoflag[target]))
                .catch(error => console.log(`Error: ${error}`))
        });
    }


    if (!message.author.bot) {
        let chance = Math.random();
        if (chance < 0.01)
            translateText(message.content.toString(), randomTarget);
    }

    if (command === "translate") {
        console.log(args[0])
        console.log(args.join(' '))
        translateText(args.slice(1).join(' '), args[0])
    }

})

client.login(process.env.BOT_TOKEN).then(r => console.log("C-3PO logged in."));