import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../api/auth_service.dart';

class ProfileScreen extends StatefulWidget {
  final String token;
  ProfileScreen({required this.token});

  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final firstname = TextEditingController();
  final lastname = TextEditingController();
  final location = TextEditingController();
  final about = TextEditingController();

  File? image;
  final picker = ImagePicker();
  final AuthService auth = AuthService();
  String result = "";

  pickImage() async {
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked != null) setState(() => image = File(picked.path));
  }

  uploadImage() async {
    if (image == null) return;
    final response = await auth.uploadProfileImage(
      token: widget.token,
      image: image!,
    );
    setState(() => result = response.toString());
  }

  updateProfile() async {
    final response = await auth.updateProfile(
      token: widget.token,
      firstname: firstname.text,
      lastname: lastname.text,
      location: location.text,
      about: about.text,
    );
    setState(() => result = response.toString());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Profile")),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            image == null
                ? CircleAvatar(radius: 50, child: Icon(Icons.person))
                : CircleAvatar(radius: 50, backgroundImage: FileImage(image!)),
            TextButton(onPressed: pickImage, child: Text("Select Image")),
            TextButton(onPressed: uploadImage, child: Text("Upload Image")),

            TextField(controller: firstname, decoration: InputDecoration(labelText: "First Name")),
            TextField(controller: lastname, decoration: InputDecoration(labelText: "Last Name")),
            TextField(controller: location, decoration: InputDecoration(labelText: "Location")),
            TextField(controller: about, decoration: InputDecoration(labelText: "About")),

            SizedBox(height: 20),
            ElevatedButton(onPressed: updateProfile, child: Text("Update Profile")),
            SizedBox(height: 20),
            Text(result),
          ],
        ),
      ),
    );
  }
}
