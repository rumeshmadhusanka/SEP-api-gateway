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
		for (let i = 0; i < this.black_list.length; i++) {
			if (ip === this.black_list[i]){
				return ;
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
				this.black_list.splice(i, 1);
				break
			}
		}
		for (let i = 0; i < this.white_list.length; i++) {
			if (ip===this.white_list[i]){
				console.log("Already on whitelist");
				return ;
			}

		}
		this.white_list.push(ip);
	}

	async removeIPFromBlackList(ip) {

		const index = this.black_list.indexOf(ip);
		if (index > -1) {
			this.black_list.splice(index, 1);
		}
		console.log("Removed ",ip)

	}

	async removeIPFromWhiteList(ip) {

		const index = this.white_list.indexOf(ip);
		if (index > -1) {
			this.white_list.splice(index, 1);
		}
		console.log("Removed ",ip)

	}

	async clearAll() {
		this.black_list = [];
		this.white_list = [];
	}
}

const ip_list_obj = new IPList();

module.exports = ip_list_obj;