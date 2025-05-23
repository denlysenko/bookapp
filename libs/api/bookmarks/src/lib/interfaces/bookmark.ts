import { Bookmark } from '@bookapp/shared/interfaces';
import { Document } from 'mongoose';

export interface BookmarkModel extends Omit<Bookmark, 'id'>, Document {}
