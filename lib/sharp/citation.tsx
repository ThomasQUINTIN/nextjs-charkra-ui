import { ContainerElement } from "@/app/api/openai/gen/types.dto"
import sharp from "sharp"

export async function createImageCitation(element: ContainerElement) {
    const width = 1200;
    const height = 1200;
    const fontSize = 120;
    const quote = element.citation?.content;
    const backgroundColor = element.background.value;
    const textColor = element.citation?.color;

    if (!quote) {
        throw new Error('Quote is required');
    }

    const maxWidth = width * 0.8;
    const lineHeight = fontSize * 1.2;

    const lines = await wrapText(quote, maxWidth, fontSize);

    const textHeight = lines.length * lineHeight;
    const yOffset = (height - textHeight) / 2;

    const svgText = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${backgroundColor}" />
            <text x="50%" y="${yOffset + fontSize}" font-size="${fontSize}" fill="${textColor}" text-anchor="middle" dominant-baseline="middle" font-family="Doto">
            ${lines.map((line, index) => `<tspan x="50%" dy="${index === 0 ? 0 : lineHeight}">${line}</tspan>`).join('')}
            </text>
        </svg>`;

    const image = sharp(Buffer.from(svgText))
        .jpeg({
            quality: 100
        })
        .resize(width, height, { fit: 'contain' });

    return image.toBuffer()
}

async function wrapText(text: string, maxWidth: number, fontSize: number) {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = `${currentLine} ${word}`;
        const svgText = `<svg><text x="0" y="${fontSize}" font-size="${fontSize}" font-family="Doto">${testLine}</text></svg>`;
        const { width } = await sharp(Buffer.from(svgText)).metadata();

        if (width && width < maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);

    return lines;
}