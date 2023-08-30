const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const footer = "© 2023 Invest with Alex";
const logo = "https://cdn.discordapp.com/attachments/889305929135292448/1042130928312520775/IWA_Icon.png";

// Commands
// .subscribe <server> <channel> <alerttype> <role (optional)>
// .unsubscribe <channel>
// .role <channel> <role>
// .leave <server>

const prefix = ".";

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	// CHECK CHANNEL TYPE
	if(message.author.id === client.user.id) return;

	// Command handler
	if(message.content.startsWith(prefix) && message.author.id === '178441912410177537') {
		const commandBody = message.content.slice(prefix.length);
		const args = commandBody.split(' ');
		const command = args.shift().toLowerCase();
		
		// Subscribe to channel 
		if(command === "subscribe" || command === "sub" || command === "add" || command === "bind") {
			if(args.length > 2 || args.length < 1) {
				message.channel.send("Correct usage: .subscribe <alerttype> <role (optional)>");
				return;
			}
			try {
				let server = message.guild.name + ": " + message.guild.id;
				let channel = "<#" + message.channel.id + ">";
				let role = " ";
				if(args.length == 2) {
					role = args[1];
				}
				let alertType = args[0];
				
				if(alertType.toLowerCase() !== 'dividend' && alertType.toLowerCase() !== 'dividends' &&  alertType.toLowerCase() !== 'dividendstocks' && alertType.toLowerCase() !== 'stocks' && alertType.toLowerCase() !== 'theta' && alertType.toLowerCase() !== 'optionselling' && alertType.toLowerCase() !== 'optionsselling' && alertType.toLowerCase() !== 'watchlist' && alertType.toLowerCase() !== 'watchlists' && alertType.toLowerCase() !== 'tradealerts' && alertType.toLowerCase() !== 'tradingview' && alertType.toLowerCase() !== 'trades') {
					message.channel.send("Invalid alert type");
					return;
				}
				
				let content = server + " | " + channel + " | " + alertType + " | " + role + "\n";
				
				// Read file to see if channel exists 
				fs.readFile('servers.txt', 'utf8' , (err, data) => {
					if(err) {
						const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
						message.channel.send("Something went wrong subscribing: " + err);
						channel01.send("Error in wheel trades subscribing");
						return;
					}
					
					if(data.includes(channel) && data.includes(alertType)) {
						message.channel.send("Already subscribed!");
						return;
					}
					
					// Add channel to file
					fs.appendFile('servers.txt', content, err => {
						if(err) {
							const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
							message.channel.send("Something went wrong subscribing");
							channel01.send("Error in wheel trades subscribing");
							return;
						}
						
						message.channel.send("Subscribed to channel " + channel + "!");
						if(role != " ") {
							message.channel.send("Set pinged role to: " + role);
						}
					});
				});	
			}
			catch(err) {
				const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
				message.channel.send("Something went wrong subscribing: " + err);
				channel01.send("Error in wheel trades subscribing");
			}
		}
		
		// Unsubscribe to channel
		else if(command === "unsubscribe" || command === "unsub" || command === "unadd" || command === "remove" || command === "unbind") {
			if(args.length !== 1) {
				message.channel.send("Correct usage: .unsubscribe <alerttype>");
				return;
			}
			try {
				fs.readFile('servers.txt', 'utf8', (err, data) => {
					if(err) {
						const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
						message.channel.send("Something went wrong unsubscribing: " + err);
						channel01.send("Error in wheel trades unsubscribing");
						return;
					}
					
					let channel = "<#" + message.channel.id + ">";
					if(!data.includes(channel)) {
						message.channel.send("Not currently subscribed!");
						return;
					}
					
					let dataArray = data.replace(/\n*$/, "").split('\n');
					let lastIndex = -1;			
					for(let i = 0; i < dataArray.length; i++) {
						if(dataArray[i].includes(channel) && dataArray[i].includes(args[0])) {
							lastIndex = i;
							break;
						}
					}
					
					dataArray.splice(lastIndex, 1);
					
					let updatedData = dataArray.join('\n') + "\n";
					fs.writeFile('servers.txt', updatedData, err => {
						if(err) {
							const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
							message.channel.send("Something went wrong unsubscribing: " + err);
							channel01.send("Error in wheel trades unsubscribing");
							return;
						}
						message.channel.send("Unsubscribed to channel!");
					});
				});
			}
			catch(err) {
				const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
				message.channel.send("Something went wrong unsubscribing: " + err);
				channel01.send("Error in wheel trades unsubscribing");
			}
		}
		
		// Change role 
		else if(command === "role" || command === "setrole" || command === "changerole" || command === "ping") {
			if(args.length != 1) {
				message.channel.send("Correct usage: .role <role>");
				return;
			}
			try {
				fs.readFile('servers.txt', 'utf8', (err, data) => {
					if(err) {
						const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
						message.channel.send("Something went wrong setting role: " + err);
						channel01.send("Error in wheel trades setting role");
						return;
					}
					let dataArray = data.replace(/\n*$/, "").split('\n');
					let changedRole = "";
					let channelToSet = "";
					let channel = "<#" + message.channel.id + ">";
					for(let i = 0; i < dataArray.length; i++) {
						if(dataArray[i].includes(channel)) {
							channelToSet = dataArray[i];
							let channelData = dataArray[i].split(' | ');
							changedRole = channelData[0] + " | " + channelData[1] + " | " + channelData[2] + " | " + args[0];
							break;
						}
					}
					if(changedRole === "") {
						message.channel.send("Subscribe to channel before setting role");
						return;
					}
					
					let result = data.replace(channelToSet, changedRole);
					fs.writeFile('servers.txt', result, err => {
						if(err) {
							const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
							message.channel.send("Something went wrong setting role: " + err);
							channel01.send("Error in wheel trades setting role");
							return;
						}
						message.channel.send("Set pinged role to: " + args[0]);
					});
				});
			}
			catch(err) {
				const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
				message.channel.send("Something went wrong setting role: " + err);
				channel01.send("Error in wheel trades setting role");
			}
		}
		
		// Leave server
		else if(command === "leave" || command === "leaveserver") {
			if(args.length != 1) {
				message.channel.send("Correct usage: .leave <server>");				
				return;
			}
			try {
				let guild = client.guilds.cache.get(args[0]);
				return guild.leave();
			}
			catch(err) {
				const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
				message.channel.send("Something went wrong leaving server: " + err);
				channel01.send("Error in wheel trades leaving server");
				return;
			}
		}
		
		// List of commands
		else if(command === "help" || command === "commands") {
			try {
				message.channel.send("🔹 Subscribe to channel: .subscribe <alerttype> <role (optional)>\n🔹 Unsubscribe to channel: .unsubscribe\n🔹 Set ping role: .role <role>\n🔹 Leave server: .leave <server>\n🔹 List servers: .servers");
			}
			catch(err) {
				const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
				channel01.send("Error in wheel trades help commands");
				return;
			}
		}
		
		// List servers bot is in
		else if(command === "servers" || command === "guilds") {
			try {
				// All servers
				let serverList = "**__List of Servers:__**\n";
				client.guilds.cache.forEach((guild) => {
					let serverId = guild.id;
					let serverName = guild.name;
					serverList += "🔹 " + serverName + ": " + serverId + "\n";
				});
				
				// Subscribed servers
				let subscribedList = "\n**__Subscribed Servers:__**\n";
				fs.readFile('servers.txt', 'utf8' , (err, data) => {
					if(err) {
						const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
						message.channel.send("Something went wrong listing servers: " + err);
						channel01.send("Error in wheel trades listing servers");
						return;
					}
					
					let dataArray = data.replace(/\n*$/, "").split('\n');
					for(let i = 0; i < dataArray.length; i++) {
						let channelData = dataArray[i].split(' | ');
						subscribedList += "🔸 " + dataArray[i] + "\n";  
						//subscribedList += "🔸 " + channelData[0] + " | " + channelData[1] + "\n";
					}
					
					message.channel.send(serverList + " " + subscribedList);
				});	
				
			}
			catch(err) {
				const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
				channel01.send("Error in wheel trades help commands");
				return;
			}			
		}
	}
	
	// Respond to DM
	if(message.channel.type === "dm") {
		let newEmbed = new Discord.MessageEmbed();
		newEmbed.setTimestamp();
		newEmbed.setFooter(footer, logo);
		newEmbed.setTitle("Thank you for your message");
		newEmbed.setDescription("🔹Please do not reply to this bot.\n\n🔹Contact info: <@!178441912410177537>\n\n<:youtube:891223134362009642> In the meantime, check out our YouTube channel: https://bit.ly/2Tbz71P \n\n");
		newEmbed.setColor('#ffff00');
		message.channel.send(newEmbed);
		
		try {
			// MTT #wheel-trades-dms
			const channel02 = client.channels.cache.find(channel => channel.id === '889315165537964082');
			channel02.send("<@" + message.author + ">: " + message.content);
		}
		catch(err) {
			const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
			channel01.send("Error in wheel trades dms");
		}
		return;
	}
	
	// Channels
	const inputOptionsSelling = '880919363601977364'; // Market Trades Testing #options-selling 
	const inputWatchlists = '880919318618046485'; // Market Trades Testing #watchlists
	const inputDividends = '880919343788097636'; // Market Trades Testing #dividend-stocks
	const inputTradeAlerts = '1046577524437684234' // Market Trades Testing #

	
	// Options Selling
	if(message.channel.id === inputOptionsSelling) {
		try{
			optionsSelling(message);
		}
		catch(err) {
			const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
			channel01.send("Error in options selling");
		}
	}
	
	// Watchlists
	else if(message.channel.id === inputWatchlists) {
		try{
			watchlists(message);
		}
		catch(err) {
			const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
			channel01.send("Error in watchlists");
		}
	}
	
	// Dividend Stocks
	else if(message.channel.id === inputDividends) {
		try{
			dividendStocks(message);
		}
		catch(err) {
			const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
			channel01.send("Error in dividend stocks");
		}
	}


	// Trade Alerts
	else if(message.channel.id === inputTradeAlerts) {
		try{
			tradeAlerts(message);
		}
		catch(err) {
			const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
			channel01.send("Error in trade alerts");
		}
	}
});

