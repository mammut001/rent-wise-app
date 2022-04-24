/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
//-----------------Cannot be deleted-----------------begin
import 'react-native-root-siblings'
//-----------------Cannot be deleted-----------------end
import App from './src/App';
import { name as appName } from './app.json';
import "react-native-gesture-handler"

LogBox.ignoreLogs([
    "Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function."
])
// LogBox.ignoreAllLogs(true)

AppRegistry.registerComponent(appName, () => App);
