function Ship (owner) {
  this.owner = owner
  this.pos = {x: 0, y: 0}
  this.heading = -Math.PI / 2
  this.velocety = {x: 0, y: 0}
  this.turningSpeed = 0
  this.accelerating = 0

  this.update = () => {
    this.pos.x += this.velocety.x
    this.pos.y += this.velocety.y

    this.heading += this.turningSpeed
    this.velocety.x += Math.cos(this.heading) * this.accelerating
    this.velocety.y += Math.sin(this.heading) * this.accelerating

    // TODO apply drag
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

export default {
  Ship
}