// Trade Alerts
function tradeAlerts(message) {
	message.embeds.forEach((embed) => {
		let newEmbed = new Discord.MessageEmbed();

		newEmbed.setColor(embed.color);
		newEmbed.setTitle(embed.title);

		newEmbed.setDescription(embed.description);
		
		newEmbed.setFooter(footer, logo);
		newEmbed.setTimestamp();

		// RUN THROUGH TXT FILE FOR CHANNELS TO SEND TO
		
		fs.readFile('servers.txt', 'utf8' , (err, data) => {
			if(err) {
				const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
				channel01.send("Error in wheel trades sending alerts");
				return;
			}

			let dataArray = data.replace(/\n*$/, "").split('\n');
			for(let i = 0; i < dataArray.length; i++) {
				let channelData = dataArray[i].split(' | ');
				let channelid = channelData[1].slice(2, -1);
				if(channelData[2].toUpperCase() !== "TRADEALERTS" && channelData[2].toUpperCase() !== "TRADES" && channelData[2].toUpperCase() !== "TRADINGVIEW") continue;
				let channel02 = client.channels.cache.find(channel => channel.id === channelid);
				let ping = channelData[3];
				channel02.send({"content": ping, "embed": newEmbed.toJSON()});
			}
		});	
		
		
	});
}

