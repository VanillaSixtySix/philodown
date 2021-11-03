import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { extname, join } from 'path';
import { outputPaths } from './index';
import { Image } from './interfaces';
import config from '../config.json';
import { pipeline } from 'stream';
import { promisify } from 'util';
import * as fetch from 'node-fetch';

const streamPipeline = promisify(pipeline);

export async function fetchMetadata(id): Promise<Image> {
    return await fetch(`http${config.https && 's'}://${config.origin}/api/v1/json/images/${id}?key=${config.apiKey}`)
        .then(res => res.json())
        .then(res => res.image)
        .catch(err => err);
}

export async function getImageMetadata(id: number, fetchIfMissing: boolean = true) {
    return await fs.readFile(join(outputPaths.imageMetadata, `${id}.json`), 'utf8')
        .then(JSON.parse, async err => {
            if (err.code === 'ENOENT' && fetchIfMissing) {
                // Assume we can fetch the metadata now
                return await fetchMetadata(id);
            }
        });
}

export async function saveImageMetadata(image: Image) {
    return fs.writeFile(join(outputPaths.imageMetadata, `${image.id}.json`), JSON.stringify(image), 'utf8');
}

export async function downloadImage(id: number, metadata?: Image, iteration: number = 1) {
    // Rare that we'd need to retry
    if (iteration > 1) {
        if (iteration > config.maxDownloadAttempts) return;
        console.warn(`Retrying image download for ${id || metadata?.id}; attempt ${iteration}/${config.maxDownloadAttempts}`);
    }
    metadata = metadata || await fetchMetadata(id);
    if (metadata.representations?.full == null) {
        setTimeout(async () => await downloadImage(id, metadata, iteration + 1), config.downloadAttemptRetryTime);
        return;
    }
    const image = await fetch(metadata.representations.full).catch(err => err);
    if (image == null || image instanceof Error || image.toString().startsWith('<html>')) {
        setTimeout(async () => await downloadImage(id, metadata, iteration + 1), config.downloadAttemptRetryTime);
        return;
    }
    const extension = extname(metadata.representations.full);
    const writeStream = createWriteStream(join(outputPaths.images, `${metadata.id}${extension}`));
    // @ts-ignore
    await streamPipeline(image.body, writeStream);
}
