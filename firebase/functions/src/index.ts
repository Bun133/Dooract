import * as functions from "firebase-functions";
import {ref, get, set, update, runTransaction, push} from "firebase/database";
import {handleRequestAdmin} from "./dooractUtils";
import {DatabaseReference, DataSnapshot, TransactionResult} from "@firebase/database";


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
        getRealTimeDBFunc(request.body["dbPath"]).then(data => {
            response.status(200).send({"status": true, data: data});
        }).catch(error => {
            response.status(500).send({"status": false, error: error});
        });
    })
});

/**
 * Need To Auth
 */
function getRealTimeDBFunc(dbPath: string): Promise<DataSnapshot> {
    const db = app.database();
    const r = ref(db, dbPath);
    return get(r);
}

/**
 * Force Set Data using Admin SDK
 */
export const setRealTimeDB = functions.https.onRequest((request, response) => {
    handleRequestAdmin(request, response, () => {
        setRealTimeDBFunc(request.body["dbPath"], request.body["data"]).then(data => {
            response.status(200).send({
                "status": true
            })
        }).catch(err => {
            response.status(400).send({
                "status": false,
                "error": err
            })
        })
    })
});

/**
 * Need To Auth
 */
function setRealTimeDBFunc(dbPath: string, data: any): Promise<void> {
    if (dbPath && data) {
        const db = app.database();
        const r = ref(db, dbPath);
        return set(r, data);
    }
    return Promise.reject("dbPath and data are required");
}

export const updateRealTimeDB = functions.https.onRequest((request, response) => {
    handleRequestAdmin(request, response, () => {
        updateRealTimeDBFunc(request.body["dbPath"], request.body["data"]).then(data => {
            response.status(200).send({
                "status": true
            })
        }).catch(err => {
            response.status(400).send({
                "status": false,
                "error": err
            })
        })
    })
});

function updateRealTimeDBFunc(dbPath: string, data: any): Promise<void> {
    if (dbPath && data) {
        const db = app.database();
        const r = ref(db, dbPath);
        return update(r, data);
    }
    return Promise.reject("dbPath and data are required");
}

/*
export const transactionRealTimeDB = functions.https.onRequest((request, response) => {
    handleRequestAdmin(request, response, () => {
        transactionRealTimeDBFunc(request.body["dbPath"], eval(request.body["data"])).then(data => {
            response.status(200).send({
                "status": true
            })
        }).catch(err => {
            response.status(400).send({
                "status": false,
                "error": err
            })
        })
    })
});
*/

// @ts-ignore
function transactionRealTimeDBFunc(dbPath: string, data: (arg0: any) => unknown): Promise<TransactionResult> {
    if (dbPath && data) {
        const db = app.database();
        const r = ref(db, dbPath);
        return runTransaction(r, data);
    }
    return Promise.reject("dbPath and data are required");
}

export const pushRealTimeDB = functions.https.onRequest((request, response) => {
    handleRequestAdmin(request, response, () => {
        pushRealTimeDBFunc(request.body["dbPath"], request.body["data"]).then(data => {
            response.status(200).send({
                "status": true
            })
        }).catch(err => {
            response.status(400).send({
                "status": false,
                "error": err
            })
        })
    })
});

function pushRealTimeDBFunc(dbPath: string, data: any): Promise<DatabaseReference> {
    if (dbPath && data) {
        const db = app.database();
        const r = ref(db, dbPath);
        return push(r, data).then();
    }
    return Promise.reject("dbPath and data are required");
}