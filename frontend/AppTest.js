import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import DetailsScreen from './screens/DetailsScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* -----------------------------
   STACK inside each Tab
-------------------------------- */
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

function AboutStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AboutMain" component={AboutScreen} options={{ title: 'About' }} />
    </Stack.Navigator>
  );
}

/* -----------------------------
   TABS (BottomTabs)
-------------------------------- */
function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="AboutTab" component={AboutStack} options={{ title: 'About' }} />
    </Tab.Navigator>
  );
}

/* -----------------------------
   DRAWER (Sidebar)
-------------------------------- */
export default function AppTest() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Tabs" component={Tabs} options={{ title: 'Main' }} />
        <Drawer.Screen name="About Menu" component={AboutScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
