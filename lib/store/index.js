import {AsyncStorage} from 'react-native';
import {combineReducers, createStore} from 'redux';

import aspectReducer from './aspect/reducer';

const STORAGE_KEY = 'aspect:state';

export default async function() {
  let reducer = combineReducers({
    aspectState: aspectReducer,
  });
  let json = await AsyncStorage.getItem(STORAGE_KEY);
  console.log(JSON.parse(json));
  let store = createStore(reducer, json ? JSON.parse(json) : undefined);
  store.subscribe(async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState()));
  });
  return store;
}
