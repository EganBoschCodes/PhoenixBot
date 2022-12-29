const admin = require("firebase-admin");
const { sleep } = require("../utils.js");

require('dotenv').config();
const SERVICE_ACCOUNT = require("../../firebase-info.json");

let db;

module.exports = {
    Collections : {
        GUILD_SETTINGS: "GuildSettings",
        USER_DATA: "UserData"
    },

    initFirebase: async () => {

        await admin.initializeApp({
            credential: admin.credential.cert(SERVICE_ACCOUNT),
        });

        db = admin.firestore();
        console.log(`Firebase initialized.`);
    },

    getCollection: async (name) => {
        return await db.collection(name);
    },

    get: async (collection, doc) => {
        let dataRef = await db.collection(collection).doc(doc).get();
        return dataRef.exists ? dataRef.data() : undefined;
    },

    getDefault: async (def, collection, doc) => {
        let dataRef = await db.collection(collection).doc(doc).get();
        
        return dataRef.exists ? updateSettings(def, dataRef.data()) : def;
    },

    set: (collection, doc, obj) => {
        db.collection(collection).doc(""+doc).set(obj);
    },

    exists: async (collection, doc) => {
        let dataRef = await db.collection(collection).doc(doc).get();
        return dataRef.exists;
    },

    getCollectionAsObj: async (collection) => {
        const colRef = await db.collection(collection);
        const snapshot = await colRef.get();
        let colObj = {};
        let counter = 0;

        snapshot.forEach((doc) => {
            let obj = doc.data();
            colObj[doc.id] = obj; 
            counter++;
        });

        while (counter < snapshot.size) { sleep(10); }

        return colObj;
    },

    deleteEntry: async (collection, doc) => {
        let collectionRef = db.collection(collection);
        await collectionRef.doc(""+doc).delete();
    },

    deleteCollection: async (collection) => {
        const colRef = await db.collection(collection);
        const snapshot = await colRef.get();

        snapshot.forEach(async (doc) => {
            colRef.doc(doc.id).delete();
        });
    }
}



let updateSettings = (def, stored_data) => {
    for (let attribute in stored_data) {
        def[attribute] = stored_data[attribute];
    }
    return def;
}