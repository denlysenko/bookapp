import { Comment } from '@bookapp/shared/interfaces';
import { Document, Types } from 'mongoose';

export interface CommentModel extends Omit<Comment, 'id'>, Document<Types.ObjectId> {}
