module.exports = {
	route: "chat",
	method: 'post',
	intents: [ 'type' ],
	exec: ({req, res, bot}) => {
			// Example:
			/*
			Get messages:
				fetch('/chat', {method:'post',  headers: {
      'Content-Type': 'application/json'
    }, body:JSON.stringify({type:'get'})})
			Send message:
				fetch('http://localhost:3495/chat', {method:'post',  headers: {
      'Content-Type': 'application/json'
    }, 
		body:JSON.stringify({type:'send', message:'Testing! from the Mineflayer Dashbaord server :trolled:'})})
			*/
				if (req.body.type == 'get') {
					res.send(JSON.stringify({ messages: bot.messages }))
				} else if (req.body.type == 'send') {
					bot.chat(req.body.message)
					res.sendStatus(200)
				}
	}
}