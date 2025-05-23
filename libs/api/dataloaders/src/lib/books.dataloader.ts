import { ModelNames } from '@bookapp/api/shared';
import type { Book } from '@bookapp/shared/interfaces';

import DataLoader from 'dataloader';
import type { Connection } from 'mongoose';

import type { IDataLoader } from './interfaces/dataloader';

export class BooksDataLoader implements IDataLoader<string, Book> {
  constructor(private readonly dataLoader: DataLoader<string, Book>) {}

  static async create(connection: Connection) {
    const bookModel = connection.model(ModelNames.BOOK);

    const dataloader = new DataLoader(
      async (bookIds: string[]) => {
        const books = await bookModel.find({ _id: { $in: bookIds } }).exec();
        const data = {};
        books.forEach((book) => {
          data[book._id] = book;
        });

        return bookIds.map((id) => data[id]);
      },
      { cacheKeyFn: (id) => id.toString() }
    );

    return new BooksDataLoader(dataloader);
  }

  load(id: string) {
    return this.dataLoader.load(id);
  }
}
