import React from 'react'
import { Text, View } from 'react-native'
import Canvas from 'react-native-canvas'

export default class MapScreen extends React.Component {
	static navigationOptions = {
		title: 'Home',
	}

	constructor(props) {
		super(props)
		this.canvas = React.createRef()
		this.state = {
			dots: null,
		}
	}

	componentDidMount() {
		setInterval(() => {
			const dots = []
			for (let i = 0; i < Math.random() * 10; i++) {
				dots.push({ x: Math.random() * 500, y: Math.random() * 500 })
			}
			this.setState({
				dots: dots,
			})
		}, 1000)
	}

	// == GRAPHICS ==

	render() {
		return (
			<View>
				<Text>Hi</Text>
				<View onLayout={event => {
					const { x, y, width, height } = event.nativeEvent.layout
					this.resizeCanvas(width, height)
				}}>
					<Canvas ref={this.canvas}/>
				</View>
			</View>
		)
	}

	componentDidUpdate() {
		this.drawCanvas(this.canvas.current)
	}

	resizeCanvas(width, height) {
		const canvas = this.canvas.current
		canvas.widget = width
		canvas.height = height
		console.log('canvas resized to', width, height)
		this.drawCanvas(canvas)
	}

	drawCanvas(canvas) {
		const ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.fillStyle = 'white'
		const dot = (x, y) => {
			if (x < 0 || y < 0 || x > canvas.width || y > canvas.height)
				return
			ctx.beginPath()
			ctx.arc(x, y, 4, 0, 2 * Math.PI)
			ctx.fill()
		}
		if (this.state.dots) {
			this.state.dots.forEach(d => {
				dot(d.x, d.y)
			})
		}
	}

}