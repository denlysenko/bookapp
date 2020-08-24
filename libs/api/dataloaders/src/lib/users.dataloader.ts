import { ModelNames } from '@bookapp/api/shared';
import { User } from '@bookapp/shared';

import * as DataLoader from 'dataloader';
import { Connection } from 'mongoose';

import { IDataLoader } from './interfaces/dataloader';

const EXCLUDED_FIELDS = '-salt -password';

export class UsersDataLoader implements IDataLoader<string, User> {
  constructor(private readonly dataLoader: DataLoader<string, User>) {}

  static async create(connection: Connection) {
    const userModel = connection.model(ModelNames.USER);

    const dataloader = new DataLoader(
      async (userIds: string[]) => {
        const users = await userModel.find({ _id: { $in: userIds } }, EXCLUDED_FIELDS).exec();

        const data = {};

        users.forEach((user) => {
          data[user._id] = user;
        });

        return userIds.map((id) => data[id]);
      },
      { cacheKeyFn: (id) => id.toString() }
    );

    return new UsersDataLoader(dataloader);
  }

  load(id: string) {
    return this.dataLoader.load(id);
  }
}
