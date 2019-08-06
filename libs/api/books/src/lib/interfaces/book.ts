import { Book } from '@bookapp/shared/models';
import { Document } from 'mongoose';

export interface BookModel extends Book, Document {}
