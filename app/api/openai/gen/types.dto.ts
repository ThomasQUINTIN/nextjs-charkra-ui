import { z } from "zod";
import { Theme } from "./route";

export const ContainerSchema = z.object({
    container: z.array(
        z.object({
            caption: z.object({
                content: z.string(),
                hashtags: z.array(z.string()).optional()
            }),
            background: z.object({
                type: z.enum(['color', 'image', 'video']),
                value: z.union([z.string(), z.array(z.string())])
            }),
            citation: z.object({
                content: z.string(),
                color: z.string(),
                positions: z.enum(['top', 'bottom', 'left', 'right', 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'left-center', 'right-center'])
            }).optional()
        })
    )
})
export type Container = {
    container_id?: string
    theme?: Theme
    prompt?: string
} & z.infer<typeof ContainerSchema>
export type ContainerElements = Container['container']
export type ContainerElement = ContainerElements[number]
type Caption = ContainerElements[number]['caption']
type Background = ContainerElements[number]['background']
type Citation = ContainerElements[number]['citation'] | undefined

export type { Caption, Background, Citation }