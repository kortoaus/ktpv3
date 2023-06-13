"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// {"isOpen":true}
var getRole = function (role, key) {
    try {
        var parsed = JSON.parse(role);
        return Boolean(parsed[key]);
    }
    catch (e) {
        console.log(e);
        return false;
    }
};
exports.default = getRole;
