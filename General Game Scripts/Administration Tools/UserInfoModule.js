/**
 * @author Shiggy (Rewritten by Shiggy)
 * @note Original author unknown!
 * @description A set of functions you can use to obain user data.
 * @modules phin (builtin)
 * 
 * How to use: 
 *  Require the userModule by requiring it.
 * 	> const userInfo = require('path/to/UserInfoModule.js')
 * 
 * @method UserModule.isOwner
 * @method UserModule.BHTValue
 * @method UserModule.GetCrate
 * @method UserModule.getForumPosts
 */

//How to use:
//put this script in the user_scripts folder.
//in any OTHER script that uses this put "var UserInfo = require('./../user_scripts/UserInfoModule.js')" at the top.

//Below is stuff you can do with this.
//UserInfo.isOwner(player) - check if the player is the owner of the set
//UserInfo.BHTValue(player) - get the user's brick-hill.trade info (if it exists)
//UserInfo.GetCrate(player, filter) - get the user's crate. Valid filters are: all (hats, tools, faces, heads, figures), hat, tool, face, head, tshirt, shirt, pants, special, figure, or everything (to get their entire crate)
//UserInfo.GetForumPosts(player) - get the user's forum post count

const phin = getModule('phin')
const sortMethods = ["all", "hat", "tool", "face", "head", "tshirt", "shirt", "pants", "special", "figure"]
const uniqueSorts = ["all", "tshirt", "shirt", "pants"]


class UserModule {
	async static isOwner(playerId) {
		if (!p.userId) throw new Error('Player does not have id.')
		let setInfo = await phin(`phin("https://www.brick-hill.com/api/profile/sets/${p.userId}`);
		let dataSet = JSON.parse(setInfo.body.toString()).data;
		if (dataSet.some(set => set.id === Game.gameId)) return true;

		return false;
	}

	async static getValue(playerId) {
		if (!p.userId) throw new Error('Player does not have id');
		let TradeInfo = await phin(`https://brick-hill.trade/api/extension/user/${p.userId}`);
		let dataSet = JSON.parse(TradeInfo.body);
		if (dataSet.user.status === "error") console.warn("[userModule]: Brick-Hill Trade not available.");
		return dataSet.user;
	}

	async static getCrate(playerId, sortMethod) {
		let crate = [];

		if (sorthMethods.includes(sortMethod) && sort !== "everything") {
			let pageCount = await this.doSort(playerId, sortMethod, 1);
			for (let i = 2; i <= pageCount; i++) {
				doSort(p, sort, i);
				await sleep(350)
			}
		}
	}

	async static getForumPosts(player) {
		let playerExists = false;
		for (let players of Game.players) {
			if (p == players) playerexists = true
		}

		if (playerexists == false) return console.warn(`userModule] -> getForumPosts(player) -> Player ${player} does not exist`)

		let userProfile = await phin(`"https://www.brick-hill.com/user/${p.userId}`);
		//removes whitespace so it can remove everything else
		let sanityCheck1 = userProfile.body.toString().replace(/\s/g, '')

		//removes most characters before forum post integer
		let santiyCheck2 = santiyCheck1.replace(/(.)*id="foru/m, '')

		//removes "," because it messes the result up if user has more than 999 posts
		let sanityCheck3 = santiyCheck2.replace(/,/g, '')

		//gets the forum post number
		let forumPosts = sanityCheck3.match(/\d+/).shift();

		p.forumPosts = parseInt(forumPosts);
		return p.forumPosts;
	}

	async static doSort(player, sortMethod, pageNum) {
		let PageData = await phin(`https://www.brick-hill.com/api/profile/crate/${player.userId}/${sortMethod}/${pageNum}`)
		let JSONPageData = JSON.parse(PageData.body.toString());

		for (let item of JSONPageData.data) {
			let itemValues = JSON.parse(JSON.stringify(item.item))
			let itemObj = {
				name: itemValues.name,
				item_id: item.item_id,
				serial: item.serial,
				special: itemValues.special,
				special_edition: itemValues.special_edition
			}
			player.crate.push(itemObj)
		}
		return JSONPageData.pages.pageCount
	}
}


module.exports = UserModule
