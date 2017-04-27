const main = function () {
  const Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite;

  let stage = new Container()
  const renderer = autoDetectRenderer(1024, 512, {antialias: false, transparent: false, resolution: 1})

  document.body.appendChild(renderer.view)

  loader
    .add(["sprites/morguethrull.png", "sprites/redguy.png", "sprites/greenguy.png"])
    .on('progress', loadProgressHandler)
    .load(setup);

  function loadProgressHandler(loader, resource) {
    console.log(`loading ${resource.url}`)
  }

  let greg, state, red

  function setup() {
    console.log('All files loaded')
    greg = new Sprite(
      resources["sprites/morguethrull.png"].texture
    );
    greg.position.set(512, 256)
    greg.scale.set(.5, .5)
    greg.anchor.set(.5, .5)
    greg.vx = 0
    greg.vy = 0
    // stage.addChild(greg)

    red = new Sprite(
      resources["sprites/redguy.png"].texture
    )
    red.position.set(0, 287)
    red.vx = 0
    red.vy = 0

    green = new Sprite(
      resources["sprites/greenguy.png"].texture
    )
    green.position.set(940, 287)

    stage.addChild(red)
    stage.addChild(green)

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
    if (red.y < 287 && red.vy < 10) red.vy++
    if (red.y >= 287) {
      red.y = 287
      red.vy = 0
    }
  }

  let left = keyboard(37)
  left.press = function() {
    red.vx -= 5
  }
  left.release = function() {
    red.vx += 5
  }

  let right = keyboard(39)
  right.press = function() {
    red.vx += 5
  }
  right.release = function() {
    red.vx -= 5
  }

  let up = keyboard(38)
  up.press = function() {
    if (red.vy === 0) red.vy = -10
  }

  return {}
}()