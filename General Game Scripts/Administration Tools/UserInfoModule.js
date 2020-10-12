//How to use:
//put this script in the user_scripts folder.
//in any OTHER script that uses this put "var UserInfo = require('./../user_scripts/UserInfoModule.js')" at the top.

//Below is stuff you can do with this.
//UserInfo.isOwner(player) - check if the player is the owner of the set
//UserInfo.BHTValue(player) - get the user's brick-hill.trade info (if it exists)
//UserInfo.GetCrate(player, filter) - get the user's crate. Valid filters are: all (hats, tools, faces, heads, figures), hat, tool, face, head, tshirt, shirt, pants, special, figure, or everything (to get their entire crate)
//UserInfo.GetForumPosts(player) - get the user's forum post count

const phin = getModule('phin')
const sortMethods=["all", "hat", "tool", "face", "head", "tshirt", "shirt", "pants", "special", "figure"]
const uniqueSorts=["all", "tshirt", "shirt", "pants"]

var UserInfo = {

	isOwner: async function (p) {
		let SetInfo = await phin("https://www.brick-hill.com/api/profile/sets/" + p.userId)
		let JSONSetInfo = JSON.parse(SetInfo.body.toString())
		if (JSONSetInfo.data.some(set => set.id == Game.gameId)) {
			p.owner=true
			return true
		} else return false
	},
	BHTValue: async function (p) {
		let TradeInfo = await phin("https://brick-hill.trade/api/extension/user/" + p.userId)
		let JSONTradeInfo = JSON.parse(TradeInfo.body)
		p.TradeInfo = JSONTradeInfo.user
		if (p.TradeInfo.status=="error") return console.warn("Error getting brick-hill.trade data")
		return p.TradeInfo
	},
	
	GetCrate: async function (p, sort) {
		//if the clear parameter is true, or the player doesn't have a crate array, clear the crate array
		if (!p.crate) p.crate=[]
		//normal filter method
		if (sortMethods.includes(sort) && sort!=="everything") {

			//get the first page, as the page count is returned from the function
			let pageCount = await doSort(p, sort, 1)
			
			//get every other page, ignoring the page count
			for (let i=2; i<=pageCount; i++) {
				doSort(p, sort, i)
				await sleep(350)
			}

			//all items put in array
			} else if (sort=="everything") {
				for (let sorts of uniqueSorts) {
					let pageCount = await doSort(p, sorts, 1)
					for (let i=2; i<=pageCount; i++) {
						doSort(p, sorts, i)
						await sleep(350)
					}
				}
	
			//error if the filter isn't valid.
			} else return console.error("Invalid filter.")
		//return the crate array
		return p.crate
	},
	
	GetForumPosts: async function (p) {
		var playerexists=false
		for (let players of Game.players) {
			if (p==players) playerexists=true
		}

		if (playerexists==false) return console.log("player doesn't exist")

		let userProfile = await phin("https://www.brick-hill.com/user/" + p.userId)
		//removes whitespace so it can remove everything else
		let string1 = userProfile.body.toString().replace(/\s/g, '')

		//removes most characters before forum post integer
		let string2 = string1.replace(/(.)*id="foru/m, '')

		//removes "," because it messes the result up if user has more than 999 posts
		let string3 = string2.replace(/,/g, '')
	
		//gets the forum post number
		let forumPosts = string3.match(/\d+/).shift();

		p.forumPosts = parseInt(forumPosts)
		return p.forumPosts
	}
	
}

//below is just the massive function that GetCrate uses.

async function doSort(p, sort, page) {
	//get the page data (for some reason it's a buffer)
	let PageData = await phin("https://www.brick-hill.com/api/profile/crate/" + p.userId + "/" + sort + "/" + page)

	//make it parsed json
	let JSONPageData = JSON.parse(PageData.body.toString())

	for (let item of JSONPageData.data) {
	
		//get some values that usually appear as [object Object]
		let itemValues = JSON.parse(JSON.stringify(item.item))
		let itemObj = {
			name:itemValues.name,
			item_id:item.item_id,
			serial:item.serial,
			special:itemValues.special,
			special_edition:itemValues.special_edition
		}
		//push the item object to the crate array
		p.crate.push(itemObj)
	}
	return JSONPageData.pages.pageCount
}

module.exports = UserInfo
