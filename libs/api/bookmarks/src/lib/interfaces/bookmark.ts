import { Bookmark } from '@bookapp/shared/interfaces';
import { Document } from 'mongoose';

export interface BookmarkModel extends Bookmark, Document {
  _id: any;
}
