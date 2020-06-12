// Initializing the slackbot
const SlackBot = require('slackbots');
const axios = require('axios');
const pingMyDyno = require('pingmydyno');
const dotenv = require('dotenv');

dotenv.config()

const bot = new SlackBot({
    token: `${process.env.BOT_TOKEN}`,
    name: 'js-slackbot'
})

// Slackbot Actions
bot.on('start', () => {
    bot.postMessageToChannel(
        'coding',
        'Hello, the JavaScript SlackBot is now online.'
    )
})

bot.on('error', (err) => {
    console.log(err);
})

bot.on("message", (data) => {
    if(data.type !== 'message'){
        return;
    }
    handleMessage(data.text);
})

function handleMessage(message) {
    if (message.toLowerCase().includes('help')) {
        runHelp();
    } else if (message.toLowerCase().includes('joke')) {
        tellJoke();
    } else if (message.toLowerCase().includes('inspire')) {
        inspire();
    }
}

function runHelp() {
    bot.postMessageToChannel(
        'coding',
        'Slackbot Options: I can tell you a joke or give you an inspirational quote, your choice!',
        ':robot_emoji:'
    );
}

function tellJoke() {
    axios.get('https://api.chucknorris.io/jokes/random')
        .then(res => {
            const joke = res.data.value;

            bot.postMessageToChannel(
                'coding',
                `:bangbang: ${joke}`
            );
        }
    );
}

function inspire() {
    axios.get('https://raw.githubusercontent.com/BolajiAyodeji/inspireNuggets/master/src/quotes.json')
        .then(res => {
            const data = res.data;
            const random = Math.floor(Math.random() * data.length)
            const quote = data[random].quote;
            const author = data[random].author;

            bot.postMessageToChannel(
                'coding',
                `:angel: ${quote} -- ${author}`
            );
        }
    );
}

// Slack App directory submission 302 server
const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {

    if (req.url === '/') {
        res.writeHead(302, { "Location": "https://" + 'slack.com' });
        return res.end();
    } else {
        fs.readFile(req.url.substring(1),
            function(err, data) {
                if (err) throw err;
                res.writeHead(200);
                res.write(data.toString('utf8'));
                return res.end();
            });
    }
}).listen(`${process.env.PORT}`, () => {
    pingMyDyno('https://pure-meadow-11847.herokuapp.com/');
});
