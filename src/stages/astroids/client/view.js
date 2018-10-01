let level = {
  ships: [],
  bullets: []
}

let init = (canvas, gamestate) => {
  canvas.clear()
  canvas.backgroundColor = 'black'

  level.bullets = gamestate.bullets.map(bullet => createBullet(canvas, bullet))
  canvas.add(...level.bullets)

  level.ships = gamestate.ships.map(ship => createShip(canvas, ship))
  canvas.add(...level.ships)
}

let createShip = (canvas, ship) => {
  let shipShape = new fabric.Triangle({
    originX: 'center',
    originY: 'center',
    left: ship.pos.x + canvas.width / 2,
    top: ship.pos.y + canvas.height / 2,
    fill: 'black',
    width: '25',
    height: '35',
    stroke: 'white',
    selectable: false
  })
  shipShape.angle = fabric.util.radiansToDegrees(ship.heading) + 90
  return shipShape
}

let createBullet = (canvas, bullet) => {
  return new fabric.Circle({
    left: bullet.pos.x + canvas.width / 2,
    top: bullet.pos.y + canvas.height / 2,
    radius: 2,
    fill: 'white',
    selectable: false
  })
}

let render = (canvas, gamestate) => {
  let cx = canvas.width / 2
  let cy = canvas.height / 2

  if (gamestate.ships.length === level.ships.length && gamestate.bullets.length === level.bullets.length) {
    for (let i = 0; i < level.ships.length; i++) {
      level.ships[i].left = cx + gamestate.ships[i].pos.x
      level.ships[i].top = cy + gamestate.ships[i].pos.y
      level.ships[i].angle = fabric.util.radiansToDegrees(gamestate.ships[i].heading) + 90
    }

    for (let i = 0; i < gamestate.bullets.length; i++) {
      level.bullets[i].left = cx + gamestate.bullets[i].pos.x
      level.bullets[i].top = cy + gamestate.bullets[i].pos.y
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
