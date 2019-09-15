import gql from 'graphql-tag';

export const ADD_COMMENT_MUTATION = gql`
  mutation($bookId: ID!, $text: String!) {
    addComment(bookId: $bookId, text: $text) {
      author {
        displayName
      }
      text
      createdAt
    }
  }
`;
