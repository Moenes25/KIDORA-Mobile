import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class AuthService {
  final String baseUrl = "http://10.0.2.2:5000/api/auth"; 
  // For Android emulator use 10.0.2.2 instead of localhost

  Future<Map<String, dynamic>> register({
    required String firstname,
    required String lastname,
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse("$baseUrl/register"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "firstname": firstname,
        "lastname": lastname,
        "email": email,
        "password": password
      }),
    );

    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse("$baseUrl/login"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email, "password": password}),
    );

    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> updateProfile({
    required String token,
    required String firstname,
    required String lastname,
    required String location,
    required String about,
  }) async {
    final response = await http.put(
      Uri.parse("$baseUrl/profile/update"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "firstname": firstname,
        "lastname": lastname,
        "location": location,
        "about": about,
      }),
    );

    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> uploadProfileImage({
    required String token,
    required File image,
  }) async {
    var request = http.MultipartRequest(
      "POST",
      Uri.parse("$baseUrl/upload-profile-picture"),
    );

    request.headers["Authorization"] = "Bearer $token";

    request.files.add(
      await http.MultipartFile.fromPath("image", image.path),
    );

    var response = await request.send();
    final res = await http.Response.fromStream(response);

    return jsonDecode(res.body);
  }
}
