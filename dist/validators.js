"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDataValidator = void 0;
const zod_1 = require("zod");
exports.postDataValidator = zod_1.z.object({
    authorId: zod_1.z.string(),
    title: zod_1.z.string(),
    slug: zod_1.z.string(),
    heroImage: zod_1.z.string(),
    description1: zod_1.z.string(),
    description2: zod_1.z.string(),
    content1: zod_1.z.string(),
    offerImage: zod_1.z.string(),
    content2: zod_1.z.string(),
    offerImage2: zod_1.z.string(),
    metaTitle: zod_1.z.string(),
    metaDesc: zod_1.z.string(),
    metaKeywords: zod_1.z.string(),
});
//# sourceMappingURL=validators.js.map