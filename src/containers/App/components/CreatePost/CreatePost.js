// @flow
import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import ProjectSelect from '../../../../components/ProjectSelect'
import NewProjectSnackbar from './NewProjectSnackbar'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'
import CreatePostInput from './CreatePostInput'
import { slugify, genProjectName } from './util'
import Grid from '@material-ui/core/Grid'
import DefaultPaper from '../../../../components/DefaultPaper'
import { connect } from 'react-redux'
import { selectProject } from '../../../../redux'
import { compose } from 'recompose'

class CreatePost extends React.Component {
  static propTypes = {
    user: PropTypes.string,
    classes: PropTypes.object,
    selectedProject: PropTypes.string,
    selectProject: PropTypes.func.isRequired,
    projects: PropTypes.object,
    posts: PropTypes.object
  }

  static getDerivedStateFromProps (nextProps, nextState) {
    if (nextProps.selectedProject !== nextState.project?.id) {
      const { allProjects } = nextProps.projects.data
      if (nextProps.selectedProject) {
        const project = allProjects.find(({ id }) => id === nextProps.selectedProject)
        return { project: project || undefined }
      }
    }
    return null
  }

  state = {
    newPostTitle: '',
    project: undefined
  }

  project = genProjectName()

  submitContent = (event) => {
    if (event.keyCode !== 13) return
    this.createNewPost()
  }

  createNewProject = () => {
    const { user, createProject: { mutate } } = this.props
    return mutate({
      name: this.project,
      userId: user
    }).then(({ data }) =>
      data.createProject
    )
  }

  createPost = async ({ project, raw }) => {
    let { newPostTitle: title } = this.state
    const slug = slugify(title)
    const { createPost, user } = this.props
    return createPost.mutate({
      userId: user,
      projectId: project.id,
      document: {
        raw: {
          blocks: [{ text: '' }]
        },
        excerpt: '',
        versions: [{
          raw: {
            blocks: [{ text: '' }]
          }
        }]
      },
      postMeta: {
        title: title,
        slug: slug,
        status: 'DRAFT'
      }
    })
  }

  createNewPost = async () => {
    const raw = { blocks: [{ text: '' }] }
    let project = this.state.project || await this.createNewProject()
    await this.createPost({ project, raw })
    this.setState({ newPostTitle: '' })
    this.reset()
  }

  reset = () => {
    this.project = genProjectName()
  }

  handleChange = ({ currentTarget }) => {
    this.setState({ newPostTitle: currentTarget.value })
  }

  render () {
    const {
      classes,
      selectedProject,
      projects,
      selectProject,
      createPost,
      createProject
    } = this.props
    return (
      <DefaultPaper>
        <Grid container spacing={24} alignContent={'space-between'}>
          <Grid item xs={9}>
            <FormControl margin={'normal'} fullWidth className={classes.formControl}>
              <CreatePostInput
                classes={classes}
                createPost={createPost}
                createNewPost={this.createNewPost}
                submitContent={this.submitContent}
                value={this.state.newPostTitle}
                handleChange={this.handleChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <ProjectSelect
              selectedProject={this.props.selectedProject}
              allProjects={projects?.data?.allProjects}
              selectProject={selectProject}
            />
          </Grid>
        </Grid>
        <NewProjectSnackbar
          open={createProject?.loading} /* eslint-disable-line */
          newProjectName={createProject?.data?.createProject?.name} /* eslint-disable-line */
        />
      </DefaultPaper>
    )
  }
}

export const CreatePostBare = CreatePost

export const styles = () => ({
  paper: {
    padding: '20px'
  },
  input: {
    padding: '0 0 0 5px',
    boxSizing: 'border-box'
  },
  button: {
    border: 'none',
    boxShadow: 'none',
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0
  },
  adornment: {
    maxHeight: 'max-content'
  },
  formControl: {
    flexGrow: 1
  }
})

export default withStyles(styles)(CreatePost)
