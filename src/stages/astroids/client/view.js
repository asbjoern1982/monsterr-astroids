let level = {
  ships: [],
  bullets: [],
  astroids: []
}

let init = (canvas, gamestate) => {
  canvas.clear()
  canvas.backgroundColor = 'black'
  canvas.add(new fabric.Rect({
    left: 0,
    top: 0,
    width: gamestate.universe.width,
    height: gamestate.universe.height,
    fill: 'black',
    stroke: 'white',
    selectable: false
  }))

  level.bullets = gamestate.bullets.map(bullet => createBullet(gamestate.universe, bullet))
  canvas.add(...level.bullets)

  level.astroids = gamestate.astroids.map(astroid => createAstroid(gamestate.universe, astroid))
  canvas.add(...level.astroids)

  level.ships = gamestate.ships.map(ship => createShip(gamestate.universe, ship))
  canvas.add(...level.ships)
}

let createShip = (universe, ship) => {
  let shipShape = new fabric.Triangle({
    originX: 'center',
    originY: 'center',
    left: ship.pos.x + universe.width / 2,
    top: ship.pos.y + universe.height / 2,
    fill: 'black',
    width: '25',
    height: '35',
    stroke: 'white',
    selectable: false
  })
  shipShape.angle = fabric.util.radiansToDegrees(ship.heading) + 90
  return shipShape
}

let createBullet = (universe, bullet) => {
  return new fabric.Circle({
    originX: 'center',
    originY: 'center',
    left: bullet.pos.x + universe.width / 2,
    top: bullet.pos.y + universe.height / 2,
    radius: 2,
    fill: 'white',
    selectable: false
  })
}

let createAstroid = (universe, astroid) => {
  return new fabric.Polygon(astroid.points, {
    originX: 'center',
    originY: 'center',
    left: astroid.pos.x + universe.width / 2,
    top: astroid.pos.y + universe.height / 2,
    fill: 'black',
    stroke: 'white',
    selectable: false
  })
}

let render = (canvas, gamestate) => {
  let cx = gamestate.universe.width / 2
  let cy = gamestate.universe.height / 2

  if (gamestate.ships.length === level.ships.length &&
    gamestate.bullets.length === level.bullets.length &&
    gamestate.astroids.length === level.astroids.length) {
    for (let i = 0; i < level.ships.length; i++) {
      level.ships[i].left = cx + gamestate.ships[i].pos.x
      level.ships[i].top = cy + gamestate.ships[i].pos.y
      level.ships[i].angle = fabric.util.radiansToDegrees(gamestate.ships[i].heading) + 90
    }

    for (let i = 0; i < gamestate.bullets.length; i++) {
      level.bullets[i].left = cx + gamestate.bullets[i].pos.x
      level.bullets[i].top = cy + gamestate.bullets[i].pos.y
    }

    for (let i = 0; i < gamestate.astroids.length; i++) {
      level.astroids[i].left = cx + gamestate.astroids[i].pos.x
      level.astroids[i].top = cy + gamestate.astroids[i].pos.y
    }

    canvas.renderAll()
  } else {
    init(canvas, gamestate)
  }
}

export default {
  init,
  render
}
