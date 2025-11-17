import 'package:flutter/material.dart';
import '../api/auth_service.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  final AuthService auth = AuthService();
  String message = "";

  login() async {
    final response = await auth.login(
      email: emailController.text,
      password: passwordController.text,
    );

    setState(() {
      message = response.toString();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Login")),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(controller: emailController, decoration: InputDecoration(labelText: "Email")),
            TextField(controller: passwordController, obscureText: true, decoration: InputDecoration(labelText: "Password")),
            SizedBox(height: 20),
            ElevatedButton(onPressed: login, child: Text("Login")),
            SizedBox(height: 20),
            Text(message),
          ],
        ),
      ),
    );
  }
}
