const main = function () {
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
  
  let stage = new Container()
  const renderer = autoDetectRenderer(1024, 512, {antialias: false, transparent: false, resolution: 1})

  document.body.appendChild(renderer.view)

  loader
    .add(["sprites/morguethrull.png", "sprites/fullstack.png", "sprites/david.png", "sprites/nimit.png"])
    .on('progress', loadProgressHandler)
    .load(setup);

  function loadProgressHandler(loader, resource) {
    console.log(`loading ${resource.url}`)
  }

  let state, red, redSword, blue, blueSword, touch, redScore, blueScore, count, gg, redName, blueName

  const playerHeight = 108
  const floor = 512 - playerHeight

  function setup() {
    console.log('All files loaded')

    let backdrop = new Sprite(resources["sprites/fullstack.png"].texture)
    stage.addChild(backdrop)
    backdrop.position.set(0, -100)

    let redAvatar = new Sprite(resources["sprites/david.png"].texture)
    redAvatar.scale.set(.25, .25)
    stage.addChild(redAvatar)

    let blueAvatar = new Sprite(resources["sprites/nimit.png"].texture)
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

    // let circle = new Graphics()
    // circle.beginFill(0xFFFFFF)
    // circle.drawCircle(500, 420, 1)
    // circle.endFill()
    // stage.addChild(circle)

    stage.addChild(red)
    red.position.set(20, floor)
    red.vx = 0
    red.vy = 0

    blue = assembleAltFencer(0x0000FF)
    blueSword = blue.children[1]
    stage.addChild(blue)
    blue.position.set(800, floor)
    blue.vx = 0
    blue.vy = 0

    gg = new Container()

    // let blackdrop = new Graphics()
    // blackdrop.beginFill(0x000000)
    // blackdrop.drawRect(0, 0, stage.width, stage.height)
    // blackdrop.endFill()
    // gg.addChild(blackdrop)

    let ggText = new Text(
      'Game over',
      {fontFamily: "Arial", fontSize: 48, fill: "white"}
    )
    ggText.position.set(300, 200)
    gg.addChild(ggText)

    stage.addChild(gg)
    gg.visible = false

    state = play

    gameLoop()
  }

  function gameLoop() {

    requestAnimationFrame(gameLoop) //loops function at 60 fps

    //update game state
    state()

    renderer.render(stage) //rendering
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

    // if (red.swing) redSword.rotation += .524 * red.vector
    // else if (!red.swing && Math.abs(redSword.rotation) > 0) redSword.rotation -= .524 * red.vector
    // if (Math.abs(redSword.rotation) >= 1.5) red.swing = false

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

    function impact(player) {
      let points = 0
      if (player) {
        if (player === 'red') {
          redScore++
          points = redScore
          redName.text = `Red ${redScore}`
        } else {
          blueScore++
          points = blueScore
          blueName.text = `${blueScore} Blue`
        }
      }
      if (points >= 5) {
        gg.children[0].text = `Game Over \n${player} wins`
        state = end
      } else {
        count = 60
        touch.visible = true
        state = score
      }
    }

    // a note on collision: right now, when both models are facing forward, it works perfectly.
    // however, when you face backwards, the collision still triggers on your sword swinging "backwards"
    let rHit = false
    let bHit = false

    if (b.hit(redSword.children[red.arc], blue, false, false, true) && red.arc > 1) {
      // console.log('red sword hit')
      rHit = true
    }

    if (b.hit(blueSword.children[blue.arc], red, false, false, true) && blue.arc > 1) {
      // console.log('blue sword hit')
      bHit = true
    }

    if (b.hit(red, blue.children[0].children[0], false, false, true) && red.y < floor) {
      // console.log('red toe touch')
      rHit = true
    }

    if (b.hit(blue, red.children[0].children[0], false, false, true) && blue.y < floor) {
      // console.log('blue toe touch')
      bHit = true
    }

    // let toeTouch = b.hit(red.children[0], blue.children[0], true, false, true)

    // if (toeTouch) {
    //   console.log(toeTouch)
    //   if (toeTouch === 'bottom') {
    //     console.log('red toe touch')
    //     rHit = true
    //   }
    //   else if (toeTouch === 'top') {
    //     console.log('blue toe touch')
    //     bHit = true
    //   }
    // }

    if (rHit && bHit) {
      console.log('*kachink*')
    }
    if (rHit && !bHit) impact('red')
    if (!rHit && bHit) impact('blue')

  }

  function score() {
    // console.log(count)
    count--
    if (count <= 0) {
      red.position.set(20, floor)
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

  let left = keyboard(65)
  left.press = function() {
    red.vx -= 10
    if (red.scale.x === 1 * red.vector) {
      // red.scale.x = -1 * red.vector
      // red.x += 46 * red.vector
      red.turn = -1
    }
  }
  left.release = function() {
    red.vx += 10
  }
  let bleft = keyboard(75)
  bleft.press = function() {
    blue.vx -= 10
    if (blue.scale.x === 1 * blue.vector) {
      blue.turn = -1
    }
  }
  bleft.release = function() {
    blue.vx += 10
  }

  let right = keyboard(68)
  right.press = function() {
    red.vx += 10
    if (red.scale.x === -1 * red.vector) {
      // red.scale.x = 1 * red.vector
      // red.x -= 46 * red.vector
      red.turn = 1
    }
  }
  right.release = function() {
    red.vx -= 10
  }
  let bright = keyboard(186)
  bright.press = function() {
    blue.vx += 10
    if (blue.scale.x === -1 * blue.vector) {
      blue.turn = 1
    }
  }
  bright.release = function() {
    blue.vx -= 10
  }

  let up = keyboard(87)
  up.press = function() {
    if (red.vy === 0 && red.y === floor) red.vy = -33
  }
  let bup = keyboard(79)
  bup.press = function() {
    if (blue.vy === 0 && blue.y === floor) blue.vy = -33
  }

  let swing = keyboard(67)
  swing.press = function() {
    if (!red.swing && red.arc === 1) red.swing = true
  }
  let bswing = keyboard(77)
  bswing.press = function() {
    if (!blue.swing && blue.arc === 1) blue.swing = true
  }

  let enter = keyboard(13)
  enter.press = function() {
    console.log('current stage', stage)
  }

  return {}
}()