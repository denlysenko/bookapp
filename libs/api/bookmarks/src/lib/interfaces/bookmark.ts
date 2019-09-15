import { Bookmark } from '@bookapp/shared';
import { Document } from 'mongoose';

export interface BookmarkModel extends Bookmark, Document {}
