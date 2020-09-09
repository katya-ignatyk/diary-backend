import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User, Profile, Note } from '../models';
import { DB_HOST, DB_NAME, DB_PORT, PG_PASSWORD, PG_USERNAME, DB_IS_SYNCHRONIZE, DB_IS_LOGGING } from './envConfig';

export const typeOrmConfig : PostgresConnectionOptions = {
    type: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: PG_USERNAME,
    password: PG_PASSWORD,
    database: DB_NAME,
    synchronize: Boolean(DB_IS_SYNCHRONIZE),
    logging: DB_IS_LOGGING,
    entities: [
        User,
        Profile,
        Note
    ]
};
