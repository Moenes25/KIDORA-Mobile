import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/Login";
import Register from "./screens/Register";
import ProfileEdit from "./screens/ProfileEdit";
import HomeScreen from "./screens/HomeScreen"; 
import ProfileScreen from "./screens/ProfileScreen"; 
import EditProfileScreen from "./screens/EditProfileScreen";
import ChangePwdScreen from "./screens/ChangePwdScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="ChangePwdScreen" component={ChangePwdScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}