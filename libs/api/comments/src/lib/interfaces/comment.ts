import { Comment } from '@bookapp/shared';
import { Document } from 'mongoose';

export interface CommentModel extends Comment, Document {}
