"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusValidator = void 0;
var zod_1 = require("zod");
exports.OrderStatusValidator = zod_1.z.object({
    orderId: zod_1.z.string(),
});
