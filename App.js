import React, {Fragment, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  RefreshControl
} from 'react-native';
import {isiOS, width, isIpX} from './src/Constants';
import images from './src/utils/images';
import RNFS from 'react-native-fs';
import {CustomButton, NavigationHeader} from './src/components';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'

export default class App extends Component {
  constructor(props) {
    super(props);

    const path = isiOS ? RNFS.LibraryDirectoryPath : RNFS.ExternalStorageDirectoryPath

    this.state = {
      isLoading: true,
      isAboutVisible: false,
      isErrorVisible: false,
      isFileSelected: false,
      isFolderSelected: false,
      isRenaming: false,
      errorMsg: '',
      files: [],
      rootPath: path,
      currentPath: path,
      currentItemIndex: 0,
      currentItem: {},
      renameText: '',
    }
  }

  componentDidMount() {
    this.loadFiles(this.state.currentPath)
  }

  loadFiles = path => {
    RNFS.readDir(path)
      .then(result => {
        this.setState({files: result, isLoading: false, isFileSelected: false, isFolderSelected: false});
      })
      .catch(err => {
        this.setState({isLoading: false});
      });
  }

  onItemPress = (item, index) => {
    const newStates = {
      isFileSelected: item.isFile(),
      currentItem: item,
      currentItemIndex: index,
      renameText: item.name, 
    }
    if (item.isDirectory()) {
      newStates.currentPath = item.path
    }
    this.setState(newStates, () => {
      if (item.isDirectory()) {
        this.loadFiles(item.path)
      }
    })
  }

  onItemLongPress = (item, index) => {
    this.setState({
      isFileSelected: item.isFile(),
      isFolderSelected: item.isDirectory(),
      currentItem: item, 
      renameText: item.name, 
      currentItemIndex: index
    })
  }

  onChangeText = text => this.setState({renameText: text})

