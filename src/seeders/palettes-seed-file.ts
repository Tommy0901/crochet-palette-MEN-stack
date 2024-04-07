import { Palette } from '../models'
import palettes from './intial/palettes.json'

export async function initializePalettes (): Promise<void> {
  try {
    console.log('initializePalettes:\n', await Palette.insertMany(palettes))
  } catch (err) {
    console.log(err)
  }
}