// Dividend Stocks
function dividendStocks(message) {
	message.embeds.forEach((embed) => {
		let newEmbed = new Discord.MessageEmbed();

		newEmbed.setColor("#FFFF00");
		newEmbed.setTitle(embed.title);

		newEmbed.setDescription(embed.description);
		newEmbed.setFooter(footer, logo);
		newEmbed.setTimestamp();

		// RUN THROUGH TXT FILE FOR CHANNELS TO SEND TO
		fs.readFile('servers.txt', 'utf8' , (err, data) => {
			if(err) {
				const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
				channel01.send("Error in wheel trades sending alerts");
				return;
			}

			let dataArray = data.replace(/\n*$/, "").split('\n');
			for(let i = 0; i < dataArray.length; i++) {
				let channelData = dataArray[i].split(' | ');
				let channelid = channelData[1].slice(2, -1);
				if(channelData[2].toUpperCase() !== "DIVIDENDSTOCKS" && channelData[2].toUpperCase() !== "DIVIDEND" && channelData[2].toUpperCase() !== "STOCKS" && channelData[2].toUpperCase() !== "DIVIDENDS") continue;
				let channel02 = client.channels.cache.find(channel => channel.id === channelid);
				let ping = channelData[3];
				channel02.send({"content": ping, "embed": newEmbed.toJSON()});
			}
		});
	});
}

