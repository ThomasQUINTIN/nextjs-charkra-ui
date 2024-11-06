import { NextResponse } from "next/server";
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
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

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generatePostsContents(prompt: string): Promise<Post[]> {
    console.log(prompt)
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [{
            role: 'user',
            content: `Tu es un érudit de la litterature de sénéque, tu as lu tout ces livres et son ouvrage te passionne. Tu as deja fait croitre de nombreuses communautés sur instagram à plus de 100 000 abonnés et tu t'apprêtes a créer un compte instagram sur un de tes sujets de prédilection: les citation de sénéque
            Donne moi 1 carrousels de 4 images à poster sur instagram (le format sera une citation sur un fond de couleur, avec un gradient ou du bruit):

            - citation de sénéque.
            - légende du post (donne moi des comptes instagram que je peux cibler en @). Donne moi aussi des # populaire de ce secteur pour maximiser mon reach. Rendre la légende très humaine, afin qu'il soit très difficile de voir que ca a été généré par une intelligence artificielle. Evoquer les citation du carrousel
            - le style de couleur qui doit se trouver derriere la citation (couleur unie, avec un gradient ou du bruit). Donne moi le code couleur hex et si tu mets un gradient, donne moi la liste de couleur du gradient
            - chaque image du carroussel aura une couleur différente
            
            Le contenu doit être naturel et ne pas sembler généré par une IA.`
        }],
        n: 1,
        temperature: 0.8,
        max_tokens: 1000,
        response_format: zodResponseFormat(PostSchema, "post"),
    });

    return completion.choices.map((choice) => {
        if (!choice.message.content) {
            throw new Error("No content generated");
        }
        return JSON.parse(choice.message.content);
    });
}

async function generateImage(background: Background, citation: string) {
    const image = await fetch('https://mercury-iv-203561060277.europe-west9.run.app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            background: {
                type: background.type,
                value: background.value
            },
            text: citation,
            font_size: 60,
            color: "#fff"
        })
    })

    const base64Data = await image.arrayBuffer();

    return Buffer.from(base64Data).toString('base64');
}

async function generatePost(post: Post) {
    return {
        caption: post.caption,
        hashtags: post.hashtags,
        carousel: await Promise.all(post.carousel.map(async(item) => {
            return {
                citation: item.citation,
                image: await generateImage(item.background, item.citation)
            }
        }))
    }
}

export async function POST(request: Request) {
    const { prompt } = await request.json();
    
    const postsContents = await generatePostsContents(prompt);
    const posts = await Promise.all(postsContents.map(generatePost));

    return NextResponse.json({ posts });
}