import 'package:flutter/material.dart';
import './screens/login_screen.dart';
import './screens/register_screen.dart';

void main() {
  runApp(MaterialApp(
    home: LoginScreen(),
    routes: {
      "/register": (context) => RegisterScreen(),
    },
  ));
}
