import { Bookmark } from '@bookapp/shared/models';
import { Document } from 'mongoose';

export interface BookmarkModel extends Bookmark, Document {}
