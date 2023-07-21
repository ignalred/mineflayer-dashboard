const express = require('express');
const http = require('http');
const cors = require('cors');
const mineflayer = require('mineflayer');
const path = require('path');
const app = express();
const server = http.createServer(app);

const version = '0.1';

const makeid = (amnt) => require('crypto').randomBytes(amnt).toString('hex');

const mcServer = process.env.HOST || "kaboom.pw";
const port = process.env.PORT || 3495;

const bot = mineflayer.createBot({
	host: mcServer,
	username: "mfdb" + makeid(5),
	version: '1.16.5',
});

bot.autoop = false;
bot.blacklisted = [];
bot.cloops = [];
bot.messages = [];
bot.chatQueue = [];
bot.c = (...m) => bot.chatQueue.push(m.join(' '));

bot.on('spawn', () => {
	bot.c('/minecraft:op @s[type=player]')
	bot.c('/nick &d&lMineflayerDBDevtest')
	bot.c('/c on')
	bot.c('/v on')
	bot.c('&dThis bot is run using MineflayerDB, server version', version);
});

bot.on('kicked', console.log)
bot.on('error', console.log)

bot.on('chat', (username, message, translate, jsonMsg) => {
	if (username === bot.username) return;
	if (message.includes('/deop')) {
		if (autoop != true) return;
		bot.chat('/op @a')
		// I'm not sure if we wanna just OP ourselves
		// bot.chat('/op ' + bot.username)
		// or
		// bot.chat('/op @s[type=player]')
	}
	bot.blacklisted.forEach(blacklistPerson => {
		bot.chat(`/deop ${blacklistPerson}`);
	})
	bot.messages.push({username, message})
});

setInterval(() => {
	if (!bot.chatQueue.at(0)) return;
	bot.chat(bot.chatQueue[0]);
	bot.chatQueue.shift();
}, 150)

app.use(express.json()) // We now use JSON for POSTing.
app.use(cors())

const routes = new Map();
routes.set('/chat', require(path.resolve('./routes/chat.js')))
routes.set('/blacklist', require(path.resolve('./routes/blacklist.js')))
routes.set('/cloop', require(path.resolve('./routes/cloop.js')))

app.use(express.static(path.resolve('./public/')))

routes.forEach(route => {
	if(route.method == 'post') {
		app.post('/' + route.route, (req, res) => {
			let stopped = false;
			console.log('pr', route.route)
			route.intents.forEach((i) => {
				console.log('ci', i)
				if(!req.body[i]) {
					stopped = true
					console.log('ni', i, 'stopping')

				};
			})
			console.log('cs')
			if (stopped) return;
			console.log('exec')
			route.exec({req, res, bot})
		})
	} else if ('/' + route.method == 'get') {
		app.get(route.route, (req, res) => {
			route.exec({req, res, bot})
		})
	}
})


server.listen(port, () => {
	console.log(`Server listening at ${port}`);
});