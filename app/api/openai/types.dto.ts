import { z } from "zod";

const BackgroundSchema = z.object({
    type: z.enum(['color', 'gradient']),
    value: z.union([z.string(), z.array(z.string())])
});
export type Background = z.infer<typeof BackgroundSchema>;

export const PostSchema = z.object({
    carousel: z.array(z.object({
        citation: z.string(),
        background: BackgroundSchema,
        font_size: z.number(),
        font_color: z.string(),
        font_family: z.string()
    })),
    caption: z.string(),
    // targetAccounts: z.array(z.string()),
    hashtags: z.array(z.string())
});

export type Post = z.infer<typeof PostSchema>;