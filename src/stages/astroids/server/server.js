import model from './model'
import {Events} from 'monsterr'
let gamestate = {
  ships: [],
  bullets: []
}

let events = {
  'ready': (server, clientId) => {
    server.send('gamestate', gamestate).toClient(clientId)
  },
  'startAccelerating': (server, clientId) => {
    gamestate.ships.find(ship => ship.owner === clientId).starteAccelerate()
  },
  'stopAccelerating': (server, clientId) => {
    gamestate.ships.find(ship => ship.owner === clientId).stopAccelerate()
  },
  'startTurning': (server, clientId, direction) => {
    gamestate.ships.find(ship => ship.owner === clientId).startTurning(direction)
  },
  'stopTurning': (server, clientId) => {
    gamestate.ships.find(ship => ship.owner === clientId).stopTurning()
  },
  'shoot': (server, clientId) => {
    let ship = gamestate.ships.find(ship => ship.owner === clientId)
    gamestate.bullets.push(new model.Bullet(ship))
  },
  [Events.CLIENT_CONNECTED]: (server, clientId) => {
    setTimeout(() => {
      let stageNo = server.getCurrentStage().number
      server.send(Events.START_STAGE, stageNo).toClient(clientId)
      gamestate.ships.push(new model.Ship(clientId))
      server.send('gamestate', gamestate).toClient(clientId)
    }, 1000)
  },
  [Events.CLIENT_RECONNECTED]: (server, clientId) => {
    setTimeout(() => {
      let stageNo = server.getCurrentStage().number
      server.send(Events.START_STAGE, stageNo).toClient(clientId)
      server.send('gamestate', gamestate).toClient(clientId)
    }, 1000)
  },
  [Events.CLIENT_DISCONNECTED]: (server, clientId) => {
    gamestate.ships = gamestate.ships.filter(ship => ship.owner !== clientId)
    server.send('gamestate', gamestate).toAll()
  }
}

export default {
  commands: {},
  events: events,
  setup: (server) => {
    gamestate.ships = server.getPlayers().map(clientId => new model.Ship(clientId))

    // start gameloop
    setInterval(() => {
      // update entities
      gamestate.ships.forEach(ship => ship.update())
      gamestate.bullets = gamestate.bullets.filter(bullet => bullet.lifetime > 0) // remove old bullets
      gamestate.bullets.forEach(bullet => bullet.update())

      // tell everyone
      server.send('update', gamestate).toAll()
    }, 50) // 20 times a second
  },
  teardown: (server) => {},
  options: {}
}
