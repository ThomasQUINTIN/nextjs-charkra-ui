import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { NextResponse } from 'next/server';
import { Container, ContainerSchema } from './types.dto';
import completionsParamsJson from './completions-params.json'
import { put } from '@vercel/blob';
import { createImageCitation } from '@/lib/sharp/citation';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export type Theme = keyof typeof completionsParamsJson;
async function generatePostContents(theme: Theme, prompt: string) {
    // return {
    //     choices: [
    //         {
    //             message: {
    //                 parsed: [{
    //                     caption: {
    //                         content: "Hello world",
    //                         hashtags: ["#hello", "#world"]
    //                     },
    //                     background: {
    //                         value: "#000000",
    //                         type: "color"
    //                     },
    //                     citation: {
    //                         content: prompt,
    //                         color: "#ffffff",
    //                         positions: "center"
    //                     }
    //                 }]
    //             }
    //         }
    //     ]
    // }
    const completionsParams = completionsParamsJson[theme] as OpenAI.Chat.Completions.ChatCompletionMessageParam[]

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [
            ...completionsParams,
            {
                role: 'user',
                content: prompt
            }
        ],
        n: 1,
        temperature: 0.8,
        max_tokens: 1000,
        response_format: zodResponseFormat(ContainerSchema, "base"),
    })
    return {
        ...completion,
        choices: completion.choices.map((choice) => ({
            ...choice,
            message: {
                ...choice.message,
                parsed: (JSON.parse(choice.message.content ?? "{}") as Container).container
            }
        }))
    }
}

export async function POST(request: Request) {
    const { prompt, theme }: { prompt?: string, theme?: Theme } = await request.json();

    if (!theme) {
        return NextResponse.json({ error: "Theme is required" }, { status: 400 });
    }

    if (!prompt) {
        return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const { choices } = await generatePostContents(theme, prompt);
    const posts: Container[] = choices.map((choice) => ({
        container: choice.message.parsed,
        theme,
        prompt
    }));

    return NextResponse.json(await Promise.all(posts.map(async (post) => {
        return {
            ...post,
            container: await Promise.all(post.container.map(async (element) => {
                const buffer = await createImageCitation(element);
                const blob = await put(`${Date.now()}.jpg`, buffer, {
                    access: 'public',
                    addRandomSuffix: true,
                    cacheControlMaxAge: 600,
                });

                return {
                    ...element,
                    image: blob.url
                }
            }))
        }
    })));
}