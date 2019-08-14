import { Book } from '@bookapp/shared/models';

import * as DataLoader from 'dataloader';
import { Connection } from 'mongoose';

import { IDataLoader } from './interfaces/dataloader';

export class BooksDataLoader implements IDataLoader<string, Book> {
  constructor(private readonly dataLoader: DataLoader<string, Book>) {}

  static async create(connection: Connection) {
    // TODO: move all model names to shared
    const bookModel = connection.model('Book');

    const dataloader = new DataLoader(
      async (bookIds: string[]) => {
        const books = await bookModel.find({ _id: { $in: bookIds } }).exec();
        const data = {};
        books.forEach(book => {
          data[book._id] = book;
        });

        return bookIds.map(id => data[id]);
      },
      { cacheKeyFn: id => id.toString() }
    );

    return new BooksDataLoader(dataloader);
  }

  load(id: string) {
    return this.dataLoader.load(id);
  }
}
