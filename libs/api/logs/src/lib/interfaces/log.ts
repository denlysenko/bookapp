import { Log } from '@bookapp/shared/interfaces';
import { Document } from 'mongoose';

export interface LogModel extends Log, Document {
  _id: any;
}
