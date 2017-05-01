import React from 'react'

let show = true
socket.on('start', () => {
  console.log('TEST')
  show = false
})

class Avatar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      images: ["/avatars/david.png", "/avatars/nimit.png", "/avatars/zagunis.png",
    "/avatars/morguethrull.png", "/avatars/cody.png", "/avatars/he-man.png",
    "/avatars/PogChamp.png", "/avatars/duane.png", "/avatars/morgan-freeman.png"],
      focus: '/avatars/david.png',
      input: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(e) {
    this.setState({input: e.target.value})
  }

  handleClick(e) {
    this.setState({focus: e})
    socket.emit('avatar', e)
  }

  handleSubmit(e) {
    this.setState({
      images: [...this.state.images, this.state.input],
      input: '',
      focus: this.state.input})
  }

  render() {
    return(
      <div>
        {show === true ?
        <p><strong>CHOOSE AN AVATAR</strong>{/* Enter your own image:
          <input type="text" placeholder="url" onChange={this.handleChange}></input>
          <button onClick={this.handleSubmit}>Submit</button>*/}
          <br />
          {this.state.images.map(image => {
            return (
              <span key={image} onClick={(e) => {this.handleClick(image)}}>
                <img src={image} className={image === this.state.focus ? "focus" : ""}></img>
              </span>
            )
          })}
        </p>
        : null}
      </div>
    )
  }
}

export default Avatar