import model from './model'
import {Events} from 'monsterr'
let ships = []

let commands = {}
let events = {
  'ready': (server, clientId) => {
    let gamestate = {
      ships: ships
    }
    server.send('gamestate', gamestate).toClient(clientId)
  },
  'startAccelerating': (server, clientId) => {
    ships.find(ship => ship.owner === clientId).starteAccelerate()
  },
  'stopAccelerating': (server, clientId) => {
    ships.find(ship => ship.owner === clientId).stopAccelerate()
  },
  'startTurning': (server, clientId, direction) => {
    ships.find(ship => ship.owner === clientId).startTurning(direction)
  },
  'stopTurning': (server, clientId) => {
    ships.find(ship => ship.owner === clientId).stopTurning()
  },
  [Events.CLIENT_CONNECTED]: (server, clientId) => {
    setTimeout(() => {
      let stageNo = server.getCurrentStage().number
      server.send(Events.START_STAGE, stageNo).toClient(clientId)
      ships.push(new model.Ship(clientId))
      server.send('gamestate', {ships: ships}).toClient(clientId)
    }, 1000)
  },
  [Events.CLIENT_RECONNECTED]: (server, clientId) => {
    setTimeout(() => {
      let stageNo = server.getCurrentStage().number
      server.send(Events.START_STAGE, stageNo).toClient(clientId)
      server.send('gamestate', {ships: ships}).toClient(clientId)
    }, 1000)
  },
  [Events.CLIENT_DISCONNECTED]: (server, clientId) => {
    ships = ships.filter(ship => ship.owner !== clientId)
    server.send('gamestate', {ships: ships}).toAll()
  }
  // TODO disconnect
}

export default {
  commands: commands,
  events: events,
  setup: (server) => {
    ships = server.getPlayers().map(clientId => new model.Ship(clientId))

    // start gameloop
    setInterval(() => {
      // update the ships
      ships.forEach(ship => ship.update())

      // tell everyone
      server.send('update', {
        ships: ships
      }).toAll()
    }, 50) // 20 times a second
  },
  teardown: (server) => {},
  options: {}
}
