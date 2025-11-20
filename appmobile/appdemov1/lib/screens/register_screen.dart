import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../api/auth_service.dart';
import '../utils/constants.dart';
import '../widgets/custom_widgets.dart';
import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final firstnameController = TextEditingController();
  final lastnameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  
  final AuthService _authService = AuthService();
  
  bool _isLoading = false;
  String? _errorMessage;
  String? _successMessage;
  bool _acceptTerms = false;

  @override
  void dispose() {
    firstnameController.dispose();
    lastnameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  String? _validateConfirmPassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Veuillez confirmer votre mot de passe';
    }
    if (value != passwordController.text) {
      return 'Les mots de passe ne correspondent pas';
    }
    return null;
  }

  void _register() async {
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

    // Vérifier les conditions
    if (!_acceptTerms) {
      setState(() {
        _errorMessage = 'Veuillez accepter les conditions d\'utilisation';
      });
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await _authService.register(
        firstname: firstnameController.text.trim(),
        lastname: lastnameController.text.trim(),
        email: emailController.text.trim(),
        password: passwordController.text,
      );

      setState(() => _isLoading = false);

      if (response.success) {
        // Succès
        setState(() => _successMessage = response.message);
        
        // Attendre un peu puis naviguer vers login
        await Future.delayed(Duration(seconds: 2));
        
        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => LoginScreen()),
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

  void _navigateToLogin() {
    Navigator.of(context).pop();
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
                  SizedBox(height: AppSpacing.lg),
                  
                  // Bouton retour
                  Row(
                    children: [
                      IconButton(
                        onPressed: _navigateToLogin,
                        icon: Icon(
                          Icons.arrow_back_ios,
                          color: AppColors.white,
                        ),
                      ),
                    ],
                  ),
                  
                  // Logo
                  FadeInDown(
                    duration: Duration(milliseconds: 600),
                    child: KidoraLogo(
                      size: 80,
                      showText: true,
                    ),
                  ),
                  
                  SizedBox(height: AppSpacing.lg),
                  
                  // Carte de formulaire
                  FadeInUp(
                    delay: Duration(milliseconds: 200),
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
                              'S\'inscrire',
                              style: AppTextStyles.h2.copyWith(
                                color: AppColors.primary,
                                fontSize: 28,
                              ),
                            ),
                            
                            SizedBox(height: AppSpacing.sm),
                            
                            Text(
                              'Créez votre compte Kidora',
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
                            
                            // Champ Prénom
                            CustomTextField(
                              controller: firstnameController,
                              label: 'Prénom',
                              hint: 'Entrez votre prénom',
                              prefixIcon: Icons.person_outline,
                              validator: Validators.name,
                            ),
                            
                            SizedBox(height: AppSpacing.md),
                            
                            // Champ Nom
                            CustomTextField(
                              controller: lastnameController,
                              label: 'Nom',
                              hint: 'Entrez votre nom',
                              prefixIcon: Icons.person_outline,
                              validator: Validators.name,
                            ),
                            
                            SizedBox(height: AppSpacing.md),
                            
                            // Champ Email
                            CustomTextField(
                              controller: emailController,
                              label: 'Email',
                              hint: 'Entrez votre email',
                              prefixIcon: Icons.email_outlined,
                              keyboardType: TextInputType.emailAddress,
                              validator: Validators.email,
                            ),
                            
                            SizedBox(height: AppSpacing.md),
                            
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
                            
                            // Champ Confirmation mot de passe
                            CustomTextField(
                              controller: confirmPasswordController,
                              label: 'Confirmer le mot de passe',
                              hint: 'Confirmez votre mot de passe',
                              prefixIcon: Icons.lock_outlined,
                              isPassword: true,
                              validator: _validateConfirmPassword,
                            ),
                            
                            SizedBox(height: AppSpacing.lg),
                            
                            // Checkbox Conditions
                            Row(
                              children: [
                                Checkbox(
                                  value: _acceptTerms,
                                  onChanged: (value) {
                                    setState(() => _acceptTerms = value ?? false);
                                  },
                                  activeColor: AppColors.primary,
                                ),
                                Expanded(
                                  child: GestureDetector(
                                    onTap: () {
                                      setState(() => _acceptTerms = !_acceptTerms);
                                    },
                                    child: RichText(
                                      text: TextSpan(
                                        style: AppTextStyles.body2,
                                        children: [
                                          TextSpan(text: 'J\'accepte les '),
                                          TextSpan(
                                            text: 'conditions d\'utilisation',
                                            style: TextStyle(
                                              color: AppColors.primary,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            
                            SizedBox(height: AppSpacing.lg),
                            
                            // Bouton Register
                            PrimaryButton(
                              text: 'S\'inscrire',
                              onPressed: _register,
                              isLoading: _isLoading,
                              icon: Icons.person_add,
                            ),
                            
                            SizedBox(height: AppSpacing.lg),
                            
                            // Lien vers Login
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Vous avez déjà un compte ? ',
                                  style: AppTextStyles.body2,
                                ),
                                GestureDetector(
                                  onTap: _navigateToLogin,
                                  child: Text(
                                    'Se connecter',
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