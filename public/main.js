const main = function() {
  // aliases
  const Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text,
    Matrix = PIXI.Matrix,
    b = new Bump(PIXI)

  // set up web-gl
  let stage = new Container()
  const renderer = autoDetectRenderer(1024, 512, {antialias: false, transparent: false, resolution: 1})
  document.body.appendChild(renderer.view)

  // load sprites
  loader
    .add(["/maps/city.png", "/maps/swamp.png", "/maps/stonehenge.png",
    "/avatars/david.png", "/avatars/nimit.png", "/avatars/zagunis.png",
    "/avatars/morguethrull.png", "/avatars/cody.png", "/avatars/he-man.png",
    "/avatars/PogChamp.png", "/avatars/duane.png", "/avatars/morgan-freeman.png"])
    .on('progress', loadProgressHandler)
    .load(setup);

  function loadProgressHandler(loader, resource) {
    console.log(`loading ${resource.url}`)
  }

  // define 'global' variables
  let state, red, redSword, blue, blueSword, touch, redScore, blueScore, count, gg, redName, blueName, iAm, start, ready, redAvatar, blueAvatar
  const playerHeight = 108
  const floor = 512 - playerHeight

  function setup() {
    console.log('All files loaded')

    // default avatars
    redAvatar = new Sprite(resources["/avatars/david.png"].texture)
    redAvatar.scale.set(.25, .25)
    stage.addChild(redAvatar)

    blueAvatar = new Sprite(resources["/avatars/david.png"].texture)
    blueAvatar.scale.set(.25, .25)
    stage.addChild(blueAvatar)
    blueAvatar.position.set(899, 0)

    touch = new Text(
      "Touch!",
      {fontFamily: "Arial", fontSize: 48, fill: "green"}
    )
    touch.position.set(450, 130)
    touch.visible = false
    stage.addChild(touch)

    redScore = 0
    blueScore = 0

    redName = new Text(
      "Red 0",
      {fontFamily: "Arial", fontSize: 32, fill: "red"}
    )
    redName.position.set(125, 0)
    stage.addChild(redName)

    blueName = new Text(
      "0 Blue",
      {fontFamily: "Arial", fontSize: 32, fill: "blue"}
    )
    blueName.position.set(807, 0)
    stage.addChild(blueName)

    red = assemblePlayer(0xFF0000, 1)
    redSword = red.children[1]

    stage.addChild(red)
    red.position.set(80, floor)
    red.vx = 0
    red.vy = 0

    blue = assembleAltFencer(0x0000FF)
    blueSword = blue.children[1]
    stage.addChild(blue)
    blue.position.set(900, floor)
    blue.vx = 0
    blue.vy = 0

    gg = new Container()
    let ggText = new Text(
      'Game over',
      {fontFamily: "Arial", fontSize: 48, fill: "white"}
    )
    ggText.position.set(300, 200)
    gg.addChild(ggText)
    stage.addChild(gg)
    gg.visible = false


    start = new Container()
    let blackdrop = new Graphics()
    blackdrop.beginFill(0x000000)
    blackdrop.drawRect(0, 0, stage.width, stage.height)
    blackdrop.endFill()
    start.addChild(blackdrop)
    let loadText = new Text(
      'SUPER FENCING SIMULATOR\nWaiting for players to join...',
      {fontFamily: "Arial", fontSize: 48, fill: "white"}
    )
    loadText.position.set(200, 100)
    let loadInstructions = new Text(
      'Move around with the arrows\nJump with the up arrow\nAttack with spacebar\nPress enter to ready up',
      {fontFamily: "Arial", fontSize: 32, fill: "white", align: "center"}
    )
    loadInstructions.position.set(200, 250)
    start.addChild(loadText)
    start.addChild(loadInstructions)
    stage.addChild(start)


    state = play

    gameLoop()
  }

  function gameLoop() {

    requestAnimationFrame(gameLoop) //loops function at 60 fps

    //update game state
    state()

    renderer.render(stage) //rendering
  }

  function holding() {
    //this is so nothing happens while the game is waiting for both players to ready up
  }

  function play() {
    red.x += red.vx
    red.y += red.vy
    if (red.x < 0 && red.scale.x === 1) red.x = 0
    else if (red.x < 24 && red.scale.x === -1) red.x = 24
    else if (red.x > 1000 && red.scale.x === 1) red.x = 1000
    else if (red.x > 1024 && red.scale.x === -1) red.x = 1024
    if (red.y < floor && red.vy < 20) red.vy += 3
    if (red.y >= floor) {
      red.y = floor
      red.vy = 0
    }

    if (red.turn !== 0) {
      red.scale.x = red.turn * red.vector
      red.x -= red.turn * 46 * red.vector
      red.turn = 0
    }

    blue.x += blue.vx
    blue.y += blue.vy
    if (blue.x < 0 && blue.scale.x === 1) blue.x = 0
    else if (blue.x < 24 && blue.scale.x === -1) blue.x = 24
    else if (blue.x > 1000 && blue.scale.x === 1) blue.x = 1000
    else if (blue.x > 1024 && blue.scale.x === -1) blue.x = 1024
    if (blue.y < floor && blue.vy < 20) blue.vy += 3
    if (blue.y >= floor) {
      blue.y = floor
      blue.vy = 0
    }

    if (blue.turn !== 0) {
      blue.scale.x = blue.turn * blue.vector
      blue.x -= blue.turn * 46 * blue.vector
      blue.turn = 0
    }

    if (red.swing) {
      redSword.children[red.arc].visible = false
      red.arc++
      redSword.children[red.arc].visible = true
      if (red.arc === 3) red.swing = false
    } else if (!red.swing && red.arc > 1) {
      redSword.children[red.arc].visible = false
      red.arc--
      redSword.children[red.arc].visible = true
    }

    if (blue.swing) {
      blueSword.children[blue.arc].visible = false
      blue.arc++
      blueSword.children[blue.arc].visible = true
      if (blue.arc === 3) blue.swing = false
    } else if (!blue.swing && blue.arc > 1) {
      blueSword.children[blue.arc].visible = false
      blue.arc--
      blueSword.children[blue.arc].visible = true
    }

    // a note on collision: right now, when both models are facing forward, it works perfectly.
    // however, when you face backwards, the collision still triggers on your sword swinging "backwards"
    let rHit = 0
    let bHit = 0

    // sword touches
    if (b.hit(redSword.children[red.arc], blue, false, false, true) && red.arc > 1) {
      rHit++
    }
    if (b.hit(blueSword.children[blue.arc], red, false, false, true) && blue.arc > 1) {
      bHit++
    }

    // toe touches
    if ((b.hit(red.children[0].children[4], blue.children[0].children[0], false, false, true) || b.hit(red.children[0].children[5], blue.children[0].children[0], false, false, true)) && red.y < floor) {
      // console.log('red toe touch')
      rHit++
    }
    if ((b.hit(blue.children[0].children[4], red.children[0].children[0], false, false, true) || b.hit(blue.children[0].children[5], red.children[0].children[0], false, false, true)) && blue.y < floor) {
      bHit++
    }

    if (rHit - bHit > 0) {
      socket.emit('impact', {color: 'red', score: redScore})
    }
    else if (bHit - rHit > 0) {
      socket.emit('impact', {color: 'blue', score: blueScore})
    }

  }

  function impact(player) {
    if (player) {
      if (player === 'red') {
        redScore++
        redName.text = `Red ${redScore}`
      } else {
        blueScore++
        blueName.text = `${blueScore} Blue`
      }
    }
    if (redScore >= 5 || blueScore >= 5) {
      gg.children[0].text = `Game Over ${player} wins`
      state = end
    } else {
      count = 60
      touch.visible = true
      state = score
    }
  }

  function score() {
    count--
    if (count <= 0) {
      red.position.set(80, floor)
      blue.position.set(900, floor)
      touch.visible = false
      state = play
    }
  }

  function end() {
    gg.visible = true
  }

  //controls
  //o79 k75 l76 ;186
  //w87 a65 s83 d68
  //up38 left37 down40 right39
  //space32 c67 m77

  let left = keyboard(37)
  left.press = function() {
    if (iAm === 'red') {
      let data = {}
      data.vx = -10
      if (red.scale.x === 1 * red.vector) {
        data.turn = -1
      }
      socket.emit('red move', data)
    }
    else if (iAm === 'blue') {
      let data = {}
      data.vx = -10
      if (blue.scale.x === 1 * blue.vector) {
        data.turn = -1
      }
      socket.emit('blue move', data)
    }
  }
  left.release = function() {
    if (iAm === 'red') {
      let data = {}
      data.vx = 10
      socket.emit('red move', data)
    }
    else if (iAm === 'blue') {
      let data = {}
      data.vx = 10
      socket.emit('blue move', data)
    }
  }

  let right = keyboard(39)
  right.press = function() {
    if (iAm === 'red') {
      let data = {}
      data.vx = 10
      if (red.scale.x === -1 * red.vector) {
        data.turn = 1
      }
      socket.emit('red move', data)
    }
    else if (iAm === 'blue') {
      let data = {}
      data.vx = 10
      if (blue.scale.x === -1 * blue.vector) {
        data.turn = 1
      }
      socket.emit('blue move', data)
    }
  }
  right.release = function() {
    if (iAm === 'red') {
      let data = {}
      data.vx = -10
      socket.emit('red move', data)
    }
    else if (iAm === 'blue') {
      let data = {}
      data.vx = -10
      socket.emit('blue move', data)
    }
  }

  let up = keyboard(38)
  up.press = function() {
    if (iAm === 'red') {
      let data = {}
      if (red.vy === 0 && red.y === floor) {
        data.vy = -33
        socket.emit('red move', data)
      }
    }
    else if (iAm === 'blue') {
      let data = {}
      if (blue.vy === 0 && blue.y === floor) {
        data.vy = -33
        socket.emit('blue move', data)
      }
    }
  }

  let swing = keyboard(32)
  swing.press = function() {
    if (iAm === 'red') {
      let data = {}
      if (!red.swing && red.arc === 1) {
        data.swing = true
        socket.emit('red move', data)
      }
    }
    else if (iAm === 'blue') {
      let data = {}
      if (!blue.swing && blue.arc === 1) {
        data.swing = true
        socket.emit('blue move', data)
      }
    }
  }

  let enter = keyboard(13)
  enter.press = function() {
    console.log(stage.children)
    if (iAm && start.visible) {
      socket.emit('ready', iAm)
    }
  }

  //sockets yay
  socket.on('player assignment', (color) => {
    iAm = color
    console.log('Playing as', iAm)
    state = holding
  })

  socket.on('start', (map) => {
    let maps = ["/maps/city.png", "/maps/swamp.png", "/maps/stonehenge.png"]
    let backdrop = new Sprite(resources[maps[map]].texture)
    stage.addChildAt(backdrop, 0)
    start.visible = false
    state = play
  })

  socket.on('red move', ({vx, vy, turn, swing}) => {
    if (vx) red.vx += vx
    if (vy) red.vy += vy
    if (turn) red.turn = turn
    if (swing) red.swing = swing
  })

  socket.on('blue move', ({vx, vy, turn, swing}) => {
    if (vx) blue.vx += vx
    if (vy) blue.vy += vy
    if (turn) blue.turn = turn
    if (swing) blue.swing = swing
  })

  socket.on('impact', (data) => {
    impact(data.color)
  })

  socket.on('avatar', data => {
    if (data.color === 'red') {
      stage.removeChild(redAvatar)
      redAvatar = new Sprite(resources[data.avatar].texture)
      redAvatar.width = 125
      redAvatar.height = 125
      stage.addChildAt(redAvatar, 1)
    } else if (data.color === 'blue') {
      stage.removeChild(blueAvatar)
      blueAvatar = new Sprite(resources[data.avatar].texture)
      blueAvatar.width = 125
      blueAvatar.height = 125
      stage.addChildAt(blueAvatar, 2)
      blueAvatar.position.set(899, 0)
    }
  })

  return {}
}()