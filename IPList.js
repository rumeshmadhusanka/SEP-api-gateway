class IPList {

	black_list = ['172.46.35.89', '153.58.5.54'];
	white_list = ['172.45.23.56'];

	constructor() {
	}

	async addIPtoBlackList(ip) {
		let is_in = false;
		for (let i = 0; i < this.white_list.length; i++) {
			if (ip === this.white_list[i]) {
				is_in = true;
				console.log("Already in white list " + ip);
				break
			}
		}
		if (!is_in) {
			this.black_list.push(ip);
			console.log("Added to blacklist: " + ip)
		}
	}

	async addToWhiteList(ip) {
		for (let i = 0; i < this.black_list.length; i++) {
			if (ip === this.black_list[i]) {
				this.black_list.splice(i, 1)
				break
			}
		}
		this.white_list.push(ip);
	}

	async removeIPFromBlackList(ip) {

		let index = this.black_list.findIndex(ele => ele === ip);
		console.log(this.black_list.splice(index, 1))

	}

	async removeIPFromWhiteList(ip) {

		let index = this.white_list.findIndex(ele => ele === ip);
		console.log(this.white_list.splice(index, 1))

	}

	async clearAll() {
		this.black_list = [];
		this.white_list = [];
	}
}

const ip_list_obj = new IPList();

module.exports = ip_list_obj;