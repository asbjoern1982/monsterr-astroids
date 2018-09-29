let ships = []

let init = (canvas, gamestate) => {
  let cx = canvas.width / 2
  let cy = canvas.height / 2

  canvas.clear()
  ships = []
  canvas.backgroundColor = 'black'
  gamestate.ships.forEach(ship => {
    let newShip = new fabric.Triangle({
      left: cx + ship.pos.x,
      top: cy + ship.pos.y,
      fill: 'black',
      width: '25',
      height: '35',
      stroke: 'white',
      selectable: false
    })
    newShip.angle = fabric.util.radiansToDegrees(ship.heading) + 90
    ships.push(newShip)
    canvas.add(newShip)
    newShip.originX = ship.width / 2
    newShip.originY = ship.height / 2
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
  console.log(JSON.stringify(ships))
  canvas.renderAll()
}

export default {
  init,
  render
}
