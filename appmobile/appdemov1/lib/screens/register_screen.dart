import 'package:flutter/material.dart';
import '../api/auth_service.dart';

class RegisterScreen extends StatefulWidget {
  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final AuthService auth = AuthService();

  final firstname = TextEditingController();
  final lastname = TextEditingController();
  final email = TextEditingController();
  final password = TextEditingController();

  String message = "";

  register() async {
    final response = await auth.register(
      firstname: firstname.text,
      lastname: lastname.text,
      email: email.text,
      password: password.text,
    );

    setState(() {
      message = response.toString();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Register")),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(controller: firstname, decoration: InputDecoration(labelText: "First Name")),
            TextField(controller: lastname, decoration: InputDecoration(labelText: "Last Name")),
            TextField(controller: email, decoration: InputDecoration(labelText: "Email")),
            TextField(controller: password, obscureText: true, decoration: InputDecoration(labelText: "Password")),
            SizedBox(height: 20),
            ElevatedButton(onPressed: register, child: Text("Register")),
            SizedBox(height: 20),
            Text(message),
          ],
        ),
      ),
    );
  }
}
