import { gql } from '@apollo/client/core';

export const ADD_COMMENT_MUTATION = gql`
  mutation addComment($bookId: ID!, $text: String!) {
    addComment(bookId: $bookId, text: $text) {
      id
      author {
        displayName
      }
      text
      createdAt
    }
  }
`;
