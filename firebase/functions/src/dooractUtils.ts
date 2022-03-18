import {Response} from "firebase-functions";
import "firebase-admin";

const adminConfig = require('../../../config/adminConfig.json');
import {AdminRequestBody} from "./dooractJsonType";
import {Request} from "firebase-functions/lib/common/providers/https";

export function requireAdmin(adminKey: String | null, action: () => void, fail: () => void | null) {
    if (adminKey && adminKey === adminConfig.AdminKey) {
        action();
    } else {
        if (fail) {
            fail();
        }
    }
}

export function handleRequestAdmin(req: Request, res: Response, action: () => void) {
    if (req.body != null) {
        let body = req.body as unknown as AdminRequestBody
        if (body != null) {
            requireAdmin(body.AdminKey, action, () => {
                res.status(401).send({"success": false, "message": "AdminKey is not correct"});
            });
        } else {
            res.status(400).send("Bad Request");
        }
    }
}