import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import AboutStack from './AboutStack';
import CustomDrawer from '../components/CustomDrawer';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} options={{ title: 'Home' }} />
      <Drawer.Screen name="AboutMenu" component={AboutStack} options={{ title: 'About' }} />
    </Drawer.Navigator>
  );
}
