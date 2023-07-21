module.exports = {
	route: "blacklist",
	method: 'post',
	intents: [ 'player' ],
	exec: ({req, bot}) => {
		bot.blacklisted.push(req.body.player);
		res.sendStatus(200);
	}
}