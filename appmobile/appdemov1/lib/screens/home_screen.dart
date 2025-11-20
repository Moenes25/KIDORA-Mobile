import 'package:flutter/material.dart';
import '../api/auth_service.dart';
import '../services/storage_service.dart';
import '../utils/constants.dart';
import '../widgets/custom_widgets.dart';
import 'login_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final AuthService _authService = AuthService();
  Map<String, String?> _userInfo = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserInfo();
  }

  void _loadUserInfo() async {
    final userInfo = await StorageService.getUserInfo();
    setState(() {
      _userInfo = userInfo;
      _isLoading = false;
    });
  }

  void _logout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Déconnexion'),
        content: Text('Voulez-vous vraiment vous déconnecter ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('Annuler'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: Text(
              'Déconnexion',
              style: TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await _authService.logout();
      
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => LoginScreen()),
        );
      }
    }
  }

  void _navigateToProfile() async {
    final token = await StorageService.getToken();
    if (token != null) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => ProfileScreen(token: token),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : SafeArea(
              child: SingleChildScrollView(
                physics: BouncingScrollPhysics(),
                child: Padding(
                  padding: EdgeInsets.all(AppSpacing.lg),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Bonjour,',
                                style: AppTextStyles.body1.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                '${_userInfo['firstName'] ?? 'Utilisateur'}',
                                style: AppTextStyles.h2.copyWith(
                                  fontSize: 26,
                                ),
                              ),
                            ],
                          ),
                          GestureDetector(
                            onTap: _navigateToProfile,
                            child: Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                gradient: AppGradients.primary,
                                shape: BoxShape.circle,
                                boxShadow: [AppShadows.card],
                              ),
                              child: Center(
                                child: Text(
                                  '${_userInfo['firstName']?[0] ?? 'U'}${_userInfo['lastName']?[0] ?? ''}',
                                  style: TextStyle(
                                    color: AppColors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      
                      SizedBox(height: AppSpacing.xl),
                      
                      // Carte de bienvenue
                      Container(
                        padding: EdgeInsets.all(AppSpacing.xl),
                        decoration: BoxDecoration(
                          gradient: AppGradients.primary,
                          borderRadius: BorderRadius.circular(AppRadius.lg),
                          boxShadow: [AppShadows.card],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: AppColors.white.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Icon(
                                    Icons.celebration,
                                    color: AppColors.white,
                                    size: 30,
                                  ),
                                ),
                                SizedBox(width: AppSpacing.md),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Bienvenue sur Kidora !',
                                        style: TextStyle(
                                          color: AppColors.white,
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      SizedBox(height: 4),
                                      Text(
                                        'Gérez facilement votre crèche',
                                        style: TextStyle(
                                          color: AppColors.white.withOpacity(0.9),
                                          fontSize: 14,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      
                      SizedBox(height: AppSpacing.xl),
                      
                      // Section Menu
                      Text(
                        'Menu Principal',
                        style: AppTextStyles.h3,
                      ),
                      
                      SizedBox(height: AppSpacing.md),
                      
                      // Grille de cartes
                      GridView.count(
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        mainAxisSpacing: AppSpacing.md,
                        crossAxisSpacing: AppSpacing.md,
                        children: [
                          _buildMenuCard(
                            icon: Icons.child_care,
                            title: 'Enfants',
                            color: AppColors.primary,
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Fonctionnalité à venir')),
                              );
                            },
                          ),
                          _buildMenuCard(
                            icon: Icons.school,
                            title: 'Éducation',
                            color: AppColors.secondary,
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Fonctionnalité à venir')),
                              );
                            },
                          ),
                          _buildMenuCard(
                            icon: Icons.calendar_today,
                            title: 'Planning',
                            color: AppColors.accent,
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Fonctionnalité à venir')),
                              );
                            },
                          ),
                          _buildMenuCard(
                            icon: Icons.payment,
                            title: 'Paiements',
                            color: AppColors.success,
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Fonctionnalité à venir')),
                              );
                            },
                          ),
                        ],
                      ),
                      
                      SizedBox(height: AppSpacing.xl),
                      
                      // Bouton déconnexion
                      PrimaryButton(
                        text: 'Déconnexion',
                        onPressed: _logout,
                        isOutlined: true,
                        icon: Icons.logout,
                      ),
                    ],
                  ),
                ),
              ),
            ),
    );
  }

  Widget _buildMenuCard({
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(AppSpacing.lg),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          boxShadow: [AppShadows.card],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Icon(
                icon,
                color: color,
                size: 32,
              ),
            ),
            SizedBox(height: AppSpacing.md),
            Text(
              title,
              style: AppTextStyles.body1.copyWith(
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}