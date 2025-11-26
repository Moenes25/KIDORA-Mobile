import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Tabs from './Tabs';
import ProfileScreen from '../../screens/Profile';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="HomeTabs" component={Tabs} options={{ title: 'Home' }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
