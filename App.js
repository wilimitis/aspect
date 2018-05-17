import React from 'react';
import {YellowBox} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {Provider} from 'react-redux';

import AspectView from './lib/AspectView';
import createStore from './lib/store';
import styles, {color} from './lib/styles';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const Navigator = createStackNavigator(
  {
    AspectView
  },
  {
    cardStyle: styles.navigationCard,
    navigationOptions: {
      headerStyle: styles.navigationHeader,
      headerTintStyle: styles.navigationHeaderTintStyle,
      headerTitleStyle: styles.navigationHeaderTitle,
    },
  },
);

export default class App extends React.Component {
  constructor() {
    super();
    this.store = null;
    this.state = {loading: true};
  }

  async componentDidMount() {
    this.store = await createStore();
    this.setState({loading: false});
  }

  render() {
    if (this.state.loading) {
      return null;
    }
    return (
      <Provider store={this.store}>
        <Navigator />
      </Provider>
    );
  }
}
