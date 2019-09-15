import { Book } from '@bookapp/shared';
import { Document } from 'mongoose';

export interface BookModel extends Book, Document {}
