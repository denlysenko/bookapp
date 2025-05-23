import { gql } from '@apollo/client/core';

export const LOGS_QUERY = gql`
  query logs($skip: Int, $first: Int, $orderBy: LogOrderByInput) {
    logs(skip: $skip, first: $first, orderBy: $orderBy) {
      count
      rows {
        id
        action
        createdAt
        book {
          id
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
  query lastLogs {
    logs(skip: 0, first: 3, orderBy: createdAt_desc) {
      rows {
        id
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
  subscription ($userId: ID!) {
    logCreated(userId: $userId) {
      id
      action
      createdAt
      book {
        title
        author
      }
    }
  }
`;
