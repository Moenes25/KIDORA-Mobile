import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/LoginSc";
import Registerv1 from "./screens/Registerv1";  // Adjust import if file name differs
import ProfileEdit from "./screens/ProfileEdit";
import HomeScreen from "./screens/HomeScreen"; 
import ProfileScreen from "./screens/ProfileScreen"; 
import EditProfileScreen from "./screens/EditProfileScreen";
import ChangePwdScreen from "./screens/ChangePwdScreen";
import ChildrenListScreen from "./screens/ChildrenListScreen";
import ChildDetailScreen from "./screens/ChildDetailsScreen";
import MapScreen from "./screens/MapScreen";
import CalendarScreen from "./screens/CalendarScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registerv1" component={Registerv1} />
        <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="ChangePwdScreen" component={ChangePwdScreen} />
        <Stack.Screen name="ChildrenListScreen" component={ChildrenListScreen} />
        <Stack.Screen name="ChildDetailScreen" component={ChildDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}