import model from './model'
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
  }
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
    }, 500) // 20 times a second
  },
  teardown: (server) => {},
  options: {}
}
