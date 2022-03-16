import * as functions from "firebase-functions";
import {initializeApp} from "firebase/app"
import {getDatabase, ref, get} from "firebase/database";

import {requireAdmin} from "./dooractUtils";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

const firebaseConfig = require("../../../config/firebaseConfig.json");
const app = initializeApp(firebaseConfig);

export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});

export const getRealTimeDB = functions.https.onRequest((request, response) => {
    requireAdmin(request.body["AdminKey"], () => {
        const db = getDatabase(app);
        let name = request.body["dbName"]
        if (name) {
            get(ref(db, name)).then(data => {
                response.send(data)
            }).catch(err => {
                response.send(err)
            })
        } else {
            response.send("dbName is required");
        }
    }, () => {
        response.send("AdminKey is required");
    })
});