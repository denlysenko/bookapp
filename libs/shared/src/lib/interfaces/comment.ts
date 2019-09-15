export interface Comment {
  _id: any;
  bookId: string;
  authorId: string;
  text: string;
  createdAt: Date;
}

export interface AddCommentResponse {
  addComment: Comment;
}
