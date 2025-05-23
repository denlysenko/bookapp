import { Log } from '@bookapp/shared/interfaces';
import { Document, Types } from 'mongoose';

export interface LogModel extends Omit<Log, 'id'>, Document<Types.ObjectId> {}
