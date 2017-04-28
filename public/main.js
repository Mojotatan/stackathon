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

  let state, red, redSword, blue, blueSword, hit

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

    hit = new Text(
      "Touch!",
      {fontFamily: "Arial", fontSize: 32, fill: "white"}
    )
    hit.position.set(20, 20)
    hit.visible = false
    stage.addChild(hit)

    let redName = new Text(
      "Red",
      {fontFamily: "Arial", fontSize: 32, fill: "red"}
    )
    redName.position.set(125, 0)
    stage.addChild(redName)

    let blueName = new Text(
      "Blue",
      {fontFamily: "Arial", fontSize: 32, fill: "blue"}
    )
    blueName.position.set(834, 0)
    stage.addChild(blueName)

    red = assemblePlayer(0xFF0000, 1)
    redSword = red.children[1]

    let circle = new Graphics()
    circle.beginFill(0xFFFFFF)
    circle.drawCircle(500, 420, 1)
    circle.endFill()
    stage.addChild(circle)

    stage.addChild(red)
    red.position.set(20, floor)
    red.vx = 0
    red.vy = 0

    blue = assembleAltFencer(0x0000FF)
    blueSword = blue.children[1]
    stage.addChild(blue)
    blue.position.set(800, floor)
    // blue.scale.x = -1

    console.log(stage)

    state = play

    gameLoop()
  }

  function gameLoop() {

    requestAnimationFrame(gameLoop) //loops function at 60 fps

    //update game state
    state()

    renderer.render(stage) //rendering
  }

let check = true
let count = 0

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

    // a note on collision: right now, when both models are facing forward, it works perfectly.
    // however, when you face backwards, the collision still triggers on your sword swinging "backwards"
    if (b.hit(redSword.children[red.arc], blue, false, false, true)) console.log('sword hit')

    // if (b.hitTestPoint({x: 500, y: 420}, red.children[1])) console.log('test hit')
  }

  //controls

//65
  let left = keyboard(37)
  left.press = function() {
    red.vx -= 10
    if (red.scale.x === 1 * red.vector) {
      red.scale.x = -1 * red.vector
      red.x += 46 * red.vector
    }
  }
  left.release = function() {
    red.vx += 10
  }

//68
  let right = keyboard(39)
  right.press = function() {
    red.vx += 10
    if (red.scale.x === -1 * red.vector) {
      red.scale.x = 1 * red.vector
      red.x -= 24 * red.vector
    }
  }
  right.release = function() {
    red.vx -= 10
  }

//87
  let up = keyboard(38)
  up.press = function() {
    if (red.vy === 0 && red.y === floor) red.vy = -33
  }

  let space = keyboard(32)
  space.press = function() {
    if (!red.swing && red.arc === 1) red.swing = true
  }

  let enter = keyboard(13)
  enter.press = function() {
    console.log('current state', stage)
  }

  return {}
}()