import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImageService {
    private readonly uploadDir: string;
    private readonly imageBaseUrl: string;

    constructor() {
        this.uploadDir = path.join(process.cwd(), 'assets', 'game-maps');
        this.imageBaseUrl = '/assets/game-maps';
        this.ensureUploadDirectory();
    }

    async saveImage(base64Image: string): Promise<string> {
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const filename = `${uuidv4()}.png`;
        const filepath = this.getFilePath(filename);

        await fs.promises.writeFile(filepath, buffer);
        return filename;
    }

    async deleteImage(filename: string): Promise<void> {
        const filepath = this.getFilePath(filename);
        if (fs.existsSync(filepath)) {
            await fs.promises.unlink(filepath);
        }
    }

    async replaceImage(newBase64Image: string, oldFilename?: string): Promise<string> {
        if (oldFilename) {
            await this.deleteImage(oldFilename);
        }
        return this.saveImage(newBase64Image);
    }

    getImageUrl(filename: string): string {
        if (!filename) return '';
        return `${this.imageBaseUrl.replace(/\/$/, '')}/${filename.replace(/^\//, '')}`;
    }

    private getFilePath(filename: string): string {
        return path.join(this.uploadDir, filename);
    }

    private ensureUploadDirectory(): void {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
}
