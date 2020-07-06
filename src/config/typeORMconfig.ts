import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from '../models/';
import { pg_username, pg_password, db_name, host } from './envConfig';

export const typeOrmConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: host,
    port: 5432,
    username: pg_username,
    password: pg_password,
    database: db_name,
    synchronize: true,
    logging: false,
    entities: [
        User
    ]
};