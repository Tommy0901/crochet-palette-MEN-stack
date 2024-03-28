import express, { type Request, type Response } from 'express'
import cors from 'cors'

const app = express()
const port = 8080

app.use(cors())

app.get('/', (req: Request, res: Response) => res.send('This is crochet palette!'))

app.listen(port, () => { console.info(`Server is running on http://localhost:${port}`) })

export default app