// Options Selling
function optionsSelling(message) {
	message.embeds.forEach((embed) => {
		let newEmbed = new Discord.MessageEmbed();

		newEmbed.setColor(embed.color);
		newEmbed.setTitle(embed.title);

		newEmbed.setDescription(embed.description);
		if(embed.description.toUpperCase().includes("PUT") && (embed.title.toUpperCase().includes("SELL TO OPEN") || embed.title.toUpperCase().includes("BUY TO CLOSE"))) {
			newEmbed.setTitle(embed.title + " (Cash Secured Put)");
		}
		else if(embed.description.toUpperCase().includes("CALL") && (embed.title.toUpperCase().includes("SELL TO OPEN") || embed.title.toUpperCase().includes("BUY TO CLOSE"))) {
			newEmbed.setTitle(embed.title + " (Covered Call)");
		}
		
		newEmbed.setFooter(footer, logo);
		newEmbed.setTimestamp();

		// RUN THROUGH TXT FILE FOR CHANNELS TO SEND TO
		
		fs.readFile('servers.txt', 'utf8' , (err, data) => {
			if(err) {
				const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
				channel01.send("Error in wheel trades sending alerts");
				return;
			}

			let dataArray = data.replace(/\n*$/, "").split('\n');
			for(let i = 0; i < dataArray.length; i++) {
				let channelData = dataArray[i].split(' | ');
				let channelid = channelData[1].slice(2, -1);
				if(channelData[2].toUpperCase() !== "OPTIONSSELLING" && channelData[2].toUpperCase() !== "OPTIONSELLING" && channelData[2].toUpperCase() !== "THETA") continue;
				let channel02 = client.channels.cache.find(channel => channel.id === channelid);
				let ping = channelData[3];
				channel02.send({"content": ping, "embed": newEmbed.toJSON()});
			}
		});	
		
		
	});
}

// Watchlists
function watchlists(message) {
	message.embeds.forEach((embed) => {
		let newEmbed = new Discord.MessageEmbed();

		newEmbed.setColor("#ff0000");
		newEmbed.setTitle(embed.title);

		newEmbed.setDescription(embed.description);
		newEmbed.setFooter(footer, logo);
		newEmbed.setTimestamp();

		// RUN THROUGH TXT FILE FOR CHANNELS TO SEND TO
		fs.readFile('servers.txt', 'utf8' , (err, data) => {
			if(err) {
				const channel01 = client.channels.cache.find(channel => channel.id === '847769051609563166');
				channel01.send("Error in wheel trades sending alerts");
				return;
			}

			let dataArray = data.replace(/\n*$/, "").split('\n');
			for(let i = 0; i < dataArray.length; i++) {
				let channelData = dataArray[i].split(' | ');
				let channelid = channelData[1].slice(2, -1);
				if(channelData[2].toUpperCase() !== "WATCHLIST" && channelData[2].toUpperCase() !== "WATCHLISTS") continue;
				let channel02 = client.channels.cache.find(channel => channel.id === channelid);
				let ping = channelData[2];
				channel02.send({"content": ping, "embed": newEmbed.toJSON()});
			}
		});
	});
}


// Login to Discord with your client's token
client.login('TOKEN');