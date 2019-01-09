import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const Expand = class extends Component {
    displayName: 'Expand';

    constructor(props, context) {
        super(props, context);

        if (this.props.animatedValue) {
            this.state = {height: this.props.animatedValue };
        } else if (this.props.initialHeight && this.props.value) {
            //Open by default
            this.state = {height: new Animated.Value(this.props.initialHeight)};
        } else {
            this.state = {height: new Animated.Value(0)};
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.props.value ? this.open() : this.close();
        }
    }

    close = () => {
        Animated.timing(this.state.height, {
            easing: Easing.inOut(Easing.ease),
            duration: 300,
            toValue: this.props.minHeight || 0,
        }).start();
    };

    open = () => {
        Animated.timing(this.state.height, {
            easing: Easing.inOut(Easing.ease),
            duration: 270,
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
                    <View ref="expand" onLayout={this._setMaxHeight.bind(this)} style={style}>
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