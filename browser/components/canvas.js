import React from 'react'

class Canvas extends React.Component {
  constructor() {
    super()

    this.state = {char: ''}

    this.test = this.test.bind(this)
  }

  test(e) {
    console.log('event fired')
    console.log(e)
    this.setState({value: e.target.value, char: e.target.charCode, key: e.target.key, keyCode: e.target.keyCode})
  }

  render() {
    // console.log('state', this.state)
    return (
      <div>
        {/*<canvas tabIndex="0" id="game" onKeyPress={this.test} width="400" height="400"></canvas>*/}
      </div>
    )
  }
}

export default Canvas
