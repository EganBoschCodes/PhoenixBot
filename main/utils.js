const { EmbedBuilder } = require("discord.js");


module.exports = {

    formatTime: (n) => {
        return n < 12 ? ((n+11)%12 + 1)+":00 AM" : ((n+11)%12 + 1)+":00 PM";
    },

    updateSettings: (def, storedData) => {
        for (let attribute in storedData) {
            def[attribute] = storedData[attribute];
        }
        return def;
    },

    getEmbed() {
        return new EmbedBuilder()
            .setColor(0xc75014)
            .setTimestamp()
            .setFooter({text: "Created By BoschMods", iconURL: 'https://yt3.ggpht.com/ytc/AMLnZu_7dw_4hLdQpkIjn1u7a7i5CsmWp1IF5uZ45dn6mQ=s900-c-k-c0x00ffffff-no-rj'} );
    },

    niceCaps(str, split) {
        return str.toLowerCase().split(split).map((word) => word[0].toUpperCase()+word.substring(1)).join(" ");
    },

    scramble: (input) => {
        let ret = [];
        let arr = [...input];
        while (arr.length > 0) {
            index = Math.floor(Math.random() * arr.length)
            ret.push(arr[index]);
            arr.splice(index, 1);
        }
        return ret;
    },
    
    getCST: () => {
        return new Date(new Date().toLocaleString("en-US", {timeZone: "CST"}));
    },

    getFormattedDate: () => {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth()+1; 
        let year = today.getFullYear();
        if(day<10) { day='0'+day; } 
        if(month<10) { month='0'+month; }

        return `${month}/${day}/${year}`;
    },

    sleep: async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}