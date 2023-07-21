module.exports = {
	route: "autoop",
	method: 'post',
	exec: ({req, res, bot}) => {
		if ('modeset' in req.body)
			bot.autoop = req.body.modeset;
			res.sendStatus(200);
		
	}
}