"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSessionValidator = void 0;
var zod_1 = require("zod");
exports.PaymentSessionValidator = zod_1.z.object({
    productIds: zod_1.z.array(zod_1.z.string()),
});
