'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Award, CheckCircle, Code, ShieldCheck, ChevronRight, Sun, Moon, Globe, Terminal, ChevronDown, ChevronUp, Search, UserCheck, Play, ArrowRight, HelpCircle, Star, Compass, User } from 'lucide-react';
import { COURSES } from '@/lib/courseData';
import LofiStudyAnimation from '@/components/LofiStudyAnimation';

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isLogin, setIsLogin] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Interactive syllabus expansion state
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);

  // Dynamic reviews & stats state
  const [liveStats, setLiveStats] = useState({
    totalStudents: 1240,
    totalCourses: 6,
    totalCertificates: 310,
    successRate: 92
  });
  const [liveReviews, setLiveReviews] = useState<any[]>([]);

  // FAQ active indexes
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [coursesList, setCoursesList] = useState<any[]>(COURSES);
  const [signupRole, setSignupRole] = useState<'student' | 'instructor'>('student');

  // Load stats and reviews from DB
  const loadDynamicData = async () => {
    try {
      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setLiveStats(statsData.stats);
      }

      const reviewsRes = await fetch('/api/reviews');
      const reviewsData = await reviewsRes.json();
      if (reviewsData.success) {
        setLiveReviews(reviewsData.reviews);
      }

      const coursesRes = await fetch('/api/course/list');
      const coursesData = await coursesRes.json();
      if (coursesData.success) {
        setCoursesList(coursesData.courses);
      }
    } catch (e) {
      console.error('Error loading dynamic database info:', e);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    const savedLang = localStorage.getItem('lang') as 'fr' | 'en' | null;
    if (savedLang) setLang(savedLang);

    loadDynamicData();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleLang = () => {
    const newLang = lang === 'fr' ? 'en' : 'fr';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const getRecaptchaToken = async (actionName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const grecaptcha = (window as any).grecaptcha;
      if (!grecaptcha) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }
      grecaptcha.ready(async () => {
        try {
          const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeaJmctAAAAAKcF7djsU9XLxZVJ7Zp3tNn_7veU";
          const token = await grecaptcha.execute(siteKey, { action: actionName });
          resolve(token);
        } catch (err) {
          reject(err);
        }
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = await getRecaptchaToken(isLogin ? 'login' : 'register');
      
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const bodyPayload = isLogin
        ? { email, recaptchaToken: token, isAdminLogin: isAdmin, password }
        : { email, name, lang, recaptchaToken: token, role: signupRole };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentification échouée');
      }

      localStorage.setItem('student_user', JSON.stringify(data.user));
      setShowAuthModal(false);
      
      if (data.user.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = (courseId: string) => {
    const stored = localStorage.getItem('student_user');
    if (stored) {
      router.push('/dashboard');
    } else {
      setIsLogin(false);
      setShowAuthModal(true);
    }
  };

  const toggleCourseSyllabus = (courseId: string) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      setExpandedModuleId(null);
    } else {
      setExpandedCourseId(courseId);
    }
  };

  const toggleModule = (modId: number) => {
    setExpandedModuleId(expandedModuleId === modId ? null : modId);
  };

  const getCourseRatingInfo = (courseId: string) => {
    const courseReviews = liveReviews.filter((r) => r.courseId === courseId);
    if (courseReviews.length === 0) {
      return { avg: 5, count: 0 };
    }
    const sum = courseReviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      avg: Math.round((sum / courseReviews.length) * 10) / 10,
      count: courseReviews.length
    };
  };

  // Filter logic
  const filteredCourses = coursesList.filter((course) => {
    const matchesSearch = 
      course.titleFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.descriptionFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    const matchesDifficulty = selectedDifficulty === 'all' || 
      (selectedDifficulty === 'beginner' && (course.difficultyEn === 'Beginner' || course.difficultyFr === 'Débutant')) ||
      (selectedDifficulty === 'intermediate' && (course.difficultyEn === 'Intermediate' || course.difficultyFr === 'Intermédiaire')) ||
      (selectedDifficulty === 'advanced' && (course.difficultyEn === 'Advanced' || course.difficultyFr === 'Avancé'));

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = [
    { id: 'all', labelFr: 'Tous', labelEn: 'All' },
    { id: 'algo', labelFr: 'Algorithmes', labelEn: 'Algorithms' },
    { id: 'front', labelFr: 'Front-End', labelEn: 'Front-End' },
    { id: 'back', labelFr: 'Back-End', labelEn: 'Back-End' },
    { id: 'web', labelFr: 'Web Classique', labelEn: 'Classic Web' },
    { id: 'oop', labelFr: 'Java POO', labelEn: 'Java OOP' },
    { id: 'python', labelFr: 'Python', labelEn: 'Python' },
  ];

  const faqs = [
    {
      qFr: "Comment fonctionne la certification unique ?",
      qEn: "How does the single-attempt certification work?",
      aFr: "Pour chaque formation, vous avez accès à des leçons et des exercices pratiques. L'examen final ne peut être tenté qu'une seule fois. Si vous obtenez 70% ou plus, votre certificat est généré.",
      aEn: "For each program, you have lessons and exercises. The final exam can only be taken once. If you score 70% or higher, your official certificate is unlocked."
    },
    {
      qFr: "Est-ce gratuit ?",
      qEn: "Is it free?",
      aFr: "Oui, lickrotechLearn est un outil éducatif de Lickrotechnologie pour encourager l'apprentissage des sciences de l'informatique.",
      aEn: "Yes, lickrotechLearn is an educational platform by Lickrotechnologie to foster computer science engineering learning."
    },
    {
      qFr: "Puis-je exporter mes certificats ?",
      qEn: "Can I export my certificates?",
      aFr: "Absolument. Une fois réussi, le certificat s'affiche dans un format officiel optimisé pour l'impression (A4) ou l'export PDF/LinkedIn.",
      aEn: "Absolutely. Once passed, the certificate is rendered in an official A4 layout ready to print or export to PDF and share on LinkedIn."
    }
  ];

  const t = {
    fr: {
      catalogTitle: "Programmes Académiques",
      catalogSub: "Des formations ciblées avec sandbox de validation et examens officiels.",
      heroTitle: "L'excellence des compétences systèmes et web.",
      heroSub: "Explorez nos spécialisations interactives conçues par Tene Bana Maxym. Du pseudo-code aux composants Next.js, apprenez avec rigueur.",
      badge: "LICKROTECHNOLOGIE ACADEMY",
      authTitleLogin: "Se connecter",
      authTitleReg: "Rejoindre la formation",
      emailPl: "Adresse email académique",
      namePl: "Nom complet",
      adminLoginCheck: "Accès Enseignant/Admin",
      adminPassPl: "Code de sécurité admin",
      authBtn: "Entrer dans l'espace",
      authSubReg: "Nouveau candidat ? S'inscrire",
      authSubLogin: "Déjà candidat ? Se connecter",
      authorSection: "À propos de la plateforme",
      authorText: "LickrotechLearn réunit les technologies exigées dans l'industrie pour former des ingénieurs opérationnels immédiatement.",
      enrollBtn: "S'inscrire et démarrer",
      difficulty: "Difficulté",
      author: "Superviseur",
      viewSyllabus: "Afficher le Syllabus",
      hideSyllabus: "Refermer le Syllabus",
      syllabusOverview: "Contenu académique",
      searchPl: "Rechercher une formation, un langage...",
      diffAll: "Difficultés",
      diffBeg: "Débutant",
      diffInt: "Intermédiaire",
      diffAdv: "Avancé",
      statsStudents: "Candidats",
      statsCourses: "Programmes",
      statsCertifs: "Certificats",
      statsRate: "Réussite",
      faqTitle: "Foire Aux Questions",
      reviewsTitle: "Avis Réels de nos Candidats",
      noReviews: "Aucun avis publié pour le moment. Soyez le premier !",
      footer: "© 2026 Lickrotechnologie - lickrotechLearn. Tous droits réservés."
    },
    en: {
      catalogTitle: "Academic Catalog",
      catalogSub: "Targeted programs featuring code compilers and single-attempt exams.",
      heroTitle: "Bridge the gap between logic and real systems.",
      heroSub: "Explore interactive specializations designed by Tene Bana Maxym. From pseudo-code diagrams to Next.js APIs, master it all.",
      badge: "LICKROTECHNOLOGIE ACADEMY",
      authTitleLogin: "Student Login",
      authTitleReg: "Apply for Course",
      emailPl: "Academic email address",
      namePl: "Full name",
      adminLoginCheck: "Supervisor/Admin Login",
      adminPassPl: "Admin security password",
      authBtn: "Enter Dashboard",
      authSubReg: "New applicant? Register here",
      authSubLogin: "Registered candidate? Sign In",
      authorSection: "About the platform",
      authorText: "LickrotechLearn bundles the exact technology stacks demanded in production to train software engineers.",
      enrollBtn: "Enroll and Start",
      difficulty: "Difficulty",
      author: "Supervisor",
      viewSyllabus: "Explore syllabus",
      hideSyllabus: "Close syllabus",
      syllabusOverview: "Syllabus details",
      searchPl: "Search courses, tags, technologies...",
      diffAll: "All difficulties",
      diffBeg: "Beginner",
      diffInt: "Intermediate",
      diffAdv: "Advanced",
      statsStudents: "Students",
      statsCourses: "Courses",
      statsCertifs: "Certificates",
      statsRate: "Success rate",
      faqTitle: "Frequently Asked Questions",
      reviewsTitle: "Live Candidate Reviews",
      noReviews: "No reviews published yet. Be the first!",
      footer: "© 2026 Lickrotechnologie - lickrotechLearn. All rights reserved."
    }
  }[lang];

  return (
    <div className="flex-1 flex flex-col min-h-screen mobile-page-container">
      {/* Mesh Background */}
      <div className="grid-bg"></div>

      {/* Navigation Header (Hidden on Mobile view for native feel) */}
      <header className="sticky top-0 z-40 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between md:flex hidden">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Lickrotech Logo" className="w-8 h-8 object-contain" />
          <div>
            <span className="font-extrabold tracking-tight text-lg">lickrotech</span>
            <span className="text-blue-500 font-semibold text-sm ml-1">Learn</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => { setIsLogin(true); setShowAuthModal(true); }} className="text-sm font-semibold hover:text-blue-500 transition-colors">
            {lang === 'fr' ? 'Se Connecter' : 'Sign In'}
          </button>
          
          <button onClick={toggleLang} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors flex items-center gap-1 text-sm font-medium">
            <Globe className="w-4 h-4 text-blue-500" />
            {lang.toUpperCase()}
          </button>

          <button onClick={toggleTheme} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors">
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-12">
        
        {/* Mobile Header (App style) */}
        <div className="md:hidden flex items-center justify-between py-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Lickrotech Logo" className="w-7 h-7 object-contain" />
            <span className="font-extrabold tracking-tight text-base">lickrotech<span className="text-blue-500 ml-0.5">Learn</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="text-xs font-bold px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded">
              {lang.toUpperCase()}
            </button>
            <button onClick={toggleTheme} className="p-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded">
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
          <div className="md:col-span-7 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-extrabold tracking-wider uppercase">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              {t.badge}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              {t.heroSub}
            </p>
          </div>
          <div className="md:col-span-5 flex justify-center">
            <LofiStudyAnimation />
          </div>
        </section>

        {/* Dynamic Database Statistics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 glass-panel border-[var(--border)] bg-[var(--glass-bg)] text-center">
          <div>
            <p className="text-2xl font-extrabold text-blue-500">{liveStats.totalStudents}</p>
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase mt-0.5">{t.statsStudents}</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-emerald-500">{liveStats.totalCourses}</p>
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase mt-0.5">{t.statsCourses}</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-indigo-500">{liveStats.totalCertificates}</p>
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase mt-0.5">{t.statsCertifs}</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-amber-500">{liveStats.successRate}%</p>
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase mt-0.5">{t.statsRate}</p>
          </div>
        </section>

        {/* Catalog Search & Filtering */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-2.5">
            <h2 className="text-lg font-bold uppercase tracking-wider">{t.catalogTitle}</h2>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="premium-input py-1.5 px-3 text-[10px] font-bold"
            >
              <option value="all">{lang === 'fr' ? 'Difficultés' : 'Difficulty'}</option>
              <option value="beginner">{t.diffBeg}</option>
              <option value="intermediate">{t.diffInt}</option>
              <option value="advanced">{t.diffAdv}</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPl}
                className="w-full pl-10 pr-3 py-2.5 premium-input text-xs"
              />
            </div>

            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]'
                  }`}
                >
                  {lang === 'fr' ? cat.labelFr : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog grid */}
          <div className="space-y-4">
            {filteredCourses.map((course) => {
              const isSyllabusOpen = expandedCourseId === course.id;

              return (
                <div key={course.id} className="glass-panel overflow-hidden border-[var(--border)]">
                  <div className="flex flex-col md:flex-row md:items-stretch">
                    <div className="md:w-1/3 h-36 md:h-auto relative overflow-hidden">
                      <img src={course.imageUrl} alt={course.titleFr} className="w-full h-full object-cover" />
                    </div>
                    <div className="md:w-2/3 p-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-bold uppercase">
                          <span>{lang === 'fr' ? course.difficultyFr : course.difficultyEn}</span>
                          <span>{course.author}</span>
                        </div>
                        <h3 className="text-base font-bold text-blue-400">
                          {lang === 'fr' ? course.titleFr : course.titleEn}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => {
                              const ratingInfo = getCourseRatingInfo(course.id);
                              return (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.round(ratingInfo.avg) ? 'fill-current' : 'text-slate-600'
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <span className="text-[9px] text-[var(--text-muted)] font-bold">
                            {getCourseRatingInfo(course.id).avg} ({getCourseRatingInfo(course.id).count} {lang === 'fr' ? 'avis' : 'reviews'})
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-3">
                          {lang === 'fr' ? course.descriptionFr : course.descriptionEn}
                        </p>
                      </div>

                      <div className="border-t border-[var(--border)] pt-3.5 flex items-center justify-between gap-4">
                        <button
                          onClick={() => toggleCourseSyllabus(course.id)}
                          className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          {isSyllabusOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          {isSyllabusOpen ? t.hideSyllabus : t.viewSyllabus}
                        </button>

                        <button
                          onClick={() => handleEnrollClick(course.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all"
                        >
                          {t.enrollBtn}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Syllabus explorer drawer */}
                  {isSyllabusOpen && (
                    <div className="bg-[var(--bg-secondary)] border-t border-[var(--border)] p-4 space-y-4">
                      <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest border-b border-[var(--border)] pb-1.5">
                        {t.syllabusOverview}
                      </h4>
                      <div className="space-y-3.5">
                        {course.modules.map((mod: any) => {
                          const isModuleOpen = expandedModuleId === mod.id;
                          return (
                            <div key={mod.id} className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-primary)] text-xs">
                              <button
                                onClick={() => toggleModule(mod.id)}
                                className="w-full p-3 flex items-center justify-between font-bold"
                              >
                                <span>{mod.id}. {lang === 'fr' ? mod.titleFr : mod.titleEn}</span>
                                {isModuleOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                              {isModuleOpen && (
                                <div className="p-3 bg-[var(--bg-secondary)]/50 border-t border-[var(--border)] divide-y divide-[var(--border)]">
                                  {mod.lessons.map((les: any) => (
                                    <div key={les.id} className="py-2.5 flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                                      <span>{lang === 'fr' ? les.titleFr : les.titleEn}</span>
                                      <span className="text-[var(--text-muted)]">{les.duration}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Dynamic Reviews Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-center uppercase tracking-wider">{t.reviewsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveReviews.map((rev, idx) => (
              <div key={idx} className="p-5 glass-panel border-[var(--border)] flex flex-col justify-between text-xs">
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="pt-3 border-t border-[var(--border)] mt-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">{rev.name}</h4>
                    <p className="text-[9px] text-[var(--text-muted)] mt-0.5">
                      {rev.courseId === 'algo-101' ? 'Algorithmique' : 'Développeur Web'}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-amber-400 fill-current' : 'text-slate-600'}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {liveReviews.length === 0 && (
              <p className="text-xs text-center text-[var(--text-muted)] col-span-2 py-4">
                {t.noReviews}
              </p>
            )}
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-center uppercase tracking-wider">{t.faqTitle}</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const active = activeFaq === idx;
              return (
                <div key={idx} className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-secondary)]/50 text-xs">
                  <button
                    onClick={() => setActiveFaq(active ? null : idx)}
                    className="w-full p-4 flex items-center justify-between font-bold"
                  >
                    <span>{lang === 'fr' ? faq.qFr : faq.qEn}</span>
                    {active ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {active && (
                    <div className="p-4 border-t border-[var(--border)] text-[11px] text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-primary)]">
                      {lang === 'fr' ? faq.aFr : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 w-full max-w-sm space-y-5 relative bg-[var(--bg-secondary)] border-slate-700/60 shadow-2xl">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white text-lg font-bold transition-colors"
            >
              ✕
            </button>

            <div className="space-y-1.5 text-center">
              <h2 className="text-xl font-bold">{isLogin ? t.authTitleLogin : t.authTitleReg}</h2>
              <p className="text-[10px] text-[var(--text-muted)]">
                {isLogin ? "Saisissez vos identifiants d'accès" : "Rejoignez le programme dès aujourd'hui"}
              </p>
            </div>

            {error && (
              <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-bold mb-1 text-[var(--text-secondary)] uppercase tracking-wider">{t.namePl}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full premium-input text-xs"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold mb-1 text-[var(--text-secondary)] uppercase tracking-wider">{t.emailPl}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full premium-input text-xs"
                  placeholder="name@university.com"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-bold mb-1 text-[var(--text-secondary)] uppercase tracking-wider">Statut / Role</label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as 'student' | 'instructor')}
                    className="w-full premium-input text-xs"
                  >
                    <option value="student">{lang === 'fr' ? 'Apprenant / Étudiant' : 'Student / Learner'}</option>
                    <option value="instructor">{lang === 'fr' ? 'Instructeur / Enseignant' : 'Instructor / Teacher'}</option>
                  </select>
                </div>
              )}

              {isLogin && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      className="rounded border-slate-700 text-blue-600 bg-slate-900 focus:ring-blue-500"
                    />
                    <label htmlFor="isAdmin" className="text-[10px] font-bold text-[var(--text-secondary)] cursor-pointer">
                      {t.adminLoginCheck}
                    </label>
                  </div>

                  {isAdmin && (
                    <div>
                      <label className="block text-[10px] font-bold mb-1 text-[var(--text-secondary)] uppercase tracking-wider">{t.adminPassPl}</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full premium-input text-xs"
                        placeholder="••••••••"
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                {loading ? "Vérification..." : t.authBtn}
              </button>
            </form>

            <div className="text-center pt-1.5">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-[10px] font-bold text-blue-400 hover:underline"
              >
                {isLogin ? t.authSubReg : t.authSubLogin}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed bottom navigation bar for mobile webapp feel */}
      <div className="mobile-nav-bar">
        <button onClick={() => router.push('/')} className="flex flex-col items-center gap-0.5 text-blue-500">
          <Compass className="w-5 h-5" />
          <span className="text-[9px] font-bold">Explorer</span>
        </button>
        <button onClick={() => { setIsLogin(true); setShowAuthModal(true); }} className="flex flex-col items-center gap-0.5 text-[var(--text-muted)] hover:text-blue-500">
          <User className="w-5 h-5" />
          <span className="text-[9px] font-bold">Connexion</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-[10px] text-[var(--text-muted)] border-t border-[var(--border)] mb-12 md:mb-0">
        {t.footer}
      </footer>
    </div>
  );
}
