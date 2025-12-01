import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator();

export default function AboutStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AboutMain" component={AboutScreen} options={{ title: 'About' }} />
    </Stack.Navigator>
  );
}
