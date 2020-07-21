const Discord = require('discord.js');
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();


const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
    console.log("The bot is ready.");
});

client.on("message", (message) => {

    var text;
    let target = ['af', 'sq', 'ar', 'hy', 'az', 'eu', 'be', 'bg', 'ca', 'zh-CN', 'zh-TW', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'tl', 'fi', 'fr', 'gl', 'ka', 'de', 'el', 'ht', 'iw', 'hi', 'hu', 'is', 'id', 'ga', 'it', 'ja', 'ko', 'lv', 'lt', 'mk', 'ms', 'mt', 'no', 'fa', 'pl', 'pt', 'ro', 'ru', 'sr', 'sk', 'sl', 'es', 'sw', 'sv', 'th', 'tr', 'uk', 'ur', 'vi', 'cy', 'yi'];
    var randomTarget = target[Math.floor(Math.random() * target.length)];

    async function translateText() {
        let [translations] = await translate.translate(text, randomTarget);
        translations = Array.isArray(translations) ? translations : [translations];
        translations.forEach((translation, i) => {
            message.channel.send(`${translation}`);
        });
    }

	
    if (!message.author.bot) {
        var text = message.content.toString();
        var chance = Math.random();
		if (chance < 0.1)
        translateText(message.content, randomTarget);
    }

})

client.login(config.token);
