module.exports = {
	route: "cloop",
	method: 'post',
	exec: ({req, body}) => {
		if (! 'type' in req.body) res.sendStatus(404);
		if(req.body.type == 'new') {
			if (! 'command' in req.body) res.sendStatus(404);
			cloop = setInterval(() => {
				bot.chat(`/${req.body.command}`)
			}, 135);
			bot.cloops.push(cloop)
		}
		if (req.body.type == 'clear') {
			bot.cloops.forEach(loop => {
				clearInterval(loop);
			})
		}
		res.sendStatus(200);
	}
}