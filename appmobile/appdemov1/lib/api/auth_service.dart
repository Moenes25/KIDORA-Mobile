import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../services/storage_service.dart';

class AuthService {
  final String baseUrl = "http://10.0.2.2:5000/api/auth";
  
  // Register avec gestion d'erreur améliorée
  Future<AuthResponse> register({
    required String firstname,
    required String lastname,
    required String email,
    required String password,
  }) async {
    try {
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

      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        return AuthResponse(
          success: true,
          message: data['message'] ?? 'Inscription réussie',
          data: data,
        );
      } else {
        return AuthResponse(
          success: false,
          message: data['message'] ?? 'Erreur lors de l\'inscription',
          error: data['error'],
        );
      }
    } catch (e) {
      return AuthResponse(
        success: false,
        message: 'Erreur de connexion au serveur',
        error: e.toString(),
      );
    }
  }

  // Login avec sauvegarde automatique du token
  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/login"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200) {
        // Sauvegarder le token et les infos utilisateur
        if (data['token'] != null) {
          await StorageService.saveToken(data['token']);
          
          if (data['user'] != null) {
            await StorageService.saveUserInfo(
              userId: data['user']['_id'] ?? '',
              email: data['user']['email'] ?? email,
              firstName: data['user']['firstname'] ?? '',
              lastName: data['user']['lastname'] ?? '',
            );
          }
        }
        
        return AuthResponse(
          success: true,
          message: 'Connexion réussie',
          data: data,
          token: data['token'],
        );
      } else {
        return AuthResponse(
          success: false,
          message: data['message'] ?? 'Email ou mot de passe incorrect',
          error: data['error'],
        );
      }
    } catch (e) {
      return AuthResponse(
        success: false,
        message: 'Erreur de connexion au serveur',
        error: e.toString(),
      );
    }
  }

  // Logout
  Future<void> logout() async {
    await StorageService.logout();
  }

  // Vérifier si l'utilisateur est connecté
  Future<bool> isLoggedIn() async {
    return await StorageService.isLoggedIn();
  }

  // Récupérer le token
  Future<String?> getToken() async {
    return await StorageService.getToken();
  }

  // Update profile
  Future<AuthResponse> updateProfile({
    required String token,
    required String firstname,
    required String lastname,
    required String location,
    required String about,
  }) async {
    try {
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

      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200) {
        return AuthResponse(
          success: true,
          message: 'Profil mis à jour avec succès',
          data: data,
        );
      } else {
        return AuthResponse(
          success: false,
          message: data['message'] ?? 'Erreur lors de la mise à jour',
          error: data['error'],
        );
      }
    } catch (e) {
      return AuthResponse(
        success: false,
        message: 'Erreur de connexion au serveur',
        error: e.toString(),
      );
    }
  }

  // Upload profile image
  Future<AuthResponse> uploadProfileImage({
    required String token,
    required File image,
  }) async {
    try {
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
      final data = jsonDecode(res.body);

      if (res.statusCode == 200) {
        return AuthResponse(
          success: true,
          message: 'Image de profil mise à jour',
          data: data,
        );
      } else {
        return AuthResponse(
          success: false,
          message: data['message'] ?? 'Erreur lors du téléchargement',
          error: data['error'],
        );
      }
    } catch (e) {
      return AuthResponse(
        success: false,
        message: 'Erreur de connexion au serveur',
        error: e.toString(),
      );
    }
  }
}

// Classe pour gérer les réponses de l'API
class AuthResponse {
  final bool success;
  final String message;
  final Map<String, dynamic>? data;
  final String? token;
  final String? error;

  AuthResponse({
    required this.success,
    required this.message,
    this.data,
    this.token,
    this.error,
  });

  @override
  String toString() {
    return 'AuthResponse(success: $success, message: $message)';
  }
}