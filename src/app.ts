import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { router } from './routes/router'
import { apiErrorMsg } from './middlewares/error-handler'
import { connectToMongoDB } from './config/mongoose'

if (process.env.NODE_ENV !== 'production') dotenv.config()
if (process.env.MONGODB_URI == null) throw new Error('MONGODB_URI is not defined.')
if (process.env.JWT_SECRET == null) throw new Error('JWT_SECRET is not defined.')

connectToMongoDB(process.env.MONGODB_URI)

const app = express()
const port = process.env.PORT ?? 8080

app.use(cors(), express.json())

for (const route of router) {
  app.use(route.getRouter())
}

app.use('/', apiErrorMsg)

app.listen(port, () => { console.info(`Server is running on http://localhost:${port}`) })

export default app
