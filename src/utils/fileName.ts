import { fileURLToPath } from 'node:url';
import path from 'node:path'

/**
 * Get the current file name
 * pass in import.meta.url
 * */
export const getFileName = (fileName: string) => {
    const __filename = fileURLToPath(fileName);
    const rmFileType =  path.basename(__filename).split('.')[0]
    return `\\${rmFileType}`
}