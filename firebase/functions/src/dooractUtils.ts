const adminConfig = require('../../../config/adminConfig.json');

export function requireAdmin(adminKey: String | null, action: () => void, fail: () => void | null) {
    if (adminKey && adminKey === adminConfig.AdminKey) {
        action();
    } else {
        if (fail) {
            fail();
        }
    }
}