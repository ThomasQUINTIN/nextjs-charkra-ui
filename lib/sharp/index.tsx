import { ContainerElement } from '@/app/api/openai/gen/types.dto';
import { Theme } from '@/app/api/openai/gen/route';
import { createImageCitation } from './citation';

async function createImage(element: ContainerElement, theme: Theme): Promise<Buffer> {
    switch (theme) {
        case 'static-citation':
        case 'dynamic-citation':
            return createImageCitation(element);
        default:
            throw new Error(`Unsupported theme: ${theme}`);
    }
}

export { createImage, createImageCitation };