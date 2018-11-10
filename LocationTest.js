import React from 'react'
import { Platform, Text, View } from 'react-native'
import { IntentLauncherAndroid, Location, Permissions } from 'expo'

class Loc {
	coords: Coords
	timestamp: number
}

class Coords {
	accuracy: number
	altitude: number
	heading: number
	latitude: number
	longitude: number
	speed: number
}

export class LocationTest extends React.Component {

	constructor(props) {
		super(props)
		this.location = null
		this.state = {
			locationWatch: null,
			locationGet: null,
		}
	}

	componentWillMount() {
		this.fetchLocation()
	}

	async fetchLocation(): void {
		let response = await Permissions.askAsync(Permissions.LOCATION).then(r => r.status)
		if (response !== 'granted') {
			this.setState({ errors: 'Please grant location permission in the system settings!' })
			return
		}
		const getLoc = setInterval(async () => {
			const locationStatus = await Location.getProviderStatusAsync({})
			if (Platform.OS !== 'android' || locationStatus.networkAvailable) {
				clearInterval(getLoc)
				this.setState({ errors: '' })
				setInterval(async () => {
					const location = await Location.getCurrentPositionAsync({})
					if (location !== this.location) {
						this.location = location
						this.setState({ locationGet: location })
					}
				}, 500)
				Location.watchPositionAsync({
					distanceInterval: 1,
					enableHighAccuracy: true,
				}, location => {
					this.setState({ locationWatch: location })
				})
			} else {
				this.setState({ errors: 'Please set Location method to High Accuracy!' })
				// Open location settings
				if (Platform.OS === 'android')
					IntentLauncherAndroid.startActivityAsync(IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS)
			}
		}, 1000)
	}

	// == GRAPHICS ==

	static stringifyLocation(location) {
		if (location)
			return location.coords.latitude + ' ' + location.coords.longitude
	}

	render() {
		return (
			<View style={{ padding: 32 }}>
				<Text>Time: {Date.now()}</Text>
				<Text>Location-watch: {LocationTest.stringifyLocation(this.state.locationWatch)}</Text>
				<Text>Location-get: {LocationTest.stringifyLocation(this.state.locationGet)}</Text>
				<Text>Location-errors: {this.state.errors}</Text>
			</View>
		)
	}

}
