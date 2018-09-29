import view from './view'
import html from './client.html'
import './client.css'

let turning = false
let accelerating = false

let commands = {}
let events = {
  'gamestate': (client, gamestate) => {
    view.init(client.getCanvas(), gamestate)
  },
  'update': (client, gamestate) => {
    view.render(client.getCanvas(), gamestate)
  }
}

export default {
  html,
  commands: commands,
  events: events,
  setup: (client) => {
    $(window).keydown((event) => {
      console.log('keydown: ' + event.which)
      switch (event.which) {
        case 38:
          if (!accelerating) {
            client.send('startAccelerating')
            accelerating = true
          }
          break
        case 37:
          if (!turning) {
            client.send('startTurning', -1)
            turning = true
          }
          break
        case 39:
          if (!turning) {
            client.send('startTurning', 1)
            turning = true
          }
          break
        case 32:
          client.send('shoot')
          break
        default:
      }
    })

    $(window).keyup((event) => {
      console.log('keyup: ' + event.which)
      switch (event.which) {
        case 38:
          client.send('stopAccelerating')
          accelerating = false
          break
        case 37:
          client.send('stopTurning')
          turning = false
          break
        case 39:
          client.send('stopTurning')
          turning = false
          break
        default:
      }
    })

    client.send('ready')
  },
  teardown (client) {},
  options: { htmlContainerHeight: 0 }
}
