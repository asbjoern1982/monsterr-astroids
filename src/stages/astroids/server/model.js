function Ship(owner) {
  this.pos = {x: 0, y: 0}
  this.heading = -Math.PI / 2
  this.velocety = {x: 0, y: 0}
  this.owner = owner

  let turningDirection = 0
  let accelerating = 0

  this.update = () => {
    this.pos.x += this.velocety.x
    this.pos.y += this.velocety.y
    console.log('accelerating: ' + this.accelerating + ' turningDirection' + this.turningDirection);

    this.heading += this.turningDirection
    this.velocety.x += Math.cos(this.heading) * this.accelerating
    this.velocety.y += Math.sin(this.heading) * this.accelerating

    // TODO apply drag
  }

  this.starteAccelerate = () => {
    this.accelerating = 2
    console.log('start accelerating with: ' + this.accelerating)
  }

  this.stopAccelerate = () => {
    this.accelerating = 0
    console.log('stopped accelerating with: ' + this.accelerating)
  }

  this.startTurning = (direction) => {
    if (direction > 0) {
      this.turningDirection = 0.1
    } else {
      this.turningDirection = -0.1
    }
  }

  this.stopTurning = () => {
    this.turningDirection = 0
  }
}

export default {
  Ship
}
