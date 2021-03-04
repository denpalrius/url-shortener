import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    const mongoServer = new MongoMemoryServer({
      instance: { dbName: 'url_shortener_db' },
    });

    const dbUri = await mongoServer.getUri();

    console.log('dbUri:', dbUri);

    const mongooseOptions: MongooseModuleOptions = {
      uri: dbUri,
      connectionFactory: (connection) => connection,
    };
    return mongooseOptions;
  }
}
