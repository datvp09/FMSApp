import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 40,
    alignItems: 'center',
    borderRadius: 3,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 15,
  },
});

export default class CustomButton extends Component {
  render() {
    const {
      content,
      withoutFeedback = false,
      style = {},
      textStyle = {},
      imageContainerStyle = {},
      onPress = () => {},
      disabled = false,
      activeOpacity = 0.2,
      imageButton = false,
      imageSource = {},
      imageStyle = {},
    } = this.props;

    const Button = withoutFeedback
      ? TouchableWithoutFeedback
      : TouchableOpacity;
    const buttonProps = {
      onPress: onPress,
      disabled: disabled,
    };
    if (!withoutFeedback) {
      buttonProps.activeOpacity = activeOpacity;
    }

    return (
      <Button {...buttonProps}>
        {imageButton ? (
          <View style={imageContainerStyle}>
            <Image
              source={imageSource}
              style={imageStyle}
              resizeMode={'contain'}
            />
          </View>
        ) : (
          <View style={[styles.container, style]}>
            <Text style={[styles.text, textStyle]}>{content}</Text>
          </View>
        )}
      </Button>
    );
  }
}
