"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("./prisma");
const validators_1 = require("./validators");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.send("Xpz CMS Service");
});
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password,
            },
        });
        return res.status(201).json(user);
    }
    catch (error) {
        console.log(error);
    }
    return res.status(500).json("Internal Server Error");
});
app.post("/login", (req, res) => { });
app.post("/create-post", async (req, res) => {
    const body = req.body;
    const isValid = validators_1.postDataValidator.safeParse(req.body);
    if (!isValid.success) {
        return res.status(400).send(isValid.error);
    }
    const { authorId } = body, postData = __rest(body, ["authorId"]);
    try {
        const post = await prisma_1.prisma.post.create({
            data: {
                authorId,
                post: postData,
            },
        });
        return res.status(201).json(post);
    }
    catch (error) {
        return res.status(201).json("Internal Server Error");
    }
});
app.post("/publish-post/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const latestPost = await prisma_1.prisma.post.findFirst({
            where: {
                postId,
            },
        });
        if (!latestPost) {
            return res.status(404).json("Post not found");
        }
        await prisma_1.prisma.postLog.create({
            data: {
                authorId: latestPost.authorId,
                post: latestPost.post,
            },
        });
        return res.status(200).json(latestPost);
    }
    catch (error) {
        return res.status(500).json("Internal Server Error");
    }
});
app.post("/update-post/:postId", async (req, res) => {
    const { postId } = req.params;
    const _a = req.body, { authorId } = _a, postData = __rest(_a, ["authorId"]);
    try {
        const post = await prisma_1.prisma.post.update({
            data: {
                post: postData,
            },
            where: {
                postId,
            },
        });
        return res.status(200).json(post);
    }
    catch (error) {
        return res.status(500).json("Internal Server Error");
    }
});
app.get("/get-post", async (req, res) => {
    const posts = await prisma_1.prisma.post.findMany();
});
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
//# sourceMappingURL=index.js.map