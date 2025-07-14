import { gql } from '@apollo/client/core';

export const ProfileFragment = gql`
  fragment Profile on User {
    id
    email
    firstName
    lastName
    displayName
    avatar
    roles
    reading {
      epubUrl
      bookmark
    }
  }
`;

export const CreatedBookFragment = gql`
  fragment CreatedBook on Book {
    id
    title
    author
    description
    coverUrl
    epubUrl
    paid
    price
  }
`;

export const FreeBooksFragment = gql`
  fragment FreeBooks on Book {
    id
    title
    author
    coverUrl
    url
    rating
    total_rates
    total_rating
    paid
  }
`;

export const PaidBooksFragment = gql`
  fragment PaidBooks on Book {
    id
    title
    author
    coverUrl
    url
    rating
    total_rates
    total_rating
    price
    paid
  }
`;

export const BookFragment = gql`
  fragment Book on Book {
    id
    title
    author
    coverUrl
    epubUrl
    description
    rating
    total_rates
    total_rating
    price
    paid
    views
    slug
    url
    comments {
      id
      author {
        displayName
      }
      text
      createdAt
    }
  }
`;
