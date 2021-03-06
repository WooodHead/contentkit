// @flow
import gql from 'graphql-tag'

export const findIndex = (arr, id) => {
  let index = 0
  while (index < arr.length) {
    if (arr[index].id === id) {
      break
    }
    index++
  }
  return index >= arr.length ? -1 : index
}

export const CREATE_PROJECT = gql`
  mutation ($name: String!, $userId: ID!) {
    createProject(name: $name, userId: $userId) {
      name
      id
      domains {
        id
      }
    }
  }
`

export const UPDATE_PROJECT = gql`
  mutation ($id: ID!, $name: String!) {
    updateProject (
      id: $id,
      name: $name
    ) {
      id
      name
      domains {
        id
        name
      }
    }
  }
`

export const DELETE_PROJECT = gql`
  mutation ($id: ID!) {
    deleteProject (
      id: $id
    ) {
      id
    }
  }
`

export const PROJECTS_QUERY = gql`
  query ($id: ID!) {
    allProjects(filter: {
      user: {
        id: $id
      }
    }) {
      id
      name
      domains {
        id
        name
      }
    }
  }
`
