class IPList {

    black_list = ['7677','87979'];
    white_list = [];

    constructor() {
    }

    async addIPtoBlackList(ip) {

        this.black_list.push(ip);
        console.log("Added to blacklist: " + ip)
    }

    async removeIPFromBlackList(ip) {

        let index = this.black_list.findIndex(ele => ele === ip);
        console.log(this.black_list.splice(index, 1))

    }

    async clearAll() {
        this.black_list = [];
        this.white_list = [];
    }
}

const ip_list_obj = new IPList();

module.exports = ip_list_obj;