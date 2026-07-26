'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Award, CheckCircle, Code, ShieldCheck, ChevronRight, Sun, Moon, Globe, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { COURSES } from '@/lib/courseData';

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isLogin, setIsLogin] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Interactive syllabus expansion state
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const t = {
    fr: {
      catalogTitle: "Programmes Certifiants Actifs",
      catalogSub: "Parcourez le cursus et cliquez pour explorer les chapitres de la leçon.",
      heroTitle: "L'excellence académique à portée de code.",
      heroSub: "Intégrez le premier programme certifiant complet sur l'algorithmique et la programmation web et système.",
      badge: "LICKROTECHNOLOGIE ACADEMY",
      authTitleLogin: "Se connecter",
      authTitleReg: "Rejoindre le Cursus",
      emailPl: "Adresse email académique",
      namePl: "Votre nom complet",
      adminLoginCheck: "Connexion Administrateur",
      adminPassPl: "Code de sécurité",
      authBtn: "Valider ma demande",
      authSubReg: "Nouveau candidat ? Créer un compte",
      authSubLogin: "Déjà candidat ? Se connecter",
      authorSection: "Supervision Académique",
      authorText: "Le programme est rédigé et validé par Tene Bana Maxym, Lead Software Architect, garantissant une insertion directe vers les exigences de l'industrie.",
      enrollBtn: "S'inscrire et commencer",
      difficulty: "Niveau",
      author: "Superviseur",
      viewSyllabus: "Explorer le programme (Syllabus)",
      hideSyllabus: "Refermer le programme",
      syllabusOverview: "Contenu de la formation",
      footer: "© 2026 Lickrotechnologie - lickrotechLearn. Tous droits réservés."
    },
    en: {
      catalogTitle: "Active Certification Programs",
      catalogSub: "Browse the curriculum and click to explore the lesson contents.",
      heroTitle: "Academic excellence, powered by code.",
      heroSub: "Join the flagship certification program in algorithmics and systems/web programming.",
      badge: "LICKROTECHNOLOGIE ACADEMY",
      authTitleLogin: "Student Login",
      authTitleReg: "Join Curriculum",
      emailPl: "Academic email address",
      namePl: "Your full name",
      adminLoginCheck: "Administrator Login",
      adminPassPl: "Security code",
      authBtn: "Verify and Enter",
      authSubReg: "New applicant? Register here",
      authSubLogin: "Enrolled student? Sign In",
      authorSection: "Academic Supervision",
      authorText: "The curriculum is authored and validated by Tene Bana Maxym, Lead Software Architect, ensuring alignments with industry demands.",
      enrollBtn: "Enroll and Start",
      difficulty: "Level",
      author: "Supervisor",
      viewSyllabus: "Explore syllabus content",
      hideSyllabus: "Close syllabus content",
      syllabusOverview: "Syllabus Overview",
      footer: "© 2026 Lickrotechnologie - lickrotechLearn. All rights reserved."
    }
  }[lang];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Mesh Grid Background */}
      <div className="grid-bg"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between">
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

      {/* Main content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-16 space-y-16">
        
        {/* Elite Centered Hero */}
        <section className="text-center space-y-6 py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase">
            <Award className="w-4 h-4 text-emerald-400" />
            {t.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
            {t.heroSub}
          </p>
        </section>

        {/* Course Catalog */}
        <section className="space-y-6">
          <div className="border-b border-[var(--border)] pb-4 text-center sm:text-left">
            <h2 className="text-2xl font-bold">{t.catalogTitle}</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">{t.catalogSub}</p>
          </div>

          <div className="space-y-6">
            {COURSES.map((course) => {
              const isSyllabusOpen = expandedCourseId === course.id;

              return (
                <div key={course.id} className="glass-panel overflow-hidden transition-all duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    
                    {/* Cover image left */}
                    <div className="md:col-span-4 h-48 md:h-full min-h-[220px] relative overflow-hidden">
                      <img src={course.imageUrl} alt={course.titleFr} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
                    </div>

                    {/* Card Content right */}
                    <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-md text-xs font-bold uppercase tracking-wider">
                            {t.difficulty}: {lang === 'fr' ? course.difficultyFr : course.difficultyEn}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] font-medium">
                            {t.author}: <strong className="text-[var(--text-primary)]">{course.author}</strong>
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-blue-500 leading-snug">
                          {lang === 'fr' ? course.titleFr : course.titleEn}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {lang === 'fr' ? course.descriptionFr : course.descriptionEn}
                        </p>
                      </div>

                      <div className="border-t border-[var(--border)] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button
                          onClick={() => toggleCourseSyllabus(course.id)}
                          className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {isSyllabusOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {isSyllabusOpen ? t.hideSyllabus : t.viewSyllabus}
                        </button>

                        <button
                          onClick={() => handleEnrollClick(course.id)}
                          className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                          {t.enrollBtn}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interactive modules/lessons display drawer */}
                  {isSyllabusOpen && (
                    <div className="bg-[var(--bg-secondary)] border-t border-[var(--border)] p-6 md:p-8 space-y-6">
                      <h4 className="text-lg font-bold text-blue-500 border-b border-[var(--border)] pb-2">
                        {t.syllabusOverview}
                      </h4>

                      <div className="space-y-4">
                        {course.modules.map((mod) => {
                          const isModuleOpen = expandedModuleId === mod.id;

                          return (
                            <div key={mod.id} className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-primary)]">
                              <button
                                onClick={() => toggleModule(mod.id)}
                                className="w-full p-4 flex items-center justify-between text-left font-bold text-sm hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs">
                                    {mod.id}
                                  </span>
                                  {lang === 'fr' ? mod.titleFr : mod.titleEn}
                                </span>
                                {isModuleOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>

                              {isModuleOpen && (
                                <div className="p-4 bg-[var(--bg-secondary)]/50 border-t border-[var(--border)] divide-y divide-[var(--border)]">
                                  {mod.lessons.map((les) => (
                                    <div key={les.id} className="py-3 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                                      <span className="font-semibold">{lang === 'fr' ? les.titleFr : les.titleEn}</span>
                                      <span className="text-[var(--text-muted)]">{les.duration}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Exam module representation */}
                        <div className="p-4 border border-blue-500/30 rounded-xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 flex items-center justify-between text-sm font-semibold">
                          <span>5. {lang === 'fr' ? 'Examen de Certification Finale' : 'Final Certification Exam'}</span>
                          <span className="text-xs px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-md">70% min</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Academic Supervision details */}
        <section className="glass-panel p-8 text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold">{t.authorSection}</h2>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-extrabold text-xl shadow-xl">
              TBM
            </div>
            <h3 className="text-lg font-bold text-blue-400">Tene Bana Maxym</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
              {t.authorText}
            </p>
          </div>
        </section>
      </main>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-8 w-full max-w-md space-y-6 relative bg-[var(--bg-secondary)] border-slate-700/60 shadow-2xl">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white text-xl font-bold transition-colors"
            >
              ✕
            </button>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">{isLogin ? t.authTitleLogin : t.authTitleReg}</h2>
              <p className="text-xs text-[var(--text-muted)]">
                {isLogin ? "Accéder à mon espace candidat" : "Créer mes accès candidat officiels"}
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
                    className="w-full premium-input text-sm"
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
                  className="w-full premium-input text-sm"
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
                      className="rounded border-slate-700 text-blue-600 bg-slate-900 focus:ring-blue-500"
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
                        className="w-full premium-input text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {loading ? "Vérification..." : t.authBtn}
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-xs font-semibold text-blue-400 hover:underline"
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
