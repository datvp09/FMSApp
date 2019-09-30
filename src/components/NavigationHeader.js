import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  StatusBar
} from 'react-native'
import images from '../utils/images'
import { isIpX, isiOS, isSmallScreen } from '../Constants'
import PropTypes from 'prop-types'
import { CustomButton } from '../components'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

const APPBAR_HEIGHT = isSmallScreen ? 30 : 35
const STATUSBAR_HEIGHT = isiOS
  ? isIpX
    ? getStatusBarHeight([true])
    : 20
  : StatusBar.currentHeight

export const headerHeight = isIpX
  ? STATUSBAR_HEIGHT + 5
  : APPBAR_HEIGHT + STATUSBAR_HEIGHT

export default class NavigationHeader extends Component {
  renderTitle = () => {
    const { tintColor, title, titleStyle } = this.props
    const tintColorValue = { color: !tintColor ? 'black' : tintColor }

    if (!title) {
      return null
    }

    if (typeof title === 'string') {
      return (
        <Text style={[styles.titleText, tintColorValue, titleStyle]}>
          {title}
        </Text>
      )
    }

    return title()
  }

  renderBackButton = () => {
    const {
      leftViewContainerStyle,
      turnOnQR,
      onBackPress = () => {},
      isDrawer,
      isShowBackButton
    } = this.props

    if (isDrawer) {
      return null
    }

    if (isShowBackButton) {
      return (
        <CustomButton
          imageButton={true}
          imageSource={images.ic_backButtonWhite}
          imageContainerStyle={[styles.leftView, leftViewContainerStyle]}
          onPress={onBackPress}
        />
      )
    }

    return <View style={styles.leftView} />
  }

  renderRightView = () => {
    const { rightView, isDrawer } = this.props

    if (isDrawer) {
      return null
    }

    if (rightView) {
      return rightView()
    }

    return <View style={styles.rightView} />
  }

  renderStatusBarIOS = () => {
    if (!isiOS) {
      return null
    }

    if (isIpX) {
      return (
        <View
          style={{
            height: getStatusBarHeight([true]),
            backgroundColor: '#1365AF'
          }}
        />
      )
    }
    return (
      <View style={{ height: 20, backgroundColor: '#1365AF' }} />
    )
  }

  render() {
    const { style, isDrawer } = this.props

    return (
      <View>
        {this.renderStatusBarIOS()}
        <View
          style={[
            styles.container,
            style,
            { justifyContent: isDrawer ? 'center' : 'space-between' }
          ]}
        >
          {this.renderBackButton()}
          {this.renderTitle()}
          {this.renderRightView()}
        </View>
      </View>
    )
  }
}

NavigationHeader.propTypes = {
  iOSStatusBarColor: PropTypes.string
}

NavigationHeader.defaultProps = {
  iOSStatusBarColor: '#1365AF'
}

const buttonWrap = {
  width: 60,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center'
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: headerHeight,
    alignItems: 'center',
    backgroundColor: '#1365AF'
  },
  titleText: {
    fontSize: 17
  },
  leftView: {
    ...buttonWrap
  },
  rightView: {
    ...buttonWrap
  }
})
