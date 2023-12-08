"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailValidator = void 0;
var zod_1 = require("zod");
exports.VerifyEmailValidator = zod_1.z.object({
    token: zod_1.z.string()
});
