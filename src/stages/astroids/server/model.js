function Ship (owner) {
  this.owner = owner
  this.pos = {x: 0, y: 0}
  this.heading = -Math.PI / 2
  this.velocety = {x: 0, y: 0}
  this.turningSpeed = 0
  this.accelerating = 0
  this.drag = 0.99
  this.points = 0

  this.update = (universe) => {
    // move
    this.pos.x += this.velocety.x
    this.pos.y += this.velocety.y

    // curved spacetime!
    if (this.pos.x < -universe.width / 2 - 10) this.pos.x += universe.width + 10
    if (this.pos.x > universe.width / 2 + 10) this.pos.x -= universe.width - 10
    if (this.pos.y < -universe.height / 2 - 10) this.pos.y += universe.height + 10
    if (this.pos.y > universe.height / 2 + 10) this.pos.y -= universe.height - 10

    // turn
    this.heading += this.turningSpeed

    // add acceleration
    this.velocety.x += Math.cos(this.heading) * this.accelerating
    this.velocety.y += Math.sin(this.heading) * this.accelerating

    // apply drag
    this.velocety.x *= this.drag
    this.velocety.y *= this.drag
  }

  this.starteAccelerate = () => {
    this.accelerating = 2
  }

  this.stopAccelerate = () => {
    this.accelerating = 0
  }

  this.startTurning = (direction) => {
    if (direction > 0) {
      this.turningSpeed = 0.15
    } else {
      this.turningSpeed = -0.15
    }
  }

  this.stopTurning = () => {
    this.turningSpeed = 0
  }
}

function Bullet (ship) {
  this.owner = ship.owner
  this.pos = {
    x: ship.pos.x,
    y: ship.pos.y
  }
  this.velocety = {
    x: Math.cos(ship.heading) * 20,
    y: Math.sin(ship.heading) * 20
  }
  this.lifetime = 100 // updates

  this.update = () => {
    // move
    this.pos.x += this.velocety.x
    this.pos.y += this.velocety.y

    // time before exploding
    this.lifetime--
  }
}

function Astroid (pos, size) {
  this.pos = pos

  this.points = [...Array(size).keys()].map(index => {
    let angle = Math.PI * 2 * index / size
    return {
      x: Math.cos(angle) * size * 2 * (2 - Math.random()),
      y: Math.sin(angle) * size * 2 * (2 - Math.random())
    }
  })

  let heading = Math.random() * 4 * Math.PI
  let speed = Math.random() * 2
  this.velocety = {
    x: Math.cos(heading) * speed,
    y: Math.sin(heading) * speed
  }
  this.update = (universe) => {
    // move
    this.pos.x += this.velocety.x
    this.pos.y += this.velocety.y

    // curved spacetime!
    if (this.pos.x < -universe.width / 2 - 10) this.pos.x += universe.width + 10
    if (this.pos.x > universe.width / 2 + 10) this.pos.x -= universe.width - 10
    if (this.pos.y < -universe.height / 2 - 10) this.pos.y += universe.height + 10
    if (this.pos.y > universe.height / 2 + 10) this.pos.y -= universe.height - 10
  }
}

export default {
  Ship,
  Bullet,
  Astroid
}
