import { z } from "zod";

export const postDataValidator = z.object({
  authorId: z.string(),
  // post data
  title: z.string(),
  slug: z.string(),
  heroImage: z.string(),
  description1: z.string(),
  description2: z.string(),
  content1: z.string(),
  offerImage: z.string(),
  content2: z.string(),
  offerImage2: z.string(),
  metaTitle: z.string(),
  metaDesc: z.string(),
  metaKeywords: z.string(),
});

export type PostDataValidator = z.infer<typeof postDataValidator>;
