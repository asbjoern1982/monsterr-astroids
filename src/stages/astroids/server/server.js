import model from './model'
import {Events} from 'monsterr'
let gamestate = {
  universe: {height: 700, width: 1000},
  ships: [],
  bullets: [],
  astroids: []
}

let events = {
  'ready': (server, clientId) => {
    server.send('gamestate', gamestate).toClient(clientId)
  },
  'startAccelerating': (server, clientId) => {
    let ship = gamestate.ships.find(ship => ship.owner === clientId)
    if (ship) ship.starteAccelerate()
  },
  'stopAccelerating': (server, clientId) => {
    let ship = gamestate.ships.find(ship => ship.owner === clientId)
    if (ship) ship.stopAccelerate()
  },
  'startTurning': (server, clientId, direction) => {
    let ship = gamestate.ships.find(ship => ship.owner === clientId)
    if (ship) ship.startTurning(direction)
  },
  'stopTurning': (server, clientId) => {
    let ship = gamestate.ships.find(ship => ship.owner === clientId)
    if (ship) ship.stopTurning()
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

    // spawn astroids
    let numberOfAstroids = 10
    gamestate.astroids = []
    for (let i = 0; i < numberOfAstroids; i++) {
      let x = Math.random() * gamestate.universe.width
      let y = Math.random() * gamestate.universe.height
      while (x > gamestate.universe.width / 3 && x < 2 * gamestate.universe.width / 3 && y > gamestate.universe.height / 3 && y < 2 * gamestate.universe.height / 3) {
        x = Math.random() * gamestate.universe.width
        y = Math.random() * gamestate.universe.height
      }
      let size = Math.floor(16 - 10 * Math.random())
      x -= gamestate.universe.width / 2
      y -= gamestate.universe.height / 2
      gamestate.astroids.push(new model.Astroid({x: x, y: y}, size))
    }

    // start gameloop
    let gameloop = setInterval(() => {
      // update entities
      gamestate.ships.forEach(ship => ship.update(gamestate.universe))
      gamestate.bullets = gamestate.bullets.filter(bullet => bullet.lifetime > 0) // remove old bullets
      gamestate.bullets.forEach(bullet => bullet.update())
      gamestate.astroids.forEach(astroid => astroid.update(gamestate.universe))

      let crashedList = {astroids: [], ships: [], bullets: []}
      gamestate.astroids.forEach(astroid => {
        let x1 = astroid.pos.x
        let y1 = astroid.pos.y

        gamestate.ships.forEach(ship => {
          let x2 = ship.pos.x
          let y2 = ship.pos.y
          let dist = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2))
          if (dist < (astroid.points.length * 3 + 10)) {
            crashedList.astroids.push(astroid)
            crashedList.ships.push(ship)
          }
        })

        gamestate.bullets.forEach(bullet => {
          let x2 = bullet.pos.x
          let y2 = bullet.pos.y
          let dist = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2))
          if (dist < (astroid.points.length * 3)) {
            crashedList.astroids.push(astroid)
            crashedList.bullets.push(bullet)
          }
        })
      })
      if (crashedList.astroids.length > 0) {
        crashedList.astroids.forEach(astroid => gamestate.astroids.splice(gamestate.astroids.indexOf(astroid), 1))
      }
      if (crashedList.ships.length > 0) {
        crashedList.ships.forEach(ship => {
          gamestate.ships.splice(gamestate.ships.indexOf(ship), 1)
          if (gamestate.ships.length > 0) {
            server.send('crashed', ship).toAll()
          }
        })
      }
      if (crashedList.bullets.length > 0) {
        crashedList.bullets.forEach(bullet => {
          gamestate.bullets.splice(gamestate.bullets.indexOf(bullet), 1)
          let ownerShip = gamestate.ships.find(ship => bullet.owner === ship.owner)
          if (ownerShip) ownerShip.points++
        })
      }

      // tell everyone
      server.send('update', gamestate).toAll()

      if (gamestate.ships.length === 0) {
        server.send('gameover').toAll()
        clearInterval(gameloop)
      } else if (gamestate.astroids.length === 0) {
        server.send('gameover', gamestate.ships).toAll()
        clearInterval(gameloop)
      }
    }, 50) // 50) // 20 times a second
  },
  teardown: (server) => {},
  options: {}
}
