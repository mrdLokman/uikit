"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductQueryValidator = void 0;
var zod_1 = require("zod");
var query_validator_1 = require("./query-validator");
exports.ProductQueryValidator = zod_1.z.object({
    limit: zod_1.z.number().min(1).max(100),
    cursor: zod_1.z.number().nullish(),
    query: query_validator_1.QueryValidator,
});
