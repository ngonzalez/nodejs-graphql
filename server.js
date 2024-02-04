import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const data = {
  warriors: [
    { id: '001', name: 'Jaime' },
    { id: '002', name: 'Jorah' },
  ],
}

const typeDefs = `
type Warrior {
  id: ID!
  name: String!
}

type Query {
  warriors: [Warrior]
}
`

const resolvers = {
  Query: {
    warriors: (obj, args, context, info) => context.warriors,
  },
}

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const app = express()
const port = 4000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/",  (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: executableSchema,
    context: data,
    graphiql: true,
  })
)

app.listen(port, () => {
  console.log(`Running a server at http://localhost:${port}`)
})

