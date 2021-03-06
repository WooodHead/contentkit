// @flow
import gql from 'graphql-tag'
import fragments from '../../lib/fragments'

export const USER_QUERY = gql`
  query userQuery {
    user {
      ...UserFields
    }
  }
  ${fragments.user}
`

export const AUTHENTICATE_USER = gql`
  mutation(
    $email: String!
    $password: String!
  ) {
    authenticateUser(
      email: $email,
      password: $password
    ) {
      token
    }
  }
`

export const SIGNUP_USER = gql`
  mutation(
    $email: String!,
    $password: String!,
  ) {
    signupUser(email: $email, password: $password) {
      id
    }
    authenticateUser(
      email: $email,
      password: $password
    ) {
      token
    }
  }
`
