import React from 'react';
import {Button, StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import MapView from 'react-native-maps';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';


export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      displayMode: 'standard',
      displayOptions: false,
      region: {
        "latitude": 43.635074735727784,
        "latitudeDelta": 0.02871662183202517,
        "longitude": 1.3906881886173126,
        "longitudeDelta": 0.022997044922050236,
      },
      initialRegion: {
        "latitude": 43.635074735727784,
        "latitudeDelta": 0.02871662183202517,
        "longitude": 1.3906881886173126,
        "longitudeDelta": 0.022997044922050236,
      },
      initialMarkers: [
        {
          coordinate: {
            "latitude": 43.634120466154194,
            "longitude": 1.3834211207508333,
          },
          title: 'Marker 1',
          description: 'Description 1',
          pinColor: '#2196f3',
          id: 1
        },
        {
          coordinate: {
            "latitude": 43.64383999145973,
            "longitude": 1.3905655376828296,
          },
          title: 'Marker 2',
          description: 'Description 2',
          pinColor: '#2196f3',
          id: 2
        },
        {
          coordinate: {
            "latitude": 43.62815039074623,
            "longitude": 1.3970966986278506,
          },
          title: 'Marker 3',
          description: 'Description 3',
          pinColor: '#4caf50',
          id: 3
        },
        {
          coordinate: {
            "latitude": 43.62701845080164,
            "longitude": 1.3902895731621745,
          },
          title: 'Marker 4',
          description: 'Description 4',
          pinColor: '#4caf50',
          id: 4
        }
      ],
      markers: [],
    }
  }

  componentDidMount () {
    this.setState({markers: this.state.initialMarkers})
  }

  onButtonPress (markerID) {
    const marker = this.state.markers.find((marker) => marker.id === markerID);
    this.map.animateToRegion({
      ...marker.coordinate,
      latitudeDelta: this.state.initialRegion.latitudeDelta,
      longitudeDelta: this.state.initialRegion.longitudeDelta
    }, 500)
  }

  filterPin(color) {
    const markers = this.state.initialMarkers.filter(marker => marker.pinColor === color);
    this.setState({markers})
  }

  goToPosition() {
    navigator.geolocation.getCurrentPosition((coordinate) => {
      const {coords: {latitude, longitude}} = coordinate;
      const coords = {latitude, longitude};
      this.setState({markers: [
        {
          coordinate: {
            latitude,
            longitude,
          },
          title: 'Home',
          description: 'Current location',
          pinColor: '#2196f3',
          id: 1
        }
      ]});
      this.map.animateToRegion({
        ...coords,
        latitudeDelta: this.state.initialRegion.latitudeDelta,
        longitudeDelta: this.state.initialRegion.longitudeDelta
      }, 500)
    });
  }

  changeDisplay(displayMode) {
    this.setState({displayMode})
  }

  toggleOptions() {
    this.setState({displayOptions: !this.state.displayOptions})
  }

  render() {
    const markers = this.state.markers.map((marker, index) => (
      <MapView.Marker
        {...marker}
        key={index}
      />
    ));

    return (
      <View style={styles.container}>
        <MapView
          ref={map => this.map = map}
          onPress={(e) => console.log(e.nativeEvent)}
          style={styles.map}
          initialRegion={this.state.initialRegion}
          onRegionChange={(region) => this.setState({region})}
          mapType={this.state.displayMode}
        >
          {markers}
        </MapView>
        <View style={styles.buttonContainer}>
          {this.state.markers.map((marker, i) => (
            <Button key={i} title={marker.title} onPress={() => this.onButtonPress(marker.id)}/>
          ))}
        </View>
        <View style={styles.filterButtons}>
          <Button title='All' onPress={() => this.setState({markers: this.state.initialMarkers})}/>
          <Button title='Blue' onPress={() => this.filterPin('#2196f3')}/>
          <Button title='Green' onPress={() => this.filterPin('#4caf50')}/>
        </View>
        <View style={styles.options}>
          <TouchableHighlight style={styles.locationButton} onPress={() => this.toggleOptions()}>
            <MaterialCommunityIcons style={styles.icon} name={this.state.displayOptions ? 'minus' : 'plus'} size={32} />
          </TouchableHighlight>
          {this.state.displayOptions && <View>
            <TouchableHighlight style={styles.locationButton} onPress={() => this.goToPosition()}>
              <MaterialIcons style={styles.icon} name="location-on" size={32} />
            </TouchableHighlight>
            <TouchableHighlight style={styles.locationButton} onPress={() => this.changeDisplay('standard')}>
              <FontAwesome style={styles.icon} name="road" size={28} />
            </TouchableHighlight>
            <TouchableHighlight style={styles.locationButton} onPress={() => this.changeDisplay('satellite')}>
              <MaterialIcons style={styles.icon} name="satellite" size={28} />
            </TouchableHighlight>
          </View>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  options: {
    position: 'absolute',
    top: 20,
    right: 10,
  },
  locationButton: {
    backgroundColor: '#2196f3',
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  icon: {
    backgroundColor: 'transparent',
    color: '#FFF'
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    zIndex: 3,
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    height: 100,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  button: {
    height: 80,
    width: 80,
    backgroundColor: 'red',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterButtons: {
    zIndex: 3,
    position: 'absolute',
    top: 20,
    left: 10,
    height: 150,
    alignItems: 'center',
    justifyContent: 'space-around',
  }
});