  renderFolderStructure = (item, index) => {
    let icon = images.iconFolder;
    if (item.isFile()) {
      icon = images.iconFile
    }
    const {isRenaming, currentItemIndex, renameText} = this.state

    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.onItemPress(item, index)}
        onLongPress={() => this.onItemLongPress(item, index)}
      >
        <View style={[styles.itemRow, {marginTop: index == 0 ? 10 : 0}]}>
          <View style={styles.iconWrap}>
            <Image
              source={icon}
              style={[styles.icon, item.isFile() && {width: 22, height: 22}]}
            />
          </View>
          {isRenaming && index == currentItemIndex ?
            <View style={styles.textWrapper}>
              <View style={styles.renameInputContainer}>
                <TextInput
                  ref={ref => this.renameInputRef = ref}
                  value={renameText}
                  style={styles.renameInput}
                  onChangeText={this.onChangeText}
                />
              </View>
            </View>
            :
            <View style={styles.textWrapper}>
              <Text style={styles.text}>{item.name}</Text>
            </View>
          }
        </View>
      </TouchableOpacity>
    );
  };

  onInfoPress = () => this.setState({isAboutVisible: true});

  hideAbout = () => this.setState({isAboutVisible: false});

  hideError = () => this.setState({isErrorVisible: false});

  renderBottomBar = () => {
    const {isFileSelected, isFolderSelected, isRenaming} = this.state

    return (
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBarWrap}>
          {isRenaming ?
            <TouchableOpacity onPress={this.onFinishRenamingFile}>
              <View style={styles.bottomBarItem}>
                <Image source={images.iconCheck} />
                <Text style={styles.bottomBarItemText}>{'OK'}</Text>
              </View>
            </TouchableOpacity>
            :
            <Fragment>
              {(isFolderSelected || isFileSelected) &&
                <TouchableOpacity onPress={this.onRenameFile}>
                  <View style={styles.bottomBarItem}>
                    <Image source={images.iconRename} />
                    <Text style={styles.bottomBarItemText}>{'Rename'}</Text>
                  </View>
                </TouchableOpacity>
              }
              {(isFolderSelected || isFileSelected) &&
                <TouchableOpacity onPress={this.onDeleteFile}>
                  <View style={styles.bottomBarItem}>
                    <Image source={images.iconDelete} />
                    <Text style={styles.bottomBarItemText}>{'Delete'}</Text>
                  </View>
                </TouchableOpacity>
              }
              <TouchableOpacity onPress={this.onInfoPress}>
                <View style={styles.bottomBarItem}>
                  <Image source={images.iconInfo} />
                  <Text style={styles.bottomBarItemText}>{'Info'}</Text>
                </View>
              </TouchableOpacity> 
            </Fragment>
            }
        </View>
      </View>
    );
  };

  renderInfoModal = () => {
    const {isFileSelected, isFolderSelected, currentItem, isAboutVisible} = this.state

    return (
      <Modal
        isVisible={isAboutVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        onBackButtonPress={this.hideAbout}
        onBackdropPress={this.hideAbout}
        backdropTransitionOutTiming={0}
      >
        <View style={styles.about}>
          {isFolderSelected || isFileSelected ?
            <View style={{flexDirection:'row', padding: 10}}>
              <View>
                <Text style={styles.infoRow}>{'Name: '}</Text>
                <Text style={styles.infoRow}>{'Size: '}</Text>
                <Text style={styles.infoRow}>{'Create date: '}</Text>
                <Text style={styles.infoRow}>{'Modifiled date:  '}</Text>
                <Text style={styles.infoRow}>{'Path: '}</Text>
              </View>
              <View>
                <Text style={styles.infoRow}>{currentItem.name}</Text>
                <Text style={styles.infoRow}>{currentItem.size + ' bytes'}</Text>
                <Text style={styles.infoRow}>{moment(currentItem.ctime).format('hh:mm A DD/MM/YYYY')}</Text>
                <Text style={styles.infoRow}>{moment(currentItem.mtime).format('hh:mm A DD/MM/YYYY')}</Text>
                <Text style={[styles.infoRow, {width: width / 2 + 20}]}>{currentItem.path}</Text>
              </View>
            </View>
            :
            <View>
              <Text style={styles.aboutTitle}>{'File Management System 1.0'}</Text>
              <Text style={styles.aboutTitle}>Developed by <Text style={{fontWeight: '600'}}>Đạt VP</Text></Text>
            </View>
          }
          <CustomButton 
            content={'OK'}
            onPress={this.hideAbout}
            style={{borderTopWidth: 1, borderTopColor: '#ccc'}}
          />
        </View>
      </Modal>
    )
  }

  renderErrorModal = () => {
    const {isErrorVisible, errorMsg} = this.state

    return (
      <Modal
        isVisible={isErrorVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        onBackButtonPress={this.hideError}
        onBackdropPress={this.hideError}
        backdropTransitionOutTiming={0}
      >
        <View style={styles.about}>
          <View style={{padding: 10}}>
            <Text style={styles.infoRow}>{'Error'}</Text>
            <Text style={styles.infoRow}>{errorMsg}</Text>
          </View>
          <CustomButton 
            content={'OK'}
            onPress={this.hideError}
            style={{borderTopWidth: 1, borderTopColor: '#ccc'}}
          />
        </View>
      </Modal>
    )
  }

  onRenameFile = () => {
    this.setState({isRenaming: true}, () => this.renameInputRef.focus())
  }

  onFinishRenamingFile = () => {
    const {currentPath, currentItem, renameText} = this.state

    RNFS.moveFile(currentPath + '/' + currentItem.name, currentPath + '/' + renameText).then(res => {
      this.loadFiles(currentPath)
    }).catch(e => {
      console.log('error-rename', e)
    })
    this.setState({isRenaming: false})
  }

  onDeleteFile = () => {
    const {currentPath, currentItem} = this.state

    RNFS.unlink(currentPath + '/' + currentItem.name).then(res => {
      this.loadFiles(currentPath)
    }).catch(e => {
      console.log('error-rename', e)
    })
  }

  onCreateFile = () => {
    const {currentPath} = this.state

    RNFS.writeFile(currentPath + '/text.txt', 'Lorem ipsum dolor sit amet', 'utf8')
      .then((success) => {
        this.loadFiles(currentPath)
      })
      .catch((err) => {
        console.log('writeFile-error', err.message);
      });
  }

  onCreateFolder = () => {
    const {currentPath} = this.state

    RNFS.mkdir(currentPath + '/SampleFolder')
      .then((success) => this.loadFiles(currentPath))
      .catch((err) => {
        this.setState({isErrorVisible: true, errorMsg: err.message})
      })
  }

  onBackPress = () => {
    this.setState(prevStates => ({
      currentPath: prevStates.currentPath.substring(0, prevStates.currentPath.lastIndexOf('/'))
    }), () => {
      this.loadFiles(this.state.currentPath)
    })
  }

  onRefresh = () => {
    this.setState({isLoading: true}, () => {
      setTimeout(() => this.loadFiles(this.state.currentPath), 500)
    })
  }

  render() {
    const {isLoading, files, currentPath, rootPath, currentItem} = this.state;
    const isRoot = currentPath == rootPath
    const currentPathName = currentPath.split('/').pop()

    return (
      <Fragment>
        <StatusBar barStyle="light-content" backgroundColor='#1365AF'/>
        <NavigationHeader
          style={{height: 55}}
          title={isRoot ? 'File Management System' : currentPathName}
          tintColor={'white'}
          isShowBackButton={!isRoot}
          onBackPress={this.onBackPress}
        />
        <TouchableWithoutFeedback onPress={() => this.setState({isFileSelected: false, isFolderSelected: false})}>
          <SafeAreaView style={{flex: 1}}>
            <KeyboardAwareScrollView
              contentContainerStyle={{paddingBottom: isIpX ? 200 : 170}}
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={this.onRefresh}/>
              }
            >
              {!isLoading && files.length == 0 &&
                <Text style={styles.empty}>{'No file or folder'}</Text>
              }
              {files.map((item, index) => this.renderFolderStructure(item, index))}
            </KeyboardAwareScrollView>
            {this.renderBottomBar()}
            {this.renderInfoModal()}
            <ActionButton
              buttonColor="rgba(231,76,60,1)"
              onPress={() => {}}
              offsetY={isIpX ? 120 : 120 - 34}>
              <ActionButton.Item
                buttonColor='white'
                title="File"
                onPress={this.onCreateFile}>
                <Image source={images.iconFile} style={{width: 24, height: 24}}/>
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor="#3498db"
                title="Folder"
                onPress={this.onCreateFolder}>
                <Image source={images.iconFolder} style={{width: 24, height: 24}}/>
              </ActionButton.Item>
            </ActionButton>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  itemRow: {
    margin: 10,
    height: 40,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  iconWrap: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
    marginRight: 10,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 15,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    width,
    height: isIpX ? 60 + 34 : 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: 'white'
  },
  bottomBarWrap: {
    height: 60,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 40
  },
  bottomBarItem: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarItemText: {
    marginTop: 3,
    fontSize: 12,
  },
  about: {
    backgroundColor: 'white',
    width: width - 40,
    minHeight: 150,
    justifyContent: 'space-between',
    borderRadius: 4
  },
  aboutTitle: {
    margin: 18,
    marginBottom: 0,
    fontSize: 16,
  },
  renameInputContainer: {
    borderWidth:1,borderColor:'grey',
    width: width - 100,
    height: '80%',
    paddingHorizontal: 5,
  },
  renameInput: {
    flex: 1,
    padding: 0
  },
  infoRow: {
    marginBottom: 5
  },
  empty: {
    marginTop: 20,
    alignSelf: 'center'
  }
});
