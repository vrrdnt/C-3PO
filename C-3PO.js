const Discord = require('discord.js');
const fs = require('fs')
const shell = require('shelljs');
const {
    Translate
} = require('@google-cloud/translate').v2;
const translate = new Translate();


const client = new Discord.Client();
const config = require("./config.json");
const prefix = process.env.BOT_PREFIX
const langtoflag = require("./langtoflag.json");

client.on("ready", () => {
    console.log("The bot is online.");
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`)
    client.user.setActivity("human/cyborg relations");
});

client.on("message", (message) => {

    if(message.author.bot) return;

    // Separate command and args
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "restart") {
        if (!message.member.roles.cache.has(process.env.BOT_ADMIN_ID)) {
            return message.channel.send("Reboot command denied.")
        }
        if (message.content.includes(config.prefix)) {
            message.channel.send('C-3PO, human/cyborg relations, rebooting.')
                .then(() => client.destroy())
                .then(() => shell.exec('./restart.sh'));
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
    async function translateText() {
        let [translations] = await translate.translate(text, randomTarget);
        translations = Array.isArray(translations) ? translations : [translations];
        translations.forEach((translation, i) => {
            message.channel.send(`${translation}`)
                .then(m => m.react(langtoflag[randomTarget]))
        });
    }


    if (!message.author.bot) {
        text = message.content.toString();
        let chance = Math.random();
        if (chance < 0.05)
            translateText(message.content);
    }

})

client.login(process.env.BOT_TOKEN);
