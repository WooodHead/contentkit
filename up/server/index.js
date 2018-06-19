const express = require('express')
const path = require('path')
const app = express()
const AWS = require('aws-sdk')
const s3 = new AWS.S3({ region: 'us-east-1' })
const {
  postQuery,
  allPostsQuery,
  checkAuth
} = require('./api')

const {
  PORT = 1234,
  BUCKET_NAME
} = process.env

app.get('/favicon.ico', (req, res) => {
  res.status(204)
})

app.get('/static/:postId/:file', (req, res) => {
  let { postId, file } = req.params
  let url = s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: `static/${postId}/${file}`
  })
  res.redirect(url)
})

app.get('/api/v1/presigned/:id', (req, res) => {
  let contentType = decodeURIComponent(req.query.type)
  let id = decodeURIComponent(req.params.id)
  s3.createPresignedPost({
    Bucket: BUCKET_NAME,
    Fields: {
      key: decodeURIComponent(id),
      'Content-Type': contentType
    }
  }, (err, data) => {
    if (err) console.log(err)
    res.json(data)
  })
})

app.get('/api/v1/project/:id/posts/:slug', (req, res) => {
  let { slug, id } = req.params
  let token
  let auth = req.headers.authorization
  if (auth) {
    token = auth.replace(/[B|b]earer\s?/, '')
  }

  if (token) {
    postQuery(token, id, slug).then(data => {
      res.json(data)
    })
  } else {
    let clientIp = req.connection.remoteAddress
    checkAuth({ clientIp }, id)
      .then(({ valid, secret }) => {
        if (valid) {
          postQuery(secret, id, slug).then(data => {
            res.json(data)
          })
        } else {
          res.status(500).json({ error: 'unauthorized' })
        }
      })
  }
})

app.get('/api/v1/project/:id', (req, res) => {
  let { id } = req.params
  let token
  let auth = req.headers.authorization
  if (auth) {
    token = auth.replace(/[B|b]earer\s?/, '')
  }
  if (token) {
    allPostsQuery(token, id).then(data => {
      res.json(data)
    })
  } else {
    let clientIp = req.connection.remoteAddress
    checkAuth({ clientIp }, id)
      .then(({ valid, secret }) => {
        if (valid) {
          allPostsQuery(secret, id).then(data => {
            res.json(data)
          })
        } else {
          res.status(500).json({ error: 'unauthorized' })
        }
      })
  }
})

// const Bundler = require('parcel-bundler')
// const bundler = new Bundler('src/index.html', {
//  publicUrl: '/'
// })
// app.use(bundler.middleware())

let dir = path.join(__dirname, '../dist')
app.use('*', express.static(dir))
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
