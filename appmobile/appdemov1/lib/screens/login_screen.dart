import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../api/auth_service.dart';
import '../utils/constants.dart';
import '../widgets/custom_widgets.dart';
import 'register_screen.dart';
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  
  final AuthService _authService = AuthService();
  
  bool _isLoading = false;
  String? _errorMessage;
  String? _successMessage;

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  void _login() async {
    // Fermer le clavier
    FocusScope.of(context).unfocus();
    
    // Réinitialiser les messages
    setState(() {
      _errorMessage = null;
      _successMessage = null;
    });

    // Valider le formulaire
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await _authService.login(
        email: emailController.text.trim(),
        password: passwordController.text,
      );

      setState(() => _isLoading = false);

      if (response.success) {
        // Succès - Naviguer vers la page d'accueil
        setState(() => _successMessage = response.message);
        
        await Future.delayed(Duration(milliseconds: 500));
        
        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => HomeScreen()),
          );
        }
      } else {
        // Erreur
        setState(() => _errorMessage = response.message);
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'Une erreur s\'est produite. Veuillez réessayer.';
      });
    }
  }

  void _navigateToRegister() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => RegisterScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppColors.primary,
              AppColors.primaryDark,
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            physics: BouncingScrollPhysics(),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: Column(
                children: [
                  SizedBox(height: AppSpacing.xl),
                  
                  // Logo
                  FadeInDown(
                    duration: Duration(milliseconds: 600),
                    child: KidoraLogo(
                      size: 100,
                      showText: true,
                    ),
                  ),
                  
                  SizedBox(height: AppSpacing.lg),
                  
                  // Texte "Welcome"
                  FadeInDown(
                    delay: Duration(milliseconds: 200),
                    duration: Duration(milliseconds: 600),
                    child: Text(
                      'Welcome !',
                      style: AppTextStyles.h2.copyWith(
                        color: AppColors.white,
                        fontSize: 26,
                      ),
                    ),
                  ),
                  
                  SizedBox(height: AppSpacing.xxl),
                  
                  // Carte de formulaire
                  FadeInUp(
                    delay: Duration(milliseconds: 400),
                    duration: Duration(milliseconds: 600),
                    child: Container(
                      padding: EdgeInsets.all(AppSpacing.xl),
                      decoration: BoxDecoration(
                        color: AppColors.white,
                        borderRadius: BorderRadius.circular(AppRadius.xl),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 20,
                            offset: Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Titre
                            Text(
                              'Login',
                              style: AppTextStyles.h2.copyWith(
                                color: AppColors.primary,
                                fontSize: 28,
                              ),
                            ),
                            
                            SizedBox(height: AppSpacing.sm),
                            
                            Text(
                              'Connectez-vous pour continuer',
                              style: AppTextStyles.body2.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                            
                            SizedBox(height: AppSpacing.xl),
                            
                            // Message d'erreur
                            if (_errorMessage != null)
                              Padding(
                                padding: EdgeInsets.only(bottom: AppSpacing.md),
                                child: MessageBanner(
                                  message: _errorMessage!,
                                  isError: true,
                                  onDismiss: () {
                                    setState(() => _errorMessage = null);
                                  },
                                ),
                              ),
                            
                            // Message de succès
                            if (_successMessage != null)
                              Padding(
                                padding: EdgeInsets.only(bottom: AppSpacing.md),
                                child: MessageBanner(
                                  message: _successMessage!,
                                  isError: false,
                                ),
                              ),
                            
                            // Champ Email
                            CustomTextField(
                              controller: emailController,
                              label: 'Email',
                              hint: 'Entrez votre email',
                              prefixIcon: Icons.email_outlined,
                              keyboardType: TextInputType.emailAddress,
                              validator: Validators.email,
                            ),
                            
                            SizedBox(height: AppSpacing.lg),
                            
                            // Champ Mot de passe
                            CustomTextField(
                              controller: passwordController,
                              label: 'Mot de passe',
                              hint: 'Entrez votre mot de passe',
                              prefixIcon: Icons.lock_outlined,
                              isPassword: true,
                              validator: Validators.password,
                            ),
                            
                            SizedBox(height: AppSpacing.md),
                            
                            // Mot de passe oublié
                            Align(
                              alignment: Alignment.centerRight,
                              child: TextButton(
                                onPressed: () {
                                  // TODO: Implémenter la récupération de mot de passe
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('Fonctionnalité à venir'),
                                      backgroundColor: AppColors.info,
                                    ),
                                  );
                                },
                                child: Text(
                                  'Mot de passe oublié ?',
                                  style: AppTextStyles.body2.copyWith(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                            
                            SizedBox(height: AppSpacing.lg),
                            
                            // Bouton Login
                            PrimaryButton(
                              text: 'Login',
                              onPressed: _login,
                              isLoading: _isLoading,
                              icon: Icons.login,
                            ),
                            
                            SizedBox(height: AppSpacing.lg),
                            
                            // Lien vers Register
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Pas encore de compte ? ',
                                  style: AppTextStyles.body2,
                                ),
                                GestureDetector(
                                  onTap: _navigateToRegister,
                                  child: Text(
                                    'S\'inscrire',
                                    style: AppTextStyles.body2.copyWith(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  
                  SizedBox(height: AppSpacing.xl),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}