import {Dimensions, Platform} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';

const {height, width} = Dimensions.get('window');
const isiOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const isiP5 =
  isiOS &&
  ((width === 320 && height === 568) || (width === 568 && height === 320));
const isiPPlus =
  isiOS &&
  ((width === 414 && height === 736) || (width === 736 && height === 414));
const isIpX = isIphoneX(); // X, XS, XR
const isSmallScreen = height < 650;
const isBigScreen = isiOS ? height > 800 : height > 730;

export {
  width,
  height,
  isiOS,
  isiP5,
  isiPPlus,
  isIpX,
  isAndroid,
  isSmallScreen,
  isBigScreen,
}
