import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const Expand = class extends Component {
    displayName: 'Expand';

    constructor(props, context) {
        super(props, context);

        if (this.props.animatedValue) {
            this.state = {height: this.props.animatedValue, duration: 300 };
        } else if (this.props.expandOnStart && this.props.value) {
            //Open by default, but dont show animation
            this.state = {height: new Animated.Value(0), duration: 0};
        } else {
            this.state = {height: new Animated.Value(0), duration: 300 };
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.props.value ? this.open() : this.close();
        }
    }

    close = () => {
        if (this.props.expandOnStart && this.state.duration == 0) {
            this.setState({duration: 300}, this.closeIt)
        } else {
            this.closeIt();
        }
    };

    closeIt = () => {
        Animated.timing(this.state.height, {
            easing: Easing.inOut(Easing.ease),
            duration: this.state.duration,
            toValue: this.props.minHeight || 0,
        }).start();
    }

    open = () => {
        Animated.timing(this.state.height, {
            easing: Easing.inOut(Easing.ease),
            duration: this.state.duration,
            toValue: this.props.initialHeight || this.state.maxHeight,
        }).start();
    };

    _setMaxHeight(event) {
        const layoutHeight = event.nativeEvent.layout.height;
        this.setState(
            {
                maxHeight: Math.min(this.props.maxHeight || layoutHeight, layoutHeight),
            },
            () => {
                this.props.value && !this.props.initialHeight && this.open();
            },
        );
    }

    render() {
        var { style, children, containerStyle, style } = this.props;
        var { height } = this.state;

        return (
            <View style={[styles.containerStyle]}>
                <Animated.View style={[styles.menuStyle, { height }, containerStyle]}>
                    <View onLayout={this._setMaxHeight.bind(this)} style={style}>
                        {children}
                    </View>
                </Animated.View>
            </View>
        );
    }
};

Expand.propTypes = {};

var styles = StyleSheet.create({
    containerStyle: {
        overflow: 'hidden',
    },
    menuStyle: {
        overflow: 'scroll',
        backgroundColor: 'transparent',
    },
});

module.exports = Expand;
