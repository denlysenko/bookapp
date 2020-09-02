import { User } from './user';

export interface Comment {
  _id: any;
  bookId: string;
  authorId?: string;
  author: User;
  text: string;
  createdAt: number;
}

export interface AddCommentResponse {
  addComment: Comment;
}
