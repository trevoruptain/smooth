import React from "react";
import { View, StyleSheet, Dimensions, Animated, Easing, Slider, Text, Link, TouchableOpacity, AsyncStorage } from "react-native";

// AsyncStorage.setItem(“testkey”, “testvalue”);
// AsyncStorage.getItem(“testkey”).then(
//   value => console.log(value),
//   err => setItem(“testkey”, “testvalue”)
// );

class SlideInView extends React.Component {
    state = {
        yPosition: new Animated.Value(-400),
    }

    componentDidMount() {
        Animated.timing(
            this.state.yPosition,
            {
                toValue: 0,
                duration: 700,
            }
        ).start();
    }

    componentWillUnmount() {
        Animated.timing(
            this.state.yPosition,
            {
                toValue: -400,
                easing: Easing.back,
                duration: 700,
            }
        ).start();
    }

    render() {
        let { yPosition } = this.state;

        return (
            <Animated.View
                style={{
                    ...this.props.style,
                    bottom: yPosition
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}

export default class PreferencesTray extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            safetyImportance: 0,
            flatnessImportance: 0,
            distanceImportance: 0,
        };

        this.loading = false;

        this.updateSafety = this.updateSafety.bind(this);
        this.updateFlatness = this.updateFlatness.bind(this);
        this.updateDistance = this.updateDistance.bind(this);
        this.setDefault = this.setDefault.bind(this);
    }

    componentWillMount() {
        console.log("Hey");
        AsyncStorage.getItem("preferences").then(preferences => {
            if (preferences === null) {
                AsyncStorage.setItem("preferences", JSON.stringify({
                    safetyImportance: 0,
                    flatnessImportance: 0,
                    distanceImportance: 0
                })).then(preferences => {
                    this.setState(JSON.parse(preferences));
                })
            } else {
                this.setState(JSON.parse(preferences));
            }
        });
    }

    setDefault() {
       AsyncStorage.setItem("preferences", JSON.stringify({
           safetyImportance: this.state.safetyImportance,
           flatnessImportance: this.state.flatnessImportance,
           distanceImportance: this.state.distanceImportance
        }))
    }

    updateSafety(value) {
        this.setState({safetyImportance: value});
    }

    updateFlatness(value) {
        this.setState({ flatnessImportance: value });
    }

    updateDistance(value) {
        this.setState({ distanceImportance: value });
    }

    importanceInt(value) {
        return value === undefined ? 0 : Math.round(value * 10);
    }

    render() {
        return (
            <SlideInView style={{
                backgroundColor: 'white',
                width: width,
                height: 400,
                paddingTop: 15,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                position: 'absolute',
                left: 0,
            }} >
                <View style={styles.sliders}>
                    <Text style={styles.text}>Safety</Text>
                    <Slider value={this.state.safetyImportance} 
                    minimumTrackTintColor={'#1D8DFF'} 
                    onValueChange={this.updateSafety}
                    style={styles.slider} />
                
                <Text style={styles.scale}>{`Importance: ${this.importanceInt(this.state.safetyImportance)}`}</Text>

                    <Text style={styles.text}>Flatness</Text>
                    <Slider value={this.state.flatnessImportance} 
                    minimumTrackTintColor={'#1D8DFF'} 
                    onValueChange={this.updateFlatness}
                    style={styles.slider} />

                    <Text style={styles.scale}>{`Importance: ${this.importanceInt(this.state.flatnessImportance)}`}</Text>

                    <Text style={styles.text}>Distance</Text>
                    <Slider value={this.state.distanceImportance} 
                    minimumTrackTintColor={'#1D8DFF'} 
                    onValueChange={this.updateDistance}
                    style={styles.slider} />

                <Text style={styles.scale}>{`Importance: ${this.importanceInt(this.state.distanceImportance)}`}</Text>
                </View>

                <View style={styles.textHolder}>
                    <TouchableOpacity onPress={this.props.toggle}>
                        <Text style={styles.redLink}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.setDefault();
                        this.props.toggle();
                    }
                    }>
                        <View>
                            <Text style={styles.link}>OK</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SlideInView>
        );
    }
}

var width = Dimensions.get("window").width;

const styles = StyleSheet.create({
    sliders: {
        flex: 4,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
    },
    text: {
        fontSize: 20,
        color: '#1D8DFF'
    },
    textHolder: {
        flex: 1,
        width: width - 50,
        paddingBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    scale: {
        fontSize: 12,
        color: 'grey',
        paddingBottom: 25,
    },
    link: {
        fontSize: 20,
        color: '#1D8DFF'
    },
    redLink: {
        fontSize: 20,
        color: '#ff0000'
    },
    slider: {
        width: width - 50,
    }
});