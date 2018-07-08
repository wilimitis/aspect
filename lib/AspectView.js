import InputAccessoryView from 'InputAccessoryView';
import _ from 'lodash';
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements'
import {SwipeListView} from 'react-native-swipe-list-view';
import {connect} from 'react-redux';

import {addAspect, deleteAspect, updateAspect} from './store/aspect/actionCreators';
import {ROOT_ID} from './store/aspect/constants';
import {getAspects} from './store/aspect/selectors';
import styles, {color, spacing} from './styles';

const getParentId = (props) => (_.get(props.navigation.state, 'params.parentId', ROOT_ID));

class Aspect extends React.PureComponent {
  render() {
    return (
      <TouchableHighlight
        style={{backgroundColor: color.darkest, padding: spacing.medium}}
        onPress={() => this.props.onPressAspect(this.props.id, this.props.name)}
        underlayColor={color.darker}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon color={color.light} name="triangle-right" size={28} type="entypo" />
          <Text style={[styles.textDefault, {flex: 1}]}>{this.props.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

class AspectHidden extends React.PureComponent {
  renderIcon({color, containerStyle, name, onPress}) {
    return (
      <Icon
        key={name}
        containerStyle={containerStyle}
        color={color}
        name={name}
        onPress={onPress}
        size={64}
        type="evilicon"
        underlayColor="transparent"
      />
    );
  }

  renderIcons() {
    let icons = [
      {
        color: color.complementaryLighter,
        name: 'close',
        onPress: () => this.props.onPressDelete(this.props.id),
      },
      {
        color: color.lighter,
        name: 'pencil',
        onPress: () => this.props.onPressEdit(this.props.id),
        containerStyle: {
          marginLeft: 'auto',
        },
      },
    ]
    return icons.map(this.renderIcon);
  }

  render() {
    return (
      <View style={{alignItems: 'center', backgroundColor: color.darker, flex: 1, flexDirection: 'row'}}>
        {this.renderIcons()}
      </View>
    );
  }
}

class AspectView extends React.Component {
  constructor(props) {
    super(props);
    this.editAspectId = null;
    this.input = null;
    this.openRow = null;
    this.parentId = getParentId(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {name: ''};
  }

  componentDidMount() {
    if (this.input && this.props.aspects.length === 0) {
      this.input.focus();
    }
  }

  resetInput() {
    this.editAspectId = null;
    this.setState({name: ''});
    Keyboard.dismiss();
  }

  _navigateToAspect = (parentId, name) => {
    this.props.navigation.push('AspectView', {parentId, name});
  }

  _deleteAspect = (id) => {
    this.props.deleteAspect(id);
  }

  _editAspect = (id) => {
    // Consider mapping.
    let {name} = this.props.aspects.find((a) => a.id === id);
    this.editAspectId = id;
    this.setState({name});
    if (this.input) {
      this.input.focus();
    }
    if (this.openRow) {
      this.openRow.closeRow();
    }
  }

  _cancelEditAspect = () => {
    // TODO
    this.resetInput();
  }

  _renderAspect = (aspect) => {
    return (
      <Aspect
        id={aspect.id}
        name={aspect.name}
        onPressAspect={this._navigateToAspect}
      />
    );
  }

  _renderAspectHidden = (aspect) => {
    return (
      <AspectHidden
        id={aspect.id}
        onPressDelete={this._deleteAspect}
        onPressEdit={this._editAspect}
      />
    );
  }

  render() {
    let openValue = 75;
    return (
      <React.Fragment>
        <SwipeListView
          data={this.props.aspects}
          keyExtractor={({id}) => id}
          closeOnRowBeginSwipe={true}
          leftOpenValue={openValue}
          onRowOpen={(rowKey, rowMap) => (this.openRow = rowMap[rowKey])}
          renderItem={({item}) => this._renderAspect(item)}
          renderHiddenItem={({item}) => this._renderAspectHidden(item)}
          rightOpenValue={openValue * -1}
          useFlatList
        />
        <KeyboardAvoidingView
          behavior={Platform.select({android: 'height', ios: 'padding'})}
          keyboardVerticalOffset={Platform.select({android: 0, ios: 64})}
        >
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderTopColor: color.dark,
            borderTopWidth: 1,
            flexDirection: 'row',
            padding: spacing.medium,
          }}>
            <TextInput
              style={[styles.textDefault, {flex: 1, paddingTop: 0}]}
              ref={(input) => (this.input = input)}
              autoCorrect={false}
              multiline={true}
              onChangeText={(name) => this.setState({name})}
              placeholder="What's in your mind?"
              placeholderTextColor={color.light}
              selectionColor={color.lighter}
              underlineColorAndroid="transparent"
              value={this.state.name}
            />
            <Icon
              containerStyle={{marginLeft: 'auto'}}
              color={this.state.name ? color.lighter : color.light}
              disabled={!this.state.name}
              size={64}
              onPress={() => {
                if (this.editAspectId) {
                  this.props.updateAspect(this.editAspectId, {name: this.state.name});
                } else {
                  this.props.addAspect({name: this.state.name, parentId: this.parentId});
                }
                this.resetInput();
              }}
              name="check"
              type="evilicon"
              underlayColor="transparent"
            />
          </View>
        </KeyboardAvoidingView>
      </React.Fragment>
    );
  }
}

AspectView.navigationOptions = ({navigation}) => {
  let title = _.get(navigation.state, 'params.name');
  return {title};
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAspect: (aspect) => dispatch(addAspect(aspect)),
    deleteAspect: (id) => dispatch(deleteAspect(id)),
    updateAspect: (id, props) => dispatch(updateAspect(id, props)),
  };
};

const mapStateToProps = (state, props) => {
  let parentId = getParentId(props);
  return {
    aspects: getAspects(state.aspectState, parentId),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AspectView);
