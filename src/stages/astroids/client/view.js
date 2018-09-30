let ships = []

let init = (canvas, gamestate) => {
  canvas.clear()
  canvas.backgroundColor = 'black'
  let cx = canvas.width / 2
  let cy = canvas.height / 2

  ships = []
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
    ships.push(shipShape)
    canvas.add(shipShape)
  })
}

let render = (canvas, gamestate) => {
  let cx = canvas.width / 2
  let cy = canvas.height / 2
  for (let i = 0; i < ships.length; i++) {
    ships[i].left = cx + gamestate.ships[i].pos.x
    ships[i].top = cy + gamestate.ships[i].pos.y
    ships[i].angle = fabric.util.radiansToDegrees(gamestate.ships[i].heading) + 90
  }
  canvas.renderAll()
}

export default {
  init,
  render
}
