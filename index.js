/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import database from '@react-native-firebase/database';


import firestore from '@react-native-firebase/firestore';

firestore().settings({
  persistence: false,
});
database().setPersistenceEnabled(false);
AppRegistry.registerComponent(appName, () => App);
