let level = {
  ships: [],
  bullets: []
}

let init = (canvas, gamestate) => {
  canvas.clear()
  canvas.backgroundColor = 'black'
  let cx = canvas.width / 2
  let cy = canvas.height / 2

  level.ships = []
  gamestate.ships.forEach(ship => {
    let shipShape = new fabric.Triangle({
      originX: 'center',
      originY: 'center',
      left: cx + ship.pos.x,
      top: cy + ship.pos.y,
      fill: 'black',
      width: '25',
      height: '35',
      stroke: 'white',
      selectable: false
    })
    shipShape.angle = fabric.util.radiansToDegrees(ship.heading) + 90
    level.ships.push(shipShape)
    canvas.add(shipShape)
  })

  level.bullets = []
  gamestate.bullets.forEach(bullet => {
    let bulletShape = new fabric.Circle({
      left: cx + bullet.pos.x,
      top: cy + bullet.pos.y,
      radius: 2,
      fill: 'white',
      selectable: false
    })
    level.bullets.push(bulletShape)
    canvas.add(bulletShape)
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
