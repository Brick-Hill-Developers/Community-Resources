// memberFeatures.js (v1.1), created by podnf

const vipitem = 147708 // Replace this with your item ID

const colorcodeRegex = /\\c[0-9]/g
const hexcodeRegex = /(\[#[0-9a-fA-F]{6}\])/g
const internalcodeRegex = /<color:[0-9A-F]{6}>/g

vips = [] // array of vip userids

Game.on("playerJoin", async(p) => {
	let hasVIP = await p.ownsAsset(vipitem)
	if (hasVIP) {
		vips.push(p.userId)
	}
})

Game.on("chat", (p,msg) => {
	if (vips.includes(p.userId)) {
		Game.messageAll(`[#FFDE0A][VIP]${p.username}: [#FFFFFF]${msg}`)
	} else {
		if (msg.match(colorcodeRegex) !== null ||
			msg.match(hexcodeRegex) !== null ||
			msg.match(internalcodeRegex) !== null) {
			
			msg.replace(colorcodeRegex, "");
			msg.replace(hexcodeRegex, "")
			msg.replace(internalcodeRegex, "")
			p.message("[#FFDE0A][VIP]Purchase VIP to use colors!")
		}
		Game.messageAll(`[#999999]${p.username}: ${msg}`)
	}
})
