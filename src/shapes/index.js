import PropTypes from 'prop-types'

export const domainShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string
})

export const projectShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  domains: PropTypes.arrayOf(domainShape)
})

export const postMetaShape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  slug: PropTypes.string,
  status: PropTypes.string,
  date: PropTypes.string
})

export const versionShape = PropTypes.shape({
  id: PropTypes.string,
  raw: PropTypes.object
})

export const documentShape = PropTypes.shape({
  id: PropTypes.string,
  versions: PropTypes.arrayOf(versionShape)
})

export const postShape = PropTypes.shape({
  id: PropTypes.string,
  postMeta: postMetaShape,
  document: documentShape
})

export const allPostsShape = PropTypes.arrayOf(postShape)

export const postsQueryShape = PropTypes.shape({
  data: PropTypes.shape({
    allPosts: allPostsShape
  }),
  variables: PropTypes.shape({

  }),
  fetchMore: PropTypes.func
})

export const projectQueryShape = PropTypes.shape({
  data: PropTypes.shape({
    Project: projectShape
  })
})
