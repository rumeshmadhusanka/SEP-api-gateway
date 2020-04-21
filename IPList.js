class IPList {

    black_list = ['7677','87979'];
    white_list = [];

    constructor() {
    }

    async addIPtoBlackList(ip) {
        let is_in = false;
        for (let i = 0; i < this.white_list.length; i++) {
            if (ip === this.white_list[i]){
                is_in = true;
                console.log("Already in white list "+ ip);
                break
            }
        }
        if (!is_in){
            this.black_list.push(ip);
            console.log("Added to blacklist: " + ip)
        }
    }

    async addToWhiteList(ip){
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