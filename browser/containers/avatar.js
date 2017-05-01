import React from 'react'

class Avatar extends React.Component {
  constructor() {
    super()
    this.state = {
      images: ['/avatars/david.png', '/avatars/nimit.png', '/avatars/morguethrull.png', '/avatars/morgan-freeman.png'],
      focus: '',
      input: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(e) {
    console.log('changed')
    this.setState({input: e.target.value})
  }

  handleClick(e) {
    console.log('clicked')
    this.setState({focus: e.target.key})
  }

  handleSubmit(e) {
    console.log('submitted')
    this.setState({
      images: [...this.state.images, this.state.input],
      input: '',
      focus: this.state.input})
  }

  render() {
    return(
      <p><strong>CHOOSE AN AVATAR</strong> Enter your own image:
        <input type="text" value={this.state.input} name="url" onChange={this.handleChange}></input>
        <button onClick={this.handleSubmit}>Submit</button>
        <br />
        {this.state.images.map(image => {
          return (
            <img key={image} onClick={this.handleClick} src={image} className={image === focus ? "focus" : ""}></img>
          )
        })}
      </p>
    )
  }
}

export default Avatar