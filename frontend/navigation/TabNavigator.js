import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import AboutStack from './AboutStack';
import ProfileStack from './ProfileStack';
import MoreStack from './MoreStack';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon;

          switch (route.name) {
            case 'HomeTab':
              icon = "home-outline"; break;
            case 'AboutTab':
              icon = "information-circle-outline"; break;
            case 'ProfileTab':
              icon = "person-circle-outline"; break;
            case 'MoreTab':
              icon = "grid-outline"; break;
          }

          return <Ionicons name={icon} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="AboutTab" component={AboutStack} options={{ title: 'About' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
      <Tab.Screen name="MoreTab" component={MoreStack} options={{ title: 'More' }} />
    </Tab.Navigator>
  );
}
