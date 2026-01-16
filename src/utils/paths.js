import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const paths = {
    frontend: path.join(__dirname, '..', '..', 'frontend'),
    data: path.join(__dirname, '..', 'data'),
    database: path.join(__dirname, '..', 'database.db')
};

export default paths;