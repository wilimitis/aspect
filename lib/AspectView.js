import InputAccessoryView from 'InputAccessoryView';
import _ from 'lodash';
import React from 'react';
import {Keyboard, Text, TextInput, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements'
import {SwipeListView} from 'react-native-swipe-list-view';
import {connect} from 'react-redux';

import {addAspect, deleteAspect, updateAspect} from './store/aspect/actionCreators';
import {ROOT_ID} from './store/aspect/constants';
import {getAspects} from './store/aspect/selectors';
import styles from './styles';

const getParentId = (props) => (_.get(props.navigation.state, 'params.parentId', ROOT_ID));

class Aspect extends React.PureComponent {
  render() {
    return (
      <TouchableHighlight
        style={{backgroundColor: 'grey'}}
        onPress={() => this.props.onPressAspect(this.props.id, this.props.name)}
        underlayColor="lightgrey"
      >
        <Text style={styles.textDefault}>{this.props.name}</Text>
      </TouchableHighlight>
    );
  }
}

class AspectHidden extends React.PureComponent {
  renderIcon({containerStyle, name, onPress}) {
    return (
      <Icon
        key={name}
        containerStyle={containerStyle}
        color="black"
        name={name}
        onPress={onPress}
        size={32}
        type='evil-icons'
        underlayColor="lightgrey"
      />
    );
  }

  renderIcons() {
    let icons = [
      {
        name: 'close',
        onPress: () => this.props.onPressDelete(this.props.id),
      },
      {
        name: 'edit',
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
      <View style={{alignItems: 'center', flex: 1, flexDirection: 'row'}}>
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

  resetInput() {
    this.setState(this.getInitialState());
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
          onRowDidOpen={(rowKey, rowMap) => (this.openRow = rowMap[rowKey])}
          renderItem={({item}) => this._renderAspect(item)}
          renderHiddenItem={({item}) => this._renderAspectHidden(item)}
          rightOpenValue={openValue * -1}
          useFlatList
        />
        <InputAccessoryView style={{flexDirection: 'row'}}>
          <TextInput
            style={[styles.textDefault, {flex: 1}]}
            ref={(input) => (this.input = input)}
            onChangeText={(name) => this.setState({name})}
            placeholder="placeholder"
            value={this.state.name}
          />
          <TouchableOpacity
            onPress={() => {
              if (this.editAspectId) {
                this.props.updateAspect(this.editAspectId, {name: this.state.name});
              } else {
                this.props.addAspect({name: this.state.name, parentId: this.parentId});
              }
              this.resetInput();
            }}
          >
            <Text style={styles.textDefault}>ok</Text>
          </TouchableOpacity>
        </InputAccessoryView>
      </React.Fragment>
    );
  }
}

AspectView.navigationOptions = ({navigation}) => {
  let title = _.get(navigation.state, 'params.name', 'aspects');
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
