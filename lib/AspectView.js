import InputAccessoryView from 'InputAccessoryView';
import _ from 'lodash';
import React from 'react';
import {Keyboard, Text, TextInput, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {connect} from 'react-redux';

import {addAspect, deleteAspect, updatedAspect} from './store/aspect/actionCreators';
import {getAspects} from './store/aspect/selectors';

class Aspect extends React.PureComponent {
  render() {
    return (
      <TouchableHighlight
        style={{backgroundColor: 'grey'}}
        onPress={() => this.props.navigate(this.props.id, this.props.name)}
        underlayColor="lightgrey"
      >
        <Text>{this.props.name}</Text>
      </TouchableHighlight>
    );
  }
}

class AspectView extends React.Component {
  constructor(props) {
    super(props);
    this.parentId = _.get(props.navigation.state, 'params.parentId');
    this.state = {name: ''};
  }

  _navigate = (parentId, name) => {
    this.props.navigation.push('AspectView', {parentId, name});
  }

  renderAspect(aspect) {
    return (
      <Aspect
        id={aspect.id}
        name={aspect.name}
        navigate={this._navigate}
      />
    );
  }

  renderHiddenAspect(aspect) {
    return (
      <Text style={{textAlign: 'right'}}>hey</Text>
    );
  }

  render() {
    return (
      <React.Fragment>
        <SwipeListView
          data={this.props.aspects}
          keyExtractor={({id}) => id}
          renderItem={({item}) => this.renderAspect(item)}
          renderHiddenItem={({item}) => this.renderHiddenAspect(item)}
          rightOpenValue={-75}
          useFlatList
        />
        <InputAccessoryView style={{flexDirection: 'row'}}>
          <TextInput
            style={{flex: 1}}
            onChangeText={(name) => this.setState({name})}
            placeholder="placeholder"
            value={this.state.name}
          />
          <TouchableOpacity
            onPress={() => {
              this.props.addAspect({name: this.state.name}, this.parentId);
              this.setState({name: ''});
              Keyboard.dismiss();
            }}
          >
            <Text>ok</Text>
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
    addAspect: (aspect, parentId) => dispatch(addAspect(aspect, parentId)),
    deleteAspect: (id, parentId) => dispatch(deleteAspect(id, parentId)),
    updateAspect: (id, props) => dispatch(updateAspect(id, props)),
  };
};

const mapStateToProps = (state, props) => {
  let parentId = _.get(props.navigation.state, 'params.parentId');
  return {
    aspects: getAspects(state.aspectState, parentId),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AspectView);
