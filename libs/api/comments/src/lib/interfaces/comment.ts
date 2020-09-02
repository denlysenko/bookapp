import { Comment } from '@bookapp/shared/interfaces';
import { Document } from 'mongoose';

export interface CommentModel extends Comment, Document {}
