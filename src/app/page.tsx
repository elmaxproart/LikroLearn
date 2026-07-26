'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Award, CheckCircle, Code, ShieldCheck, ChevronRight, Sun, Moon, Globe, Terminal } from 'lucide-react';
import { COURSE_CURRICULUM } from '@/lib/courseData';

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isLogin, setIsLogin] = useState(true);
  
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

      // Store student info in session/localStorage
      localStorage.setItem('student_user', JSON.stringify(data.user));
      
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

  // Dictionary for static content
  const t = {
    fr: {
      heroTitle: "Maîtrisez l'Algorithmique & la Programmation",
      heroSub: "Une formation d'excellence conçue par Tene Bana Maxym. Intégrez les fondamentaux logiques et passez du pseudo-code à la pratique en JavaScript et C.",
      badge: "Certification Lickrotechnologie",
      modulesTitle: "Programme Académique",
      modulesDesc: "5 modules détaillés pour passer de débutant à certifié professionnel.",
      authTitleLogin: "Se connecter",
      authTitleReg: "S'inscrire",
      emailPl: "Adresse email académique",
      namePl: "Nom complet",
      adminLoginCheck: "Connexion en tant qu'administrateur",
      adminPassPl: "Mot de passe administrateur",
      authBtn: "Accéder à ma formation",
      authSubReg: "Pas encore de compte ? S'inscrire",
      authSubLogin: "Déjà inscrit ? Se connecter",
      authorSection: "À propos de l'auteur",
      authorText: "Tene Bana Maxym est ingénieur principal chez Lickrotechnologie. Passionné par l'enseignement structuré, il a modélisé ce cursus pour former la prochaine génération de développeurs système et web.",
      featuresTitle: "Pourquoi lickrotechLearn ?",
      feature1: "Interactivité Totale",
      feature1Desc: "Playground de code intégré pour tester vos compétences en direct.",
      feature2: "Rigueur Académique",
      feature2Desc: "Comme sur Coursera, le certificat requiert de valider tous les modules.",
      feature3: "Tentative Unique",
      feature3Desc: "L'examen final se passe en une seule tentative pour préserver la valeur de votre certification.",
      footer: "© 2026 Lickrotechnologie - lickrotechLearn. Tous droits réservés."
    },
    en: {
      heroTitle: "Master Algorithmics & Programming",
      heroSub: "An elite curriculum crafted by Tene Bana Maxym. Master logic fundamentals and bridge the gap from pseudocode to JavaScript and C code.",
      badge: "Lickrotechnologie Certification",
      modulesTitle: "Academic Curriculum",
      modulesDesc: "5 detailed modules to take you from absolute beginner to certified professional.",
      authTitleLogin: "Sign In",
      authTitleReg: "Register",
      emailPl: "Academic email address",
      namePl: "Full name",
      adminLoginCheck: "Log in as administrator",
      adminPassPl: "Administrator password",
      authBtn: "Access My Course",
      authSubReg: "New student? Register here",
      authSubLogin: "Already enrolled? Sign In",
      authorSection: "About the Author",
      authorText: "Tene Bana Maxym is a lead engineer at Lickrotechnologie. Driven by structured education, he modeled this course to train the next generation of systems and web engineers.",
      featuresTitle: "Why lickrotechLearn?",
      feature1: "Fully Interactive",
      feature1Desc: "Run code directly inside your browser and verify results in real-time.",
      feature2: "Academic Rigor",
      feature2Desc: "Like Coursera, the certification requires completing all modules sequentially.",
      feature3: "Single Attempt",
      feature3Desc: "The final exam allows exactly one attempt to ensure true certification credibility.",
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
          {/* Lang Selector */}
          <button onClick={toggleLang} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors flex items-center gap-1 text-sm font-medium">
            <Globe className="w-4 h-4 text-blue-500" />
            {lang.toUpperCase()}
          </button>

          {/* Theme Selector */}
          <button onClick={toggleTheme} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors">
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Hero and Login grid */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column: Intro */}
        <section className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Award className="w-4 h-4" />
            {t.badge}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
            {t.heroSub}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-2">
              <Code className="w-8 h-8 text-emerald-500" />
              <h3 className="font-bold text-sm">{t.feature1}</h3>
              <p className="text-xs text-[var(--text-muted)]">{t.feature1Desc}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-2">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <h3 className="font-bold text-sm">{t.feature2}</h3>
              <p className="text-xs text-[var(--text-muted)]">{t.feature2Desc}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-2">
              <ShieldCheck className="w-8 h-8 text-rose-500" />
              <h3 className="font-bold text-sm">{t.feature3}</h3>
              <p className="text-xs text-[var(--text-muted)]">{t.feature3Desc}</p>
            </div>
          </div>
        </section>

        {/* Right column: Auth Card */}
        <section className="lg:col-span-5">
          <div className="glass-panel p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">{isLogin ? t.authTitleLogin : t.authTitleReg}</h2>
              <p className="text-sm text-[var(--text-muted)]">
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
        </section>
      </main>

      {/* Curriculum outline section */}
      <section className="py-16 bg-[var(--bg-secondary)] border-t border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">{t.modulesTitle}</h2>
            <p className="text-[var(--text-secondary)]">{t.modulesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSE_CURRICULUM.map((mod) => (
              <div key={mod.id} className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] flex flex-col justify-between">
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
            
            {/* Exam Module */}
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
        </div>
      </section>

      {/* Author Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
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

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
        {t.footer}
      </footer>
    </div>
  );
}
