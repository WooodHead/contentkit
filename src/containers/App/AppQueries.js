// @flow
import React from 'react'
import { unstable_deferredUpdates as deferredUpdates } from 'react-dom'
import { Query } from 'react-apollo'
import { POSTS_QUERY, PROJECTS_QUERY } from './queries'
import { DELETE_POST, DELETE_DOCUMENT } from './mutations'
import gql from 'graphql-tag'
import { deletePostAndReferences } from './deletePostAndReferences'
import debounce from 'lodash.debounce'
import { connect } from 'react-redux'
import { selectProject, setEditorState } from '../../redux'
import PropTypes from 'prop-types'

let count = Math.round((window.innerHeight - 230) / 50)

class AppQueries extends React.Component<{
  auth: {
    user: {
      id: string
    }
  }
}> {
  static propTypes = {
    auth: PropTypes.object,
    selectedProject: PropTypes.string,
    setEditorState: PropTypes.func,
    selectProject: PropTypes.func,
    client: PropTypes.object
  }

  state = {
    variables: {
      before: undefined,
      after: undefined,
      first: count,
      query: '',
      id: this.props.auth.user.id,
      projectId: undefined,
      skip: undefined
    }
  }

  handleSearch = debounce(({ query }) => {
    this.setState({ query })
  }, 300)


  updateVariables = variables => {
    deferredUpdates(() =>
      this.setState(prevState => ({
        variables: {
          ...prevState.variables,
          ...(variables || {})
        }
      }))
    )
  }

  render () {
    if (!this.props.auth?.user) return null
    const variables = {
      ...this.state,
      projectId: this.props.selectedProject,
      id: this.props.auth.user.id
    }
    return (
      <Query query={POSTS_QUERY} variables={variables}>
        {(posts) => {
          if (!posts?.data?.allPosts) { /* eslint-disable-line */
            return null
          }
          return (
            <Query query={PROJECTS_QUERY}
              variables={{ id: this.props.auth.user.id }}
            >
              {(projects) => {
                if (!projects?.data?.allProjects) { /* eslint-disable-line */
                  return null
                }
                return this.props.render({
                  editorState: this.props.editorState,
                  setEditorState: this.props.setEditorState,
                  selectProject: this.props.selectProject,
                  selectedProject: this.props.selectedProject,
                  updateVariables: this.updateVariables,
                  variables: variables,
                  handleSearch: this.handleSearch,
                  posts: posts,
                  projects: projects,
                  deletePost: deletePostAndReferences({
                    posts,
                    client: this.props.client
                  })
                })
              }}
            </Query>
          )
        }}
      </Query>
    )
  }
}

export default connect(
  state => state,
  dispatch => ({
    setEditorState: editorState => dispatch(setEditorState(editorState)),
    selectProject: project => dispatch(selectProject(project))
  })
)(AppQueries)
