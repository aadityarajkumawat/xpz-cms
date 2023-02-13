import express from "express";
import { prisma } from "./prisma";
import { PostDataValidator, postDataValidator } from "./validators";

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.send("Xpz CMS Service");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }

  return res.status(500).json("Internal Server Error");
});

app.post("/login", (req, res) => {});

app.post("/create-post", async (req, res) => {
  const body = req.body as PostDataValidator;

  const isValid = postDataValidator.safeParse(req.body);

  if (!isValid.success) {
    return res.status(400).send(isValid.error);
  }

  const { authorId, ...postData } = body;

  try {
    const post = await prisma.post.create({
      data: {
        authorId,
        post: postData,
      },
    });
    return res.status(201).json(post);
  } catch (error) {
    return res.status(201).json("Internal Server Error");
  }
});

app.post("/publish-post/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const latestPost = await prisma.post.findFirst({
      where: {
        postId,
      },
    });

    if (!latestPost) {
      return res.status(404).json("Post not found");
    }

    // push the post to the published posts table
    await prisma.postLog.create({
      data: {
        authorId: latestPost.authorId,
        post: latestPost.post,
      },
    });

    return res.status(200).json(latestPost);
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
});

app.post("/update-post/:postId", async (req, res) => {
  const { postId } = req.params;

  const { authorId, ...postData } = req.body as PostDataValidator;

  try {
    const post = await prisma.post.update({
      data: {
        post: postData,
      },
      where: {
        postId,
      },
    });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
});

app.get("/get-post/:postId", async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json("Post Id is required");
  }

  try {
    const post = await prisma.post.findUnique({ where: { postId } });

    if (!post) {
      return res.status(404).json("Post not found");
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
});

app.post("/all-posts/:authorId", async (req, res) => {
  const { authorId } = req.body;

  if (!authorId) {
    return res.status(400).json("Author Id is required");
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId,
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
