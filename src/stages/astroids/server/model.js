function Ship (owner) {
  this.owner = owner
  this.pos = {x: 0, y: 0}
  this.heading = -Math.PI / 2
  this.velocety = {x: 0, y: 0}
  this.turningSpeed = 0
  this.accelerating = 0
  this.drag = 0.99

  this.update = () => {
    // move
    this.pos.x += this.velocety.x
    this.pos.y += this.velocety.y

    // turn
    this.heading += this.turningSpeed

    // add accelerate
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

export default {
  Ship,
  Bullet
}
