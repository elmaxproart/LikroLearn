'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Award, CheckCircle, Lock, Play, LogOut, Sun, Moon, Globe } from 'lucide-react';
import { COURSE_CURRICULUM } from '@/lib/courseData';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check auth
    const stored = localStorage.getItem('student_user');
    if (!stored) {
      router.push('/');
      return;
    }
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    // Sync theme and lang
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    const savedLang = localStorage.getItem('lang') as 'fr' | 'en' | null;
    if (savedLang) setLang(savedLang);
  }, [router]);

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

  const handleLogout = () => {
    localStorage.removeItem('student_user');
    router.push('/');
  };

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  const totalLessons = COURSE_CURRICULUM.flatMap((m) => m.lessons).length;
  const completedCount = Object.keys(user.progress || {}).filter((k) => user.progress[k] === true).length;
  const percentComplete = Math.round((completedCount / totalLessons) * 100);

  // Helper to determine if a lesson is unlocked
  const isLessonUnlocked = (moduleId: number, lessonNum: number) => {
    // Admin has everything unlocked
    if (user.isAdmin) return true;
    
    // First lesson is always unlocked
    if (moduleId === 1 && lessonNum === 1) return true;

    // Get ordered list of all lessons
    const all = COURSE_CURRICULUM.flatMap((m) => m.lessons);
    const targetIdx = all.findIndex((l) => l.moduleId === moduleId && parseInt(l.id.split('-')[1]) === lessonNum);
    
    if (targetIdx <= 0) return false;
    
    // Check if the previous lesson is completed
    const prevLesson = all[targetIdx - 1];
    return user.progress && user.progress[prevLesson.id] === true;
  };

  const isExamUnlocked = () => {
    // Require all lessons to be completed
    const all = COURSE_CURRICULUM.flatMap((m) => m.lessons);
    return all.every((l) => user.progress && user.progress[l.id] === true);
  };

  const t = {
    fr: {
      welcome: "Ravi de vous revoir",
      progressTitle: "Votre Progression globale",
      completedLessons: "Leçons complétées",
      examCTA: "Débutez l'examen de Certification",
      examCompleted: "Certification complétée avec succès !",
      examFailed: "Examen de certification échoué.",
      examScoreText: "Score final",
      viewCert: "Voir mon Certificat",
      logout: "Déconnexion",
      modulesTitle: "Vos Modules de cours",
      unlocked: "Déverrouillé",
      locked: "Verrouillé",
      start: "Démarrer",
      done: "Complété"
    },
    en: {
      welcome: "Welcome back",
      progressTitle: "Your Overall Progress",
      completedLessons: "Lessons completed",
      examCTA: "Start Certification Exam",
      examCompleted: "Certification successfully completed!",
      examFailed: "Certification exam failed.",
      examScoreText: "Final score",
      viewCert: "View my Certificate",
      logout: "Logout",
      modulesTitle: "Your Course Modules",
      unlocked: "Unlocked",
      locked: "Locked",
      start: "Start",
      done: "Completed"
    }
  }[lang];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg">L</div>
          <div>
            <span className="font-extrabold tracking-tight text-lg">lickrotech</span>
            <span className="text-blue-500 font-semibold text-sm ml-1">Learn</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold hidden md:inline">{t.welcome}, <span className="text-blue-500">{user.name}</span></span>

          <button onClick={toggleLang} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors flex items-center gap-1 text-sm font-medium">
            <Globe className="w-4 h-4 text-blue-500" />
            {lang.toUpperCase()}
          </button>

          <button onClick={toggleTheme} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors">
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <button onClick={handleLogout} className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-full transition-colors flex items-center gap-2 text-sm font-medium">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t.logout}</span>
          </button>
        </div>
      </header>

      {/* Main Student Portal dashboard layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Progress Grid */}
        <section className="glass-panel p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-2xl font-bold">{t.progressTitle}</h2>
            <div className="w-full bg-[var(--bg-tertiary)] h-3 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${percentComplete}%` }}></div>
            </div>
            <div className="flex justify-between text-sm text-[var(--text-secondary)] font-medium">
              <span>{percentComplete}% {t.done}</span>
              <span>{completedCount} / {totalLessons} {t.completedLessons}</span>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center">
            {user.examAttempted ? (
              <div className="text-center p-4 rounded-xl border border-[var(--border)] w-full bg-[var(--bg-tertiary)]">
                <Award className={`w-12 h-12 mx-auto mb-2 ${user.examScore >= 70 ? 'text-emerald-500' : 'text-rose-500'}`} />
                <h4 className="font-bold text-sm">{user.examScore >= 70 ? t.examCompleted : t.examFailed}</h4>
                <p className="text-xs text-[var(--text-muted)] mt-1">{t.examScoreText}: {user.examScore}%</p>
                {user.examScore >= 70 && (
                  <button
                    onClick={() => router.push('/dashboard/certification')}
                    className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold w-full transition-colors"
                  >
                    {t.viewCert}
                  </button>
                )}
              </div>
            ) : (
              <button
                disabled={!isExamUnlocked()}
                onClick={() => router.push('/dashboard/certification')}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                  isExamUnlocked()
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/20'
                    : 'bg-slate-300 text-slate-500 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <Award className="w-5 h-5" />
                {t.examCTA}
              </button>
            )}
          </div>
        </section>

        {/* Modules Accordions */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-blue-500">{t.modulesTitle}</h2>

          <div className="space-y-6">
            {COURSE_CURRICULUM.map((mod) => (
              <div key={mod.id} className="glass-panel overflow-hidden">
                {/* Module title card */}
                <div className="p-6 bg-[var(--bg-tertiary)] border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Module {mod.id}</span>
                    <h3 className="text-lg font-bold">
                      {lang === 'fr' ? mod.titleFr : mod.titleEn}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] max-w-sm">
                    {lang === 'fr' ? mod.descriptionFr : mod.descriptionEn}
                  </p>
                </div>

                {/* Lessons list */}
                <div className="divide-y divide-[var(--border)]">
                  {mod.lessons.map((les, idx) => {
                    const unlocked = isLessonUnlocked(mod.id, idx + 1);
                    const completed = user.progress && user.progress[les.id] === true;

                    return (
                      <div key={les.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {completed ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : unlocked ? (
                              <BookOpen className="w-5 h-5 text-blue-500" />
                            ) : (
                              <Lock className="w-5 h-5 text-[var(--text-muted)]" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <h4 className={`font-semibold text-base ${!unlocked && 'text-[var(--text-muted)]'}`}>
                              {lang === 'fr' ? les.titleFr : les.titleEn}
                            </h4>
                            <span className="text-xs text-[var(--text-muted)]">{les.duration}</span>
                          </div>
                        </div>

                        <div>
                          {unlocked ? (
                            <button
                              onClick={() => router.push(`/dashboard/lessons/${les.id}`)}
                              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 ${
                                completed
                                  ? 'border border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                              }`}
                            >
                              {completed ? t.done : t.start}
                              {!completed && <Play className="w-3.5 h-3.5 fill-current" />}
                            </button>
                          ) : (
                            <span className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" />
                              {t.locked}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
