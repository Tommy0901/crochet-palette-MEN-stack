import express, { type Request, type Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import Palette from './models/palette'

const app = express()
const port = 8080

void mongoose.connect('mongodb://127.0.0.1:27017/crochet_palettes')

mongoose.connection.on('error', () => {
  console.log('MongoDB connet error!')
})

mongoose.connection.once('open', () => {
  console.log('MongoDB connet success!')
})

app.use(cors(), express.json())

const handleGetPalettes = (req: Request, res: Response): void => {
  void (async () => {
    try {
      const palettes = await Palette.find()
      res.json(palettes)
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })()
}

app.get('/palettes', handleGetPalettes)

app.get('/', (req: Request, res: Response) => res.send('This is crochet palette!'))

app.listen(port, () => { console.info(`Server is running on http://localhost:${port}`) })

export default app
