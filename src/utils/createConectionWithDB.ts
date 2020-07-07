import { createConnection } from 'typeorm';
import { typeOrmConfig } from '../config';

export async function createConnectionWithDB() {
    try {
        await createConnection(typeOrmConfig);
        console.log('PG connected.');
    } catch (error) {
        console.error(error.message);
    }
}
