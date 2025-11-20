import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../utils/constants.dart';
import '../widgets/custom_widgets.dart';
import '../api/auth_service.dart';
import 'login_screen.dart';
import 'home_screen.dart';

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final AuthService _authService = AuthService();
  int _currentStep = 0;

  @override
  void initState() {
    super.initState();
    _startAnimation();
  }

  void _startAnimation() async {
    // Étape 1: Logo seul
    await Future.delayed(Duration(milliseconds: 1500));
    if (mounted) setState(() => _currentStep = 1);

    // Étape 2: Logo + texte
    await Future.delayed(Duration(milliseconds: 1500));
    if (mounted) setState(() => _currentStep = 2);

    // Étape 3: Vérification de l'authentification
    await Future.delayed(Duration(milliseconds: 1000));
    _checkAuthentication();
  }

  void _checkAuthentication() async {
    final isLoggedIn = await _authService.isLoggedIn();
    
    if (mounted) {
      if (isLoggedIn) {
        // Utilisateur connecté -> Page d'accueil
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => HomeScreen()),
        );
      } else {
        // Utilisateur non connecté -> Page de login
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => LoginScreen()),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: AppGradients.splash,
        ),
        child: SafeArea(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Spacer(),
              
              // Logo animé
              if (_currentStep >= 0)
                FadeInDown(
                  duration: Duration(milliseconds: 800),
                  child: KidoraLogo(
                    size: 140,
                    showText: _currentStep >= 1,
                  ),
                ),
              
              // Texte "Welcome"
              if (_currentStep >= 2)
                FadeInUp(
                  duration: Duration(milliseconds: 600),
                  child: Padding(
                    padding: EdgeInsets.only(top: AppSpacing.lg),
                    child: Text(
                      'Welcome !',
                      style: AppTextStyles.h2.copyWith(
                        color: AppColors.white,
                        fontSize: 28,
                      ),
                    ),
                  ),
                ),
              
              Spacer(),
              
              // Indicateur de chargement
              if (_currentStep >= 2)
                FadeIn(
                  duration: Duration(milliseconds: 400),
                  child: Padding(
                    padding: EdgeInsets.only(bottom: AppSpacing.xxl),
                    child: SizedBox(
                      width: 40,
                      height: 40,
                      child: CircularProgressIndicator(
                        strokeWidth: 3,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          AppColors.white,
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

// Version alternative avec 3 écrans séparés (comme dans le Figma)
class SplashScreenSteps extends StatefulWidget {
  @override
  _SplashScreenStepsState createState() => _SplashScreenStepsState();
}

class _SplashScreenStepsState extends State<SplashScreenSteps> {
  final PageController _pageController = PageController();
  final AuthService _authService = AuthService();
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _startAutoSlide();
  }

  void _startAutoSlide() async {
    // Page 1: Logo seul
    await Future.delayed(Duration(milliseconds: 1500));
    if (mounted && _currentPage < 2) {
      _pageController.animateToPage(
        1,
        duration: Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
      setState(() => _currentPage = 1);
    }

    // Page 2: Logo + texte
    await Future.delayed(Duration(milliseconds: 1500));
    if (mounted && _currentPage < 2) {
      _pageController.animateToPage(
        2,
        duration: Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
      setState(() => _currentPage = 2);
    }

    // Page 3: Welcome + navigation
    await Future.delayed(Duration(milliseconds: 1500));
    _checkAuthentication();
  }

  void _checkAuthentication() async {
    final isLoggedIn = await _authService.isLoggedIn();
    
    if (mounted) {
      if (isLoggedIn) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => HomeScreen()),
        );
      } else {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => LoginScreen()),
        );
      }
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: AppGradients.splash,
        ),
        child: PageView(
          controller: _pageController,
          physics: NeverScrollableScrollPhysics(),
          children: [
            // Page 1: Logo seul
            _buildPage(showLogo: true, showText: false, showWelcome: false),
            
            // Page 2: Logo + texte KIDORA
            _buildPage(showLogo: true, showText: true, showWelcome: false),
            
            // Page 3: Tout + Welcome
            _buildPage(showLogo: true, showText: true, showWelcome: true),
          ],
        ),
      ),
    );
  }

  Widget _buildPage({
    required bool showLogo,
    required bool showText,
    required bool showWelcome,
  }) {
    return SafeArea(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (showLogo)
              FadeIn(
                duration: Duration(milliseconds: 600),
                child: KidoraLogo(
                  size: 140,
                  showText: showText,
                ),
              ),
            
            if (showWelcome) ...[
              SizedBox(height: AppSpacing.xl),
              FadeInUp(
                duration: Duration(milliseconds: 500),
                child: Text(
                  'Welcome !',
                  style: AppTextStyles.h2.copyWith(
                    color: AppColors.white,
                    fontSize: 28,
                  ),
                ),
              ),
              SizedBox(height: AppSpacing.xl),
              SizedBox(
                width: 40,
                height: 40,
                child: CircularProgressIndicator(
                  strokeWidth: 3,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    AppColors.white,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}