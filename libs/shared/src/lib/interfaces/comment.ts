export interface Comment {
  _id: any;
  bookId: string;
  authorId?: string;
  text: string;
  createdAt: number;
}

export interface AddCommentResponse {
  addComment: Comment;
}
