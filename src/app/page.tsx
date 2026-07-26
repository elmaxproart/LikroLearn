'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Award, CheckCircle, Code, ShieldCheck, ChevronRight, Sun, Moon, Globe, Terminal, Search } from 'lucide-react';
import { COURSES } from '@/lib/courseData';

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isLogin, setIsLogin] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync theme with document element
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    const savedLang = localStorage.getItem('lang') as 'fr' | 'en' | null;
    if (savedLang) setLang(savedLang);
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

  // Helper to trigger reCAPTCHA v3 token
  const getRecaptchaToken = async (actionName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const grecaptcha = (window as any).grecaptcha;
      if (!grecaptcha) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }
      grecaptcha.ready(async () => {
        try {
          const token = await grecaptcha.execute('6LfIVQQtAAAAAFbeVPQ83R9Xiwzsvz35gfYH9k4j', { action: actionName });
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
        : { email, name, lang, recaptchaToken: token };

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

  const handleEnrollClick = (course: any) => {
    // Check if logged in
    const stored = localStorage.getItem('student_user');
    if (stored) {
      router.push('/dashboard');
    } else {
      setSelectedCourse(course);
      setShowAuthModal(true);
    }
  };

  // Dictionary for static content
  const t = {
    fr: {
      catalogTitle: "Découvrez notre catalogue de formations",
      catalogSub: "Des certifications de pointe conçues par des experts et propulsées par Lickrotechnologie.",
      heroTitle: "Apprenez les technologies de demain avec lickrotechLearn",
      heroSub: "Développez vos compétences sur Coursera-style. Cursus interactifs guidés, codage pratique en direct et certifications de valeur internationale.",
      badge: "Produit de Lickrotechnologie",
      modulesTitle: "Syllabus détaillé du programme",
      authTitleLogin: "Se connecter",
      authTitleReg: "S'inscrire",
      emailPl: "Adresse email académique",
      namePl: "Nom complet",
      adminLoginCheck: "Connexion en tant qu'administrateur",
      adminPassPl: "Mot de passe administrateur",
      authBtn: "Valider et Accéder",
      authSubReg: "Nouveau sur la plateforme ? S'inscrire",
      authSubLogin: "Déjà inscrit ? Se connecter",
      authorSection: "À propos des Auteurs",
      authorText: "Tene Bana Maxym est le créateur du programme d'algorithmique. Ingénieur principal chez Lickrotechnologie, il transmet sa rigueur logique.",
      enrollBtn: "S'inscrire au programme",
      difficulty: "Difficulté",
      author: "Auteur",
      footer: "© 2026 Lickrotechnologie - lickrotechLearn. Tous droits réservés."
    },
    en: {
      catalogTitle: "Explore Our Program Catalog",
      catalogSub: "State-of-the-art certifications designed by experts and powered by Lickrotechnologie.",
      heroTitle: "Learn Next-Gen Tech on lickrotechLearn",
      heroSub: "Build your skills Coursera-style. Fully interactive guided curriculums, live coding environments, and globally recognized certificates.",
      badge: "Product of Lickrotechnologie",
      modulesTitle: "Detailed Program Syllabus",
      authTitleLogin: "Sign In",
      authTitleReg: "Register",
      emailPl: "Academic email address",
      namePl: "Full name",
      adminLoginCheck: "Log in as administrator",
      adminPassPl: "Administrator password",
      authBtn: "Verify and Enter",
      authSubReg: "New here? Register a new account",
      authSubLogin: "Already registered? Sign In",
      authorSection: "About the Authors",
      authorText: "Tene Bana Maxym is the creator of the flagship algorithmics program. Lead engineer at Lickrotechnologie, he brings logic rigor to the students.",
      enrollBtn: "Enroll in Program",
      difficulty: "Difficulty",
      author: "Author",
      footer: "© 2026 Lickrotechnologie - lickrotechLearn. All rights reserved."
    }
  }[lang];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-50 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg">L</div>
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

      {/* Hero section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 space-y-16">
        
        {/* Intro */}
        <section className="text-center space-y-6 max-w-3xl mx-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Award className="w-4 h-4" />
            {t.badge}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            {t.heroSub}
          </p>
        </section>

        {/* Course Catalog display */}
        <section className="space-y-8">
          <div className="border-b border-[var(--border)] pb-4">
            <h2 className="text-2xl font-bold">{t.catalogTitle}</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">{t.catalogSub}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {COURSES.map((course) => (
              <div key={course.id} className="glass-panel overflow-hidden flex flex-col justify-between hover:border-blue-500/50 transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img src={course.imageUrl} alt={lang === 'fr' ? course.titleFr : course.titleEn} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                </div>
                <div className="p-8 flex flex-col justify-between flex-1 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-md text-xs font-bold uppercase tracking-wider">
                        {t.difficulty}: {lang === 'fr' ? course.difficultyFr : course.difficultyEn}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-medium">
                        {t.author}: <strong className="text-[var(--text-primary)]">{course.author}</strong>
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-blue-500 leading-snug">
                      {lang === 'fr' ? course.titleFr : course.titleEn}
                    </h3>
                    <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                      {lang === 'fr' ? course.descriptionFr : course.descriptionEn}
                    </p>
                  </div>

                  <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      {course.modules.length} Modules | {course.modules.flatMap(m => m.lessons).length} Lessons
                    </div>
                    <button
                      onClick={() => handleEnrollClick(course)}
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {t.enrollBtn}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed syllabus view of the algorithms course */}
        <section className="py-12 border-t border-[var(--border)]">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">{t.modulesTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES[0].modules.map((mod) => (
              <div key={mod.id} className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-extrabold text-lg">
                    {mod.id}
                  </div>
                  <h3 className="font-bold text-lg leading-snug">
                    {lang === 'fr' ? mod.titleFr : mod.titleEn}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {lang === 'fr' ? mod.descriptionFr : mod.descriptionEn}
                  </p>
                </div>
                <div className="pt-6 flex items-center justify-between text-xs font-semibold text-blue-500">
                  <span>{mod.lessons.length} {lang === 'fr' ? 'Leçons' : 'Lessons'}</span>
                  <span>{mod.lessons[0]?.duration || '20 min'}</span>
                </div>
              </div>
            ))}
            
            {/* Exam Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-extrabold text-lg">
                  5
                </div>
                <h3 className="font-bold text-lg leading-snug">
                  {lang === 'fr' ? "Certification Finale" : "Final Certification"}
                </h3>
                <p className="text-sm text-blue-100 leading-relaxed">
                  {lang === 'fr' ? "Évaluation sommative de 5 questions sur l'algorithmique avancée, le C et JavaScript." : "Summative 5-question exam covering advanced algorithmics, C, and JavaScript."}
                </p>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-bold text-white">
                <span>{lang === 'fr' ? "Tentative Unique" : "Single Attempt"}</span>
                <span>70% min</span>
              </div>
            </div>
          </div>
        </section>

        {/* Author Section */}
        <section className="max-w-4xl mx-auto text-center space-y-6 py-8 border-t border-[var(--border)]">
          <h2 className="text-3xl font-extrabold tracking-tight">{t.authorSection}</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-xl">
              TBM
            </div>
            <h3 className="text-xl font-bold text-blue-500">Tene Bana Maxym</h3>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
              {t.authorText}
            </p>
          </div>
        </section>
      </main>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-8 w-full max-w-md space-y-6 relative bg-[var(--bg-secondary)]">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl font-bold"
            >
              ✕
            </button>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">{isLogin ? t.authTitleLogin : t.authTitleReg}</h2>
              <p className="text-xs text-[var(--text-muted)]">
                {isLogin ? "Saisissez vos identifiants d'accès" : "Rejoignez le programme dès aujourd'hui"}
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)]">{t.namePl}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] focus:outline-none focus:border-blue-500 text-sm"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)]">{t.emailPl}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="name@university.com"
                />
              </div>

              {isLogin && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isAdmin" className="text-xs font-medium text-[var(--text-secondary)] cursor-pointer">
                      {t.adminLoginCheck}
                    </label>
                  </div>

                  {isAdmin && (
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)]">{t.adminPassPl}</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] focus:outline-none focus:border-blue-500 text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {loading ? "Chargement..." : t.authBtn}
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-xs font-medium text-blue-500 hover:underline"
              >
                {isLogin ? t.authSubReg : t.authSubLogin}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
        {t.footer}
      </footer>
    </div>
  );
}
