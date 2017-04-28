const Container = PIXI.Container,
  Graphics = PIXI.Graphics,
  headRadius = 12,
  bodyLength = 48

const assembleFencer = function(color) {

  let fencer = new Container()

  let head = new Graphics()
  head.beginFill(color)
  head.drawCircle(headRadius, headRadius, headRadius)
  head.endFill()

  let body = new Graphics()
  body.lineStyle(2, color, 1)
  body.moveTo(headRadius, headRadius * 2)
  body.lineTo(headRadius, headRadius * 2 + bodyLength)

  let backArm = new Graphics()
  backArm.lineStyle(2, color, 1)
  backArm.moveTo(headRadius, headRadius * 2 + 6)
  backArm.lineTo(0, headRadius * 2 + 14)
  backArm.lineTo(0, headRadius * 2 + 32)

  let frontArm = new Graphics()
  frontArm.lineStyle(2, color, 1)
  frontArm.moveTo(headRadius, headRadius * 2 + 6)
  frontArm.lineTo(headRadius + headRadius / 2, headRadius * 2 + 26)
  frontArm.lineTo(headRadius + headRadius / 2 + 24, headRadius * 2 + 26)

  let backLeg = new Graphics()
  backLeg.lineStyle(2, color, 1)
  backLeg.moveTo(headRadius, headRadius * 2 + bodyLength)
  backLeg.lineTo(0, headRadius * 2 + bodyLength + 12)
  backLeg.lineTo(0, headRadius * 2 + bodyLength + 36)

  let frontLeg = new Graphics()
  frontLeg.lineStyle(2, color, 1)
  frontLeg.moveTo(headRadius, headRadius * 2 + bodyLength)
  frontLeg.lineTo(headRadius * 2, headRadius * 2 + bodyLength + 12)
  frontLeg.lineTo(headRadius * 2, headRadius * 2 + bodyLength + 36)

  fencer.addChild(head)
  fencer.addChild(body)
  fencer.addChild(backArm)
  fencer.addChild(frontArm)
  fencer.addChild(backLeg)
  fencer.addChild(frontLeg)

  return fencer

}

const assembleSword = function() {

  let sword = new Container()

  let hilt = new Graphics()
  hilt.beginFill(0x000000)
  hilt.drawCircle(0, 0, 3)
  hilt.endFill()

  let blade = new Graphics()
  blade.lineStyle(2, 0x000000, 1)
  blade.moveTo(0, 0)
  blade.lineTo(0, -bodyLength)

  //if pythagorean theoreum is a^2 + b^2 = c^2 and a = b
  //a given c can be used to find a like so
  function findA (c) {
    let val = Math.pow(c, 2)
    val = val / 2
    return Math.round(Math.sqrt(val))
  }
  let blade1 = new Graphics()
  blade1.lineStyle(2, 0x000000, 1)
  blade1.moveTo(0, 0)
  blade1.lineTo(findA(bodyLength), -findA(bodyLength))

  let blade2 = new Graphics()
  blade2.lineStyle(2, 0x000000, 1)
  blade2.moveTo(0, 0)
  blade2.lineTo(bodyLength, 0)


  sword.addChild(hilt)
  sword.addChild(blade)
  sword.addChild(blade1)
  sword.addChild(blade2)

  blade1.visible = false
  blade2.visible = false

  return sword

}

const assemblePlayer = function(color) {
  let player = new Container()

  let fencer = assembleFencer(color)
  let sword = assembleSword()

  // let arc = new Graphics()
  // arc.beginFill(0x00FF00)
  // arc.drawCircle(0, 0, 48)
  // arc.endFill()
  // player.addChild(arc)

  player.addChild(fencer)
  player.addChild(sword)
  sword.position.set(42, 50)
  // arc.position.set(42, 50)

  // let polySwing = new Graphics()
  // polySwing.beginFill(0x00FF00)
  // polySwing.drawPolygon([
  //   42, 50,
  //   42, 0,
  //   86, 50
  // ])
  // polySwing.endFill()
  // polySwing.alpha = 0

  // player.addChild(polySwing)

  player.swing = false
  player.vector = 1
  player.arc = 1

  return player
}

const assembleAltFencer = function(color) {
    const assembleFencer = function(color) {

    let fencer = new Container()

    let head = new Graphics()
    head.beginFill(color)
    head.drawCircle(46 - headRadius, headRadius, headRadius)
    head.endFill()

    let body = new Graphics()
    body.lineStyle(2, color, 1)
    body.moveTo(46 - headRadius, headRadius * 2)
    body.lineTo(46 - headRadius, headRadius * 2 + bodyLength)

    let backArm = new Graphics()
    backArm.lineStyle(2, color, 1)
    backArm.moveTo(46 - headRadius, headRadius * 2 + 6)
    backArm.lineTo(46 - 0, headRadius * 2 + 14)
    backArm.lineTo(46 - 0, headRadius * 2 + 32)

    let frontArm = new Graphics()
    frontArm.lineStyle(2, color, 1)
    frontArm.moveTo(46 - headRadius, headRadius * 2 + 6)
    frontArm.lineTo(46 - (headRadius + headRadius / 2), headRadius * 2 + 26)
    frontArm.lineTo(46 - (headRadius + headRadius / 2 + 24), headRadius * 2 + 26)

    let backLeg = new Graphics()
    backLeg.lineStyle(2, color, 1)
    backLeg.moveTo(46 - headRadius, headRadius * 2 + bodyLength)
    backLeg.lineTo(46 - 0, headRadius * 2 + bodyLength + 12)
    backLeg.lineTo(46 - 0, headRadius * 2 + bodyLength + 36)

    let frontLeg = new Graphics()
    frontLeg.lineStyle(2, color, 1)
    frontLeg.moveTo(46 - headRadius, headRadius * 2 + bodyLength)
    frontLeg.lineTo(46 - headRadius * 2, headRadius * 2 + bodyLength + 12)
    frontLeg.lineTo(46 - headRadius * 2, headRadius * 2 + bodyLength + 36)

    fencer.addChild(head)
    fencer.addChild(body)
    fencer.addChild(backArm)
    fencer.addChild(frontArm)
    fencer.addChild(backLeg)
    fencer.addChild(frontLeg)

    return fencer

  }

  const assembleSword = function() {

    let sword = new Container()

    let hilt = new Graphics()
    hilt.beginFill(0x000000)
    hilt.drawCircle(0, 0, 3)
    hilt.endFill()

    let blade = new Graphics()
    blade.lineStyle(2, 0x000000, 1)
    blade.moveTo(0, 0)
    blade.lineTo(0, -bodyLength)

    sword.addChild(hilt)
    sword.addChild(blade)

    return sword

  }

  const assemblePlayer = function(color) {
    let player = new Container()

    let fencer = assembleFencer(color)
    let sword = assembleSword()

    player.addChild(fencer)
    player.addChild(sword)
    sword.position.set(46 - 42, 50)
    
    // let polySwing = new Graphics()
    // polySwing.beginFill(0x00FF00)
    // polySwing.drawPolygon([

    // ])

    player.swing = false
    player.vector = -1

    return player
  }

  return assemblePlayer(color)
}