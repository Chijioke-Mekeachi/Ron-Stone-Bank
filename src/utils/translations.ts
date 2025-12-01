// Multi-language translation system for Ron Stone Bank

export type Language = 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ar';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    
    // Hero Section
    'hero.title': 'Your Most Trusted Digital Banking Partner',
    'hero.subtitle': 'Experience fast, secure, and borderless banking built for the modern world.',
    'hero.cta.primary': 'Open Account',
    'hero.cta.secondary': 'Login',
    
    // Why Choose Section
    'why.title': 'Why Choose Ron Stone Bank?',
    'why.instant.title': 'Instant Global Transfers',
    'why.instant.desc': 'Send money across borders in seconds with competitive exchange rates.',
    'why.multi.title': 'Multi-Currency Accounts',
    'why.multi.desc': 'Hold and manage multiple currencies in one secure account.',
    'why.zero.title': 'Zero Hidden Fees',
    'why.zero.desc': 'Complete transparency with no surprise charges or hidden costs.',
    'why.support.title': '24/7 Support',
    'why.support.desc': 'Round-the-clock customer support in multiple languages.',
    
    // Services
    'services.title': 'Our Core Services',
    'services.banking.title': 'Digital Banking',
    'services.banking.desc': 'Modern banking experience with advanced security and instant access.',
    'services.wallet.title': 'Multi-Currency Wallet',
    'services.wallet.desc': 'Manage multiple currencies effortlessly with real-time conversion.',
    'services.transfers.title': 'Real-Time Transfers',
    'services.transfers.desc': 'Send and receive money instantly across 120+ countries.',
    'services.cards.title': 'Virtual & Physical Cards',
    'services.cards.desc': 'Premium debit cards for online and in-store purchases worldwide.',
    
    // Stats
    'stats.years': 'Years in Digital Banking',
    'stats.users': 'Active Users',
    'stats.countries': 'Supported Countries',
    'stats.support': 'Global Support',
    
    // Features
    'features.title': 'Premium Banking Features',
    'features.onboarding': 'Fast Onboarding',
    'features.mobile': 'Mobile App Control',
    'features.security': 'Smart Security',
    'features.international': 'International Accounts',
    
    // Footer
    'footer.about': 'About Ron Stone Bank',
    'footer.support': 'Support',
    'footer.legal': 'Legal',
    'footer.contact': 'Contact Us',
  },
  
  fr: {
    'nav.features': 'Fonctionnalités',
    'nav.services': 'Services',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    'nav.signup': 'S\'inscrire',
    
    'hero.title': 'Votre Partenaire Bancaire Numérique de Confiance',
    'hero.subtitle': 'Profitez d\'une banque rapide, sécurisée et sans frontières pour le monde moderne.',
    'hero.cta.primary': 'Ouvrir un Compte',
    'hero.cta.secondary': 'Connexion',
    
    'why.title': 'Pourquoi Choisir Ron Stone Bank?',
    'why.instant.title': 'Virements Internationaux Instantanés',
    'why.instant.desc': 'Envoyez de l\'argent à l\'étranger en quelques secondes avec des taux compétitifs.',
    'why.multi.title': 'Comptes Multi-Devises',
    'why.multi.desc': 'Détenez et gérez plusieurs devises dans un seul compte sécurisé.',
    'why.zero.title': 'Zéro Frais Cachés',
    'why.zero.desc': 'Transparence totale sans frais surprises ni coûts cachés.',
    'why.support.title': 'Support 24/7',
    'why.support.desc': 'Assistance client 24h/24 en plusieurs langues.',
    
    'services.title': 'Nos Services Principaux',
    'services.banking.title': 'Banque Numérique',
    'services.banking.desc': 'Expérience bancaire moderne avec sécurité avancée et accès instantané.',
    'services.wallet.title': 'Portefeuille Multi-Devises',
    'services.wallet.desc': 'Gérez plusieurs devises facilement avec conversion en temps réel.',
    'services.transfers.title': 'Virements en Temps Réel',
    'services.transfers.desc': 'Envoyez et recevez de l\'argent instantanément dans plus de 120 pays.',
    'services.cards.title': 'Cartes Virtuelles et Physiques',
    'services.cards.desc': 'Cartes de débit premium pour achats en ligne et en magasin.',
    
    'stats.years': 'Années en Banque Numérique',
    'stats.users': 'Utilisateurs Actifs',
    'stats.countries': 'Pays Soutenus',
    'stats.support': 'Support Global',
    
    'features.title': 'Fonctionnalités Bancaires Premium',
    'features.onboarding': 'Intégration Rapide',
    'features.mobile': 'Contrôle par App Mobile',
    'features.security': 'Sécurité Intelligente',
    'features.international': 'Comptes Internationaux',
    
    'footer.about': 'À propos de Ron Stone Bank',
    'footer.support': 'Assistance',
    'footer.legal': 'Légal',
    'footer.contact': 'Nous Contacter',
  },
  
  es: {
    'nav.features': 'Características',
    'nav.services': 'Servicios',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    
    'hero.title': 'Su Socio Bancario Digital de Mayor Confianza',
    'hero.subtitle': 'Experimente una banca rápida, segura y sin fronteras para el mundo moderno.',
    'hero.cta.primary': 'Abrir Cuenta',
    'hero.cta.secondary': 'Iniciar Sesión',
    
    'why.title': '¿Por Qué Elegir Ron Stone Bank?',
    'why.instant.title': 'Transferencias Globales Instantáneas',
    'why.instant.desc': 'Envíe dinero a través de fronteras en segundos con tasas competitivas.',
    'why.multi.title': 'Cuentas Multi-Moneda',
    'why.multi.desc': 'Mantenga y administre múltiples monedas en una cuenta segura.',
    'why.zero.title': 'Cero Tarifas Ocultas',
    'why.zero.desc': 'Transparencia completa sin cargos sorpresa ni costos ocultos.',
    'why.support.title': 'Soporte 24/7',
    'why.support.desc': 'Atención al cliente las 24 horas en múltiples idiomas.',
    
    'services.title': 'Nuestros Servicios Principales',
    'services.banking.title': 'Banca Digital',
    'services.banking.desc': 'Experiencia bancaria moderna con seguridad avanzada y acceso instantáneo.',
    'services.wallet.title': 'Billetera Multi-Moneda',
    'services.wallet.desc': 'Administre múltiples monedas fácilmente con conversión en tiempo real.',
    'services.transfers.title': 'Transferencias en Tiempo Real',
    'services.transfers.desc': 'Envíe y reciba dinero al instante en más de 120 países.',
    'services.cards.title': 'Tarjetas Virtuales y Físicas',
    'services.cards.desc': 'Tarjetas de débito premium para compras en línea y en tienda.',
    
    'stats.years': 'Años en Banca Digital',
    'stats.users': 'Usuarios Activos',
    'stats.countries': 'Países Soportados',
    'stats.support': 'Soporte Global',
    
    'features.title': 'Características Bancarias Premium',
    'features.onboarding': 'Incorporación Rápida',
    'features.mobile': 'Control por App Móvil',
    'features.security': 'Seguridad Inteligente',
    'features.international': 'Cuentas Internacionales',
    
    'footer.about': 'Acerca de Ron Stone Bank',
    'footer.support': 'Soporte',
    'footer.legal': 'Legal',
    'footer.contact': 'Contáctenos',
  },
  
  de: {
    'nav.features': 'Funktionen',
    'nav.services': 'Dienstleistungen',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.login': 'Anmelden',
    'nav.signup': 'Registrieren',
    
    'hero.title': 'Ihr Vertrauenswürdigster Digitaler Banking-Partner',
    'hero.subtitle': 'Erleben Sie schnelles, sicheres und grenzenloses Banking für die moderne Welt.',
    'hero.cta.primary': 'Konto Eröffnen',
    'hero.cta.secondary': 'Anmelden',
    
    'why.title': 'Warum Ron Stone Bank?',
    'why.instant.title': 'Sofortige Globale Überweisungen',
    'why.instant.desc': 'Senden Sie Geld grenzüberschreitend in Sekunden zu wettbewerbsfähigen Kursen.',
    'why.multi.title': 'Multi-Währungskonten',
    'why.multi.desc': 'Halten und verwalten Sie mehrere Währungen in einem sicheren Konto.',
    'why.zero.title': 'Keine Versteckten Gebühren',
    'why.zero.desc': 'Vollständige Transparenz ohne Überraschungsgebühren oder versteckte Kosten.',
    'why.support.title': '24/7 Support',
    'why.support.desc': 'Rund-um-die-Uhr Kundensupport in mehreren Sprachen.',
    
    'services.title': 'Unsere Hauptdienstleistungen',
    'services.banking.title': 'Digitales Banking',
    'services.banking.desc': 'Modernes Banking-Erlebnis mit fortschrittlicher Sicherheit und sofortigem Zugang.',
    'services.wallet.title': 'Multi-Währungs-Wallet',
    'services.wallet.desc': 'Verwalten Sie mehrere Währungen mühelos mit Echtzeit-Konvertierung.',
    'services.transfers.title': 'Echtzeit-Überweisungen',
    'services.transfers.desc': 'Senden und empfangen Sie Geld sofort in über 120 Ländern.',
    'services.cards.title': 'Virtuelle & Physische Karten',
    'services.cards.desc': 'Premium-Debitkarten für Online- und Ladengeschäfte weltweit.',
    
    'stats.years': 'Jahre im Digitalen Banking',
    'stats.users': 'Aktive Nutzer',
    'stats.countries': 'Unterstützte Länder',
    'stats.support': 'Globaler Support',
    
    'features.title': 'Premium Banking-Funktionen',
    'features.onboarding': 'Schnelles Onboarding',
    'features.mobile': 'Mobile App-Kontrolle',
    'features.security': 'Intelligente Sicherheit',
    'features.international': 'Internationale Konten',
    
    'footer.about': 'Über Ron Stone Bank',
    'footer.support': 'Unterstützung',
    'footer.legal': 'Rechtliches',
    'footer.contact': 'Kontaktieren Sie Uns',
  },
  
  zh: {
    'nav.features': '功能',
    'nav.services': '服务',
    'nav.about': '关于',
    'nav.contact': '联系',
    'nav.login': '登录',
    'nav.signup': '注册',
    
    'hero.title': '您最值得信赖的数字银行合作伙伴',
    'hero.subtitle': '体验为现代世界打造的快速、安全、无国界银行服务。',
    'hero.cta.primary': '开设账户',
    'hero.cta.secondary': '登录',
    
    'why.title': '为什么选择 Ron Stone 银行？',
    'why.instant.title': '即时全球转账',
    'why.instant.desc': '以具有竞争力的汇率在几秒钟内跨境汇款。',
    'why.multi.title': '多币种账户',
    'why.multi.desc': '在一个安全账户中持有和管理多种货币。',
    'why.zero.title': '零隐藏费用',
    'why.zero.desc': '完全透明，无意外费用或隐藏成本。',
    'why.support.title': '全天候支持',
    'why.support.desc': '提供多语言的 24 小时客户支持。',
    
    'services.title': '我们的核心服务',
    'services.banking.title': '数字银行',
    'services.banking.desc': '现代银行体验，具有先进的安全性和即时访问。',
    'services.wallet.title': '多币种钱包',
    'services.wallet.desc': '通过实时转换轻松管理多种货币。',
    'services.transfers.title': '实时转账',
    'services.transfers.desc': '在 120 多个国家即时发送和接收资金。',
    'services.cards.title': '虚拟和实体卡',
    'services.cards.desc': '用于在线和实体店购物的高级借记卡。',
    
    'stats.years': '数字银行年限',
    'stats.users': '活跃用户',
    'stats.countries': '支持的国家',
    'stats.support': '全球支持',
    
    'features.title': '高级银行功能',
    'features.onboarding': '快速入门',
    'features.mobile': '移动应用控制',
    'features.security': '智能安全',
    'features.international': '国际账户',
    
    'footer.about': '关于 Ron Stone 银行',
    'footer.support': '支持',
    'footer.legal': '法律',
    'footer.contact': '联系我们',
  },
  
  ar: {
    'nav.features': 'المميزات',
    'nav.services': 'الخدمات',
    'nav.about': 'عن',
    'nav.contact': 'اتصل',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'سجل',
    
    'hero.title': 'شريكك المصرفي الرقمي الأكثر ثقة',
    'hero.subtitle': 'اختبر الخدمات المصرفية السريعة والآمنة وبلا حدود المصممة للعالم الحديث.',
    'hero.cta.primary': 'افتح حساب',
    'hero.cta.secondary': 'تسجيل الدخول',
    
    'why.title': 'لماذا تختار بنك رون ستون؟',
    'why.instant.title': 'تحويلات عالمية فورية',
    'why.instant.desc': 'أرسل الأموال عبر الحدود في ثوانٍ بأسعار صرف تنافسية.',
    'why.multi.title': 'حسابات متعددة العملات',
    'why.multi.desc': 'احتفظ وأدر عدة عملات في حساب آمن واحد.',
    'why.zero.title': 'صفر رسوم مخفية',
    'why.zero.desc': 'شفافية كاملة بدون رسوم مفاجئة أو تكاليف مخفية.',
    'why.support.title': 'دعم 24/7',
    'why.support.desc': 'دعم العملاء على مدار الساعة بعدة لغات.',
    
    'services.title': 'خدماتنا الأساسية',
    'services.banking.title': 'الخدمات المصرفية الرقمية',
    'services.banking.desc': 'تجربة مصرفية حديثة مع أمان متقدم ووصول فوري.',
    'services.wallet.title': 'محفظة متعددة العملات',
    'services.wallet.desc': 'إدارة عدة عملات بسهولة مع التحويل في الوقت الفعلي.',
    'services.transfers.title': 'تحويلات في الوقت الفعلي',
    'services.transfers.desc': 'إرسال واستقبال الأموال فورًا في أكثر من 120 دولة.',
    'services.cards.title': 'بطاقات افتراضية وفعلية',
    'services.cards.desc': 'بطاقات خصم مميزة للشراء عبر الإنترنت وفي المتاجر.',
    
    'stats.years': 'سنوات في الخدمات المصرفية الرقمية',
    'stats.users': 'مستخدمون نشطون',
    'stats.countries': 'دول مدعومة',
    'stats.support': 'دعم عالمي',
    
    'features.title': 'ميزات مصرفية متميزة',
    'features.onboarding': 'تأهيل سريع',
    'features.mobile': 'تحكم عبر التطبيق المحمول',
    'features.security': 'أمان ذكي',
    'features.international': 'حسابات دولية',
    
    'footer.about': 'عن بنك رون ستون',
    'footer.support': 'الدعم',
    'footer.legal': 'قانوني',
    'footer.contact': 'اتصل بنا',
  },
};

export const getTranslation = (key: string, language: Language = 'en'): string => {
  return translations[language][key] || translations['en'][key] || key;
};
