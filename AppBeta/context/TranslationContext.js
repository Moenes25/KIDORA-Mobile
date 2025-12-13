// context/TranslationContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TranslationContext = createContext();

// Translation dictionaries
const translations = {
  en: {
    // Home Screen
    greeting: 'Hi',
    attendance: 'Attendance',
    completed: 'Completed',
    performance: 'Performance',
    incomplete: 'Incomplete',
    childrenDetails: 'Children Details',
    age: 'Age',
    grade: 'Grade',
    present: 'Present',
    absent: 'Absent',
    tasks: 'Tasks',
    
    // Calendar
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    
    // Profile Screen
    account: 'ACCOUNT',
    editProfile: 'Edit Profile',
    changePassword: 'Change Password',
    payments: 'Payments',
    support: 'SUPPORT',
    helpSupport: 'Help & Support',
    privacyPolicy: 'Privacy Policy',
    logout: 'Logout',
    version: 'Version',
    
    // Logout Alert
    logoutTitle: 'Logout',
    logoutMessage: 'Are you sure you want to log out?',
    cancel: 'Cancel',
    yes: 'Yes',
    
    // Password Modal
    changePasswordTitle: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    confirm: 'Confirm',

    // Side Bar
    home: 'Home',
    calendar: 'Calendar',
    map : "Map",
    gallery : "Gallery",
    settings : "Settings",
    usernameDefault : "User Name",
    shortcuts : "Shortcuts",
    recommend: "Recommend",
    helpNotReady : "The Help & Support interface is currently under development. Please check back later.",
    
    //ChildrenListScreen
    myChildren: "My Children",


    // Child Detail Screen
    sad: 'Sad',
    happy:"Happy",
    neutral:"Neutral",
    dailyAttendance: 'Daily Attendance',
    thisWeek: 'This week',
    outOf: 'out of',
    days: 'days',
    todaysActivities: "Today's Activities",
    todaysTasks: "Today's Tasks",
    skillsDevelopment: 'Skills Development',
    language: 'Language',
    motor: 'Motor',
    cognition: 'Cognition',
    social: 'Social',
    checkChildImprovements: 'Check Child Improvements',
    mealsToday: 'Meals Today',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    snacks: 'Snacks',
    healthInformation: 'Health Information',
    allergies: 'Allergies',
    medicalNotes: 'Medical Notes',
    educatorsComment: "Educator's Comment",
    educator: 'Educator',
    notAssigned: 'Not assigned',
    
    // Invoice Screen
    invoiceDetails: 'Invoice details',
    invoiceInformation: 'Invoice Information',
    reference: 'Reference',
    status: 'Status',
    unpaid: 'Unpaid',
    paid: 'Paid',
    issueDate: 'Issue Date',
    dueDate: 'Due Date',
    chargesBreakdown: 'Charges Breakdown',
    monthlyFrames: 'Monthly Frames',
    transport: 'Transport',
    canteen: 'Canteen',
    activitiesExtras: 'Extra Activities ',
    totalAmount: 'Total Amount',
    pay: 'Pay',
    paymentDate: 'Payment Date',
    paymentMethod: 'Payment Method',
    TND: 'TND',

    // Payment Method Screen
    choosePaymentMethod: 'Choose payment method',
    creditDebitCard: 'Credit & Debit Card',
    primary: 'Primary',
    addNewCard: 'Add new card',
    orPayWith: 'Or pay with',
    d17Description: 'Mobile payment Tunisian Post Office',
    flouciDescription: 'Digital wallet',
    payoneerDescription: 'International payment',

    // D17 Payment Screen
    payWithD17: 'Pay with D17',
    d17ServiceDescription: 'Mobile payment service by La Poste Tunisienne',
    amountToPay: 'Amount to pay',
    d17NumberMobile: 'D17 Number (Mobile)',
    enterPhoneNumber: 'Enter your phone number associated with your D17 account',
    securedByLaPoste: 'Secured by La Poste',
    encryption256: '256-bit encryption',
    processingInProgress: 'Processing in progress...',
    cancel: 'Cancel',
    invalidNumber: 'Invalid number',
    enterValidD17: 'Please enter a valid D17 number (8 digits)',
    error: 'Error',
    invalidAmount: 'Invalid amount',
    paymentInProgress: 'Payment in progress',
    confirmationCodeSent: 'A confirmation code has been sent to',
    enterReceivedCode: 'Please enter the code received by SMS.',
    failed: 'Failed',
    unableToInitiateD17: 'Unable to initiate D17 payment',
    connectionError: 'Connection error',
    checkInternetConnection: 'Check your internet connection',
    officialPaymentService: 'Official mobile payment service',

     // Add Card Screen
    addNewCard: 'Add new card',
    cardType: 'Card Type',
    visa: 'Visa',
    mastercard: 'Mastercard',
    cardNumber: 'Card Number',
    enterCardNumber: 'Enter card number',
    cardHolderName: 'Card Holder Name',
    enterCardHolderName: 'Enter card holder name',
    expireDate: 'Expire Date',
    address: 'Address',
    streetCityZip: 'Street, City, ZIP',
    add: 'Add',
    
    // Improvements Screen
    childDevelopment: 'Child Development',

    // Edit Profile Screen
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    occupation: 'Occupation',
    enterFullName: 'Enter full name',
    enterEmail: 'Enter email',
    enterPhone: 'Enter phone number',
    enterAddress: 'Enter address',
    enterOccupation: 'Enter occupation',
    saveChanges: 'Save Changes',

  },
  
  fr: {
    // Home Screen
    greeting: 'Salut',
    attendance: 'Présence',
    completed: 'Accompli',
    performance: 'Performance',
    incomplete: 'Incomplet',
    childrenDetails: 'Détails des Enfants',
    age: 'Âge',
    grade: 'Classe',
    present: 'Présent',
    absent: 'Absent',
    tasks: 'Tâches',
    
    // Calendar
    january: 'Janvier',
    february: 'Février',
    march: 'Mars',
    april: 'Avril',
    may: 'Mai',
    june: 'Juin',
    july: 'Juillet',
    august: 'Août',
    september: 'Septembre',
    october: 'Octobre',
    november: 'Novembre',
    december: 'Décembre',
    
    sun: 'Dim',
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mer',
    thu: 'Jeu',
    fri: 'Ven',
    sat: 'Sam',
    
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    
    // Profile Screen
    account: 'COMPTE',
    editProfile: 'Modifier le Profil',
    changePassword: 'Changer le Mot de Passe',
    payments: 'Paiements',
    support: 'SUPPORT',
    helpSupport: 'Aide & Support',
    privacyPolicy: 'Politique de Confidentialité',
    logout: 'Déconnexion',
    version: 'Version',
    
    // Logout Alert
    logoutTitle: 'Déconnexion',
    logoutMessage: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    cancel: 'Annuler',
    yes: 'Oui',
    
    // Password Modal
    changePasswordTitle: 'Changer le Mot de Passe',
    currentPassword: 'Mot de Passe Actuel',
    newPassword: 'Nouveau Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    confirm: 'Confirmer',

    // Side Bar
    home: 'Accueil',
    calendar: 'Calendrier',
    map : "Map",
    gallery : "Galerie",
    settings : "Paramètres",
    usernameDefault : "Nom d'utilisateur",
    shortcuts : "Raccourcis",
    recommend: "Recommander",
    helpNotReady : "L'interface Aide et assistance est actuellement en cours de développement. Veuillez revenir plus tard.",
    
    //ChildrenListScreen
    myChildren: "Mes Enfants",

    // Child Detail Screen
    sad: 'Triste',
    happy:"Heureux(se)",
    neutral:"Neutre",
    dailyAttendance: 'Présence Quotidienne',
    thisWeek: 'Cette semaine',
    outOf: 'sur',
    days: 'jours',
    todaysActivities: "Activités d'Aujourd'hui",
    todaysTasks: "Tâches d'Aujourd'hui",
    skillsDevelopment: 'Développement des Compétences',
    language: 'Langage',
    motor: 'Moteur',
    cognition: 'Cognition',
    social: 'Social',
    checkChildImprovements: "Vérifier les Progrès de l'Enfant",
    mealsToday: "Repas d'Aujourd'hui",
    breakfast: 'Petit-déjeuner',
    lunch: 'Déjeuner',
    snacks: 'Collations',
    healthInformation: 'Informations de Santé',
    allergies: 'Allergies',
    medicalNotes: 'Notes Médicales',
    educatorsComment: "Commentaire de l'Éducateur",
    educator: 'Éducateur',
    notAssigned: 'Non assigné',

    // Invoice Screen
    invoiceDetails: 'Détails de la facture',
    invoiceInformation: 'Informations de facturation',
    reference: 'Référence',
    status: 'Statut',
    unpaid: 'Non payée',
    paid: 'Payée',
    issueDate: "Date d'émission",
    dueDate: "Date d'échéance",
    chargesBreakdown: 'Détail des charges',
    monthlyFrames: 'Cadres mensuels',
    transport: 'Transport',
    canteen: 'Cantine',
    activitiesExtras: 'Activités supplémentaires',
    totalAmount: 'Montant total',
    pay: 'Payer',
    paymentDate: 'Date de paiement',
    paymentMethod: 'Méthode de paiement',
    TND: 'DT',

    // Payment Method Screen
    choosePaymentMethod: 'Choisir la méthode de paiement',
    creditDebitCard: 'Carte de crédit et de débit',
    primary: 'Principal',
    addNewCard: 'Ajouter une nouvelle carte',
    orPayWith: 'Ou payer avec',
    d17Description: 'Paiement mobile La Poste Tunisienne',
    flouciDescription: 'Portefeuille numérique',
    payoneerDescription: 'Paiement international',

    // D17 Payment Screen
    payWithD17: 'Payer avec D17',
    d17ServiceDescription: 'Service de paiement mobile de La Poste Tunisienne',
    amountToPay: 'Montant à payer',
    d17NumberMobile: 'Numéro D17 (Mobile)',
    enterPhoneNumber: 'Entrez votre numéro de téléphone associé à votre compte D17',
    securedByLaPoste: 'Sécurisé par La Poste',
    encryption256: 'Cryptage 256 bits',
    processingInProgress: 'Traitement en cours...',
    cancel: 'Annuler',
    invalidNumber: 'Numéro invalide',
    enterValidD17: 'Veuillez entrer un numéro D17 valide (8 chiffres)',
    error: 'Erreur',
    invalidAmount: 'Montant invalide',
    paymentInProgress: 'Paiement en cours',
    confirmationCodeSent: 'Un code de confirmation a été envoyé au',
    enterReceivedCode: 'Veuillez saisir le code reçu par SMS.',
    failed: 'Échec',
    unableToInitiateD17: "Impossible d'initier le paiement D17",
    connectionError: 'Erreur de connexion',
    checkInternetConnection: 'Vérifiez votre connexion internet',
    officialPaymentService: 'Service officiel de paiement mobile',

    // Add Card Screen
    addNewCard: 'Ajouter une nouvelle carte',
    cardType: 'Type de carte',
    visa: 'Visa',
    mastercard: 'Mastercard',
    cardNumber: 'Numéro de carte',
    enterCardNumber: 'Entrer le numéro de carte',
    cardHolderName: 'Nom du titulaire',
    enterCardHolderName: 'Entrer le nom du titulaire',
    expireDate: "Date d'expiration",
    address: 'Adresse',
    streetCityZip: 'Rue, Ville, Code postal',
    add: 'Ajouter',

    // Improvements Screen
    childDevelopment: "Développement de l'Enfant",

    fullName: 'Nom complet',
    email: 'Email',
    phone: 'Téléphone',
    occupation: 'Profession',
    enterFullName: 'Entrer le nom complet',
    enterEmail: 'Entrer l\'email',
    enterPhone: 'Entrer le téléphone',
    enterAddress: 'Entrer l\'adresse',
    enterOccupation: 'Entrer la profession',
    saveChanges: 'Enregistrer les modifications',

    
  },
  
  ar: {
    // Home Screen
    greeting: 'مرحبا',
    attendance: 'الحضور',
    completed: 'مكتمل',
    performance: 'الأداء',
    incomplete: 'غير مكتمل',
    childrenDetails: 'تفاصيل الأطفال',
    age: 'العمر',
    grade: 'الصف',
    present: 'حاضر',
    absent: 'غائب',
    tasks: 'المهام',
    
    // Calendar
    january: 'جانفي',
    february: 'فيفري',
    march: 'مارس',
    april: 'أفريل',
    may: 'ماي',
    june: 'جوان',
    july: 'جويلية',
    august: 'أوت',
    september: 'سبتمبر',
    october: 'أكتوبر',
    november: 'نوفمبر',
    december: 'ديسمبر',
    
    sun: 'الأحد',
    mon: 'الإثنين',
    tue: 'الثلاثاء',
    wed: 'الأربعاء',
    thu: 'الخميس',
    fri: 'الجمعة',
    sat: 'السبت',
    
    daily: 'يومي',
    weekly: 'أسبوعي',
    monthly: 'شهري',
    
    // Profile Screen
    account: 'الحساب',
    editProfile: 'تعديل الملف الشخصي',
    changePassword: 'تغيير كلمة المرور',
    payments: 'المدفوعات',
    support: 'الدعم',
    helpSupport: 'المساعدة والدعم',
    privacyPolicy: 'سياسة الخصوصية',
    logout: 'تسجيل الخروج',
    version: 'الإصدار',
    
    // Logout Alert
    logoutTitle: 'تسجيل الخروج',
    logoutMessage: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
    cancel: 'إلغاء',
    yes: 'نعم',
    
    // Password Modal
    changePasswordTitle: 'تغيير كلمة المرور',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    confirm: 'تأكيد',

     // Side Bar
    home: 'الصفحة الرئيسية',
    calendar: 'التقويم',
    map : "الخريطة",
    gallery : "الصور",
    settings : "الاعدادات",
    usernameDefault : "اسم المستخدم",
    shortcuts : "الاختصارات",
    recommend: "التوصية",
    helpNotReady : "واجهة المساعدة والدعم قيد التطوير حاليًا. يرجى العودة لاحقًا.",

    //ChildrenListScreen
    myChildren: "أطفالي",

    //ChildrenDetailsScreen
    sad: 'حزين',
    happy:"سعيد",
    neutral:"محايد",
    dailyAttendance: 'الحضور اليومي',
    thisWeek: 'هذا الأسبوع',
    outOf: 'من أصل',
    days: 'أيام',
    todaysActivities: 'أنشطة اليوم',
    todaysTasks: 'مهام اليوم',
    skillsDevelopment: 'تطوير المهارات',
    language: 'اللغة',
    motor: 'حركي',
    cognition: 'الإدراك',
    social: 'اجتماعي',
    checkChildImprovements: 'تحقق من تحسينات الطفل',
    mealsToday: 'وجبات اليوم',
    breakfast: 'الإفطار',
    lunch: 'الغداء',
    snacks: 'الوجبات الخفيفة',
    healthInformation: 'المعلومات الصحية',
    allergies: 'الحساسية',
    medicalNotes: 'ملاحظات طبية',
    educatorsComment: 'تعليق المعلم',
    educator: 'المعلم',
    notAssigned: 'غير معين',

    // Invoice Screen
    invoiceDetails: 'تفاصيل الفاتورة',
    invoiceInformation: 'معلومات الفاتورة',
    reference: 'المرجع',
    status: 'الحالة',
    unpaid: 'غير مدفوعة',
    paid: 'مدفوعة',
    issueDate: 'تاريخ الإصدار',
    dueDate: 'تاريخ الاستحقاق',
    chargesBreakdown: 'تفصيل الرسوم',
    monthlyFrames: 'الإطارات الشهرية',
    transport: 'النقل',
    canteen: 'كافيتريا',
    activitiesExtras: 'الأنشطة الإضافية',
    totalAmount: 'المبلغ الإجمالي',
    pay: 'دفع',
    paymentDate: 'تاريخ الدفع',
    paymentMethod: 'طريقة الدفع',
    TND: 'دينار تونسي',

    // Payment Method Screen
    choosePaymentMethod: 'اختر طريقة الدفع',
    creditDebitCard: 'بطاقة ائتمان وخصم',
    primary: 'أساسي',
    addNewCard: 'إضافة بطاقة جديدة',
    orPayWith: 'أو ادفع باستخدام',
    d17Description: 'الدفع المحمول البريد التونسي',
    flouciDescription: 'محفظة رقمية',
    payoneerDescription: 'الدفع الدولي',

    // D17 Payment Screen
    payWithD17: 'الدفع عبر D17',
    d17ServiceDescription: 'خدمة الدفع المحمول من البريد التونسي',
    amountToPay: 'المبلغ المراد دفعه',
    d17NumberMobile: 'رقم D17 (الهاتف المحمول)',
    enterPhoneNumber: 'أدخل رقم هاتفك المرتبط بحساب D17 الخاص بك',
    securedByLaPoste: 'مؤمن من قبل البريد التونسي',
    encryption256: 'تشفير 256 بت',
    processingInProgress: 'جاري المعالجة...',
    cancel: 'إلغاء',
    invalidNumber: 'رقم غير صالح',
    enterValidD17: 'الرجاء إدخال رقم D17 صالح (8 أرقام)',
    error: 'خطأ',
    invalidAmount: 'مبلغ غير صالح',
    paymentInProgress: 'الدفع قيد التنفيذ',
    confirmationCodeSent: 'تم إرسال رمز التأكيد إلى',
    enterReceivedCode: 'يرجى إدخال الرمز المستلم عبر الرسائل القصيرة.',
    failed: 'فشل',
    unableToInitiateD17: 'تعذر بدء الدفع عبر D17',
    connectionError: 'خطأ في الاتصال',
    checkInternetConnection: 'تحقق من اتصالك بالإنترنت',
    officialPaymentService: 'خدمة الدفع المحمول الرسمية',

    // Add Card Screen
    addNewCard: 'إضافة بطاقة جديدة',
    cardType: 'نوع البطاقة',
    visa: 'فيزا',
    mastercard: 'ماستركارد',
    cardNumber: 'رقم البطاقة',
    enterCardNumber: 'أدخل رقم البطاقة',
    cardHolderName: 'اسم حامل البطاقة',
    enterCardHolderName: 'أدخل اسم حامل البطاقة',
    expireDate: 'تاريخ الانتهاء',
    address: 'العنوان',
    streetCityZip: 'الشارع، المدينة، الرمز البريدي',
    add: 'إضافة',

    // Improvements Screen
    childDevelopment: 'تطور الطفل',

    // Edit Profile Screen
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    occupation: 'المهنة',
    enterFullName: 'أدخل الاسم الكامل',
    enterEmail: 'أدخل البريد الإلكتروني',
    enterPhone: 'أدخل رقم الهاتف',
    enterAddress: 'أدخل العنوان',
    enterOccupation: 'أدخل المهنة',
    saveChanges: 'حفظ التغييرات',

  },
};

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('appLanguage');
      if (savedLanguage) {
        setLanguage(savedLanguage);
        setIsRTL(savedLanguage === 'ar');
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      await AsyncStorage.setItem('appLanguage', newLanguage);
      setLanguage(newLanguage);
      setIsRTL(newLanguage === 'ar');
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const getMonthName = (monthIndex) => {
    const monthKeys = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    return t(monthKeys[monthIndex]);
  };

  const getDayName = (dayIndex) => {
    const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return t(dayKeys[dayIndex]);
  };

  return (
    <TranslationContext.Provider 
      value={{ 
        language, 
        changeLanguage, 
        t, 
        isRTL,
        getMonthName,
        getDayName 
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};