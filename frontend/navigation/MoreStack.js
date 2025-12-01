import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CalendarScreen from "../screens/CalendarScreen";
import EventScreen from "../screens/EventScreen";
// import WebViewScreen from "../screens/WebViewScreen";

const Stack = createNativeStackNavigator();

export default function MoreStack() {
  return (
    <Stack.Navigator>
     
      {/* <Stack.Screen name="MapView" component={MapsScreen} /> */}
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
      {/* <Stack.Screen name="WebView" component={WebViewScreen} /> */}
    </Stack.Navigator>
  );
}
