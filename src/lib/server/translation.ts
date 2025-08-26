import fs from 'fs'
import * as path from 'path'

interface Translations {
    [key: string]: {
        [language: string]: string;
    };
}

let translationsCache: Translations | null = null;

export function getTranslations(): Translations {
    if (!translationsCache) {
        try {
            const filePath = path.join(process.cwd(), 'static/strings.json');
            const fileContent = fs.readFileSync(filePath, 'utf8');
            translationsCache = JSON.parse(fileContent);
        } catch (error) {
            console.error('Failed to load translations:', error);
            translationsCache = {};
        }
    }
    return translationsCache || {};
}