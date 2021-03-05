import { Injectable, Logger } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    Logger.log(` ⚡ Initialising Mongo DB server...`);

    const mongoServer = new MongoMemoryServer({
      instance: { dbName: 'url_shortener_db' },
    });

    const dbUri = await mongoServer.getUri();

    Logger.log(` ⚡ Mongo DB server initialised`);
    Logger.log(` ⚡ Successful connection to the database through '${dbUri}'`);

    const mongooseOptions: MongooseModuleOptions = {
      uri: dbUri,
      connectionFactory: (connection) => connection,
    };
    return mongooseOptions;
  }
}
