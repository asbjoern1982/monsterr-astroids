import createServer, { Network, Events } from 'monsterr'
import astroids from './src/stages/astroids/server/server'

const stages = [astroids]

let events = {
  [Events.CLIENT_CONNECTED] (server, clientId) {
    server.start()
  }
}
let commands = {}

const monsterr = createServer({
  network: Network.clique(8),
  events,
  commands,
  stages,
  options: {
    clientPassword: undefined,  // can specify client password
    adminPassword: 'sEcr3t'     // and admin password
  }
})

monsterr.run()
