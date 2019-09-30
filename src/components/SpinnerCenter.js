import React from 'react'
import {View, ActivityIndicator, StyleSheet} from 'react-native'
import Modal from 'react-native-modal'

const SpinnerCenter = props => {
  const {
    isVisible,
    backdropOpacity = 0,
    spinnerSize = 'large',
    spinnerColor = 'white',
  } = props

  return (
    <Modal
      isVisible={isVisible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      animationInTiming={250}
      animationOutTiming={250}
      backdropOpacity={backdropOpacity}
      backdropTransitionOutTiming={0}>
      <View style={styles.overlay}>
        <ActivityIndicator size={spinnerSize} color={spinnerColor} />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 110,
    height: 110,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
})

export default SpinnerCenter
