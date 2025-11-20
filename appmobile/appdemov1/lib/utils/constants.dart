import 'package:flutter/material.dart';

// Couleurs du thème Kidora (basé sur le Figma)
class AppColors {
  static const Color primary = Color(0xFF6C3FE8); 
  static const Color primaryDark = Color(0xFF5A2FD6);
  static const Color primaryLight = Color(0xFF8B64FF);
  
  static const Color secondary = Color(0xFFFF6B9D); 
  static const Color accent = Color(0xFFFFD166); 
  
  static const Color background = Color(0xFFF8F9FE);
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF1A1A1A);
  
  static const Color textPrimary = Color(0xFF2D3142);
  static const Color textSecondary = Color(0xFF8B8B8B);
  static const Color textLight = Color(0xFFBDBDBD);
  
  static const Color success = Color(0xFF4CAF50);
  static const Color error = Color(0xFFE63946);
  static const Color warning = Color(0xFFFF9800);
  static const Color info = Color(0xFF2196F3);
  
  static const Color cardBackground = Color(0xFFFFFFFF);
  static const Color inputBackground = Color(0xFFF5F5F5);
  static const Color border = Color(0xFFE0E0E0);
}

// Gradients
class AppGradients {
  static const LinearGradient primary = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF6C3FE8),
      Color(0xFF8B64FF),
    ],
  );
  
  static const LinearGradient splash = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFF6C3FE8),
      Color(0xFF5A2FD6),
    ],
  );
}

// Spacing
class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
}

// Border Radius
class AppRadius {
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 24.0;
  static const double round = 999.0;
}

// Text Styles
class AppTextStyles {
  static const TextStyle h1 = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
    height: 1.2,
  );
  
  static const TextStyle h2 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
    height: 1.3,
  );
  
  static const TextStyle h3 = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    height: 1.3,
  );
  
  static const TextStyle body1 = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.normal,
    color: AppColors.textPrimary,
    height: 1.5,
  );
  
  static const TextStyle body2 = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    color: AppColors.textSecondary,
    height: 1.5,
  );
  
  static const TextStyle button = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: AppColors.white,
    height: 1.2,
  );
  
  static const TextStyle caption = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.normal,
    color: AppColors.textLight,
    height: 1.4,
  );
}

// Shadows
class AppShadows {
  static const BoxShadow card = BoxShadow(
    color: Color(0x106C3FE8),
    blurRadius: 20,
    offset: Offset(0, 4),
  );
  
  static const BoxShadow button = BoxShadow(
    color: Color(0x206C3FE8),
    blurRadius: 12,
    offset: Offset(0, 4),
  );
}

// API Endpoints
class ApiEndpoints {
  static const String baseUrl = "http://10.0.2.2:5000/api";
  static const String auth = "$baseUrl/auth";
  static const String users = "$baseUrl/users";
  static const String posts = "$baseUrl/posts";
}

// Assets
class AppAssets {
  static const String logo = "assets/images/kidora_logo.png";
  static const String logoText = "assets/images/kidora_text.png";
  static const String splash = "assets/images/splash_bg.png";
}

// Validation
class Validators {
  static String? email(String? value) {
    if (value == null || value.isEmpty) {
      return 'L\'email est requis';
    }
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) {
      return 'Email invalide';
    }
    return null;
  }
  
  static String? password(String? value) {
    if (value == null || value.isEmpty) {
      return 'Le mot de passe est requis';
    }
    if (value.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    return null;
  }
  
  static String? required(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return '$fieldName est requis';
    }
    return null;
  }
  
  static String? name(String? value) {
    if (value == null || value.isEmpty) {
      return 'Le nom est requis';
    }
    if (value.length < 2) {
      return 'Le nom doit contenir au moins 2 caractères';
    }
    return null;
  }
}