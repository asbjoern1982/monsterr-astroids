import createClient from 'monsterr'
import astroids from './src/stages/astroids/client/client'

const stages = [
  astroids
]

let options = {
  canvasBackgroundColor: 'black',
  htmlContainerHeight: 0 // Hide html
}

let events = {}
let commands = {}

createClient({
  events,
  commands,
  options,
  stages
})
