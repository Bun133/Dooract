import * as functions from "firebase-functions";
import {ref, get, set} from "firebase/database";
import {handleRequestAdmin} from "./dooractUtils";


const firebaseConfig = require("../../../config/firebase-admin.json");
const admin = require("firebase-admin");
// Initialize Firebase App using Admin SDK.
// using this object should be checked auth by handleRequestAdmin
const app = admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: firebaseConfig["databaseURL"]
});

export const getRealTimeDB = functions.https.onRequest((request, response) => {
    handleRequestAdmin(request, response, () => {
        const db = app.database();
        const name = request.body["dbPath"];
        const r = ref(db, name);
        get(r).then(data => {
            response.status(200).send({data: data});
        }).catch(error => {
            response.status(500).send({error: error});
        });
    })
});

/**
 * Force Set Data using Admin SDK
 */
export const setRealTimeDB = functions.https.onRequest((request, response) => {
    handleRequestAdmin(request, response, () => {
        const db = app.database();
        let name = request.body["dbPath"];
        let data = request.body["data"];
        if (name && data) {
            let r = ref(db, name)
            set(r, data).then(data => {
                response.status(200).send({
                    "status": true
                })
            }).catch(err => {
                response.status(500).send({
                    "status": false,
                    "error": err
                })
            })
        } else {
            response.status(400).send({
                "status": false,
                "error": "dbName and data are required"
            })
        }
    })
});