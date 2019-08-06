import { Comment } from '@bookapp/shared/models';
import { Document } from 'mongoose';

export interface CommentModel extends Comment, Document {}
