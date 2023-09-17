
require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const { graphqlHTTP } = require("graphql-http")
const { createHandler } = require('graphql-http/lib/use/http');
const schema = require('./schema/schema')
const { connectDB } = require('./config/db')

const expressPlayground = require('graphql-playground-middleware-express')
  .default

connectDB()

app.use(cors())

app.all('/graphql', createHandler({ schema }));

app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.listen(port, console.log(`Server running on port ${port}`))