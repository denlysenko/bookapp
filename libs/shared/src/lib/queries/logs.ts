import { gql } from '@apollo/client';

export const LOGS_QUERY = gql`
  query($skip: Int, $first: Int, $orderBy: LogOrderByInput) {
    logs(skip: $skip, first: $first, orderBy: $orderBy) {
      count
      rows {
        action
        createdAt
        book {
          _id
          title
          author
          url
          paid
        }
      }
    }
  }
`;

export const LAST_LOGS_QUERY = gql`
  query {
    logs(skip: 0, first: 3, orderBy: createdAt_desc) {
      rows {
        action
        createdAt
        book {
          title
          author
        }
      }
    }
  }
`;

export const LOG_CREATED_SUBSCRIPTION = gql`
  subscription($userId: ID!) {
    logCreated(userId: $userId) {
      action
      createdAt
      book {
        title
        author
      }
    }
  }
`;
