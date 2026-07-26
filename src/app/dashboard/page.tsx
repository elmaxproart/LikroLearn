'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Award, CheckCircle, Lock, Play, LogOut, Sun, Moon, Globe, ChevronRight } from 'lucide-react';
import { COURSES } from '@/lib/courseData';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Selected course for rendering modules
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [dashboardCategory, setDashboardCategory] = useState<string>('all');

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

    // Set first enrolled course
    const enrolledIds = Object.keys(parsedUser.courses || {});
    if (enrolledIds.length > 0) {
      setSelectedCourseId(enrolledIds[0]);
    }
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

  const handleEnroll = async (courseId: string) => {
    setEnrollLoading(true);
    try {
      const response = await fetch('/api/course/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, courseId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Enrollment failed');
      }

      setUser(data.user);
      localStorage.setItem('student_user', JSON.stringify(data.user));
      setSelectedCourseId(courseId);
    } catch (e) {
      console.error(e);
    } finally {
      setEnrollLoading(false);
    }
  };

  if (!user) return <div className="p-8 text-center text-sm font-semibold">Loading...</div>;

  const enrolledCourseIds = Object.keys(user.courses || {});
  const activeCourse = COURSES.find((c) => c.id === selectedCourseId);
  
  // Stats
  let totalLessons = 0;
  let completedCount = 0;
  let percentComplete = 0;
  let courseProgressState: any = null;

  if (activeCourse && user.courses && user.courses[activeCourse.id]) {
    courseProgressState = user.courses[activeCourse.id];
    totalLessons = activeCourse.modules.flatMap((m) => m.lessons).length;
    completedCount = Object.keys(courseProgressState.progress || {}).filter(
      (k) => courseProgressState.progress[k] === true
    ).length;
    percentComplete = Math.round((completedCount / totalLessons) * 100);
  }

  const isLessonUnlocked = (moduleId: number, lessonNum: number) => {
    if (user.isAdmin) return true;
    if (!courseProgressState) return false;
    if (moduleId === 1 && lessonNum === 1) return true;

    const all = activeCourse!.modules.flatMap((m) => m.lessons);
    const targetIdx = all.findIndex((l) => l.moduleId === moduleId && parseInt(l.id.split('-')[1]) === lessonNum);
    if (targetIdx <= 0) return false;

    const prevLesson = all[targetIdx - 1];
    return courseProgressState.progress && courseProgressState.progress[prevLesson.id] === true;
  };

  const isExamUnlocked = () => {
    if (!activeCourse || !courseProgressState) return false;
    const all = activeCourse.modules.flatMap((m) => m.lessons);
    return all.every((l) => courseProgressState.progress && courseProgressState.progress[l.id] === true);
  };

  const t = {
    fr: {
      welcome: "Espace candidat de",
      progressTitle: "Votre avancement dans ce cursus",
      completedLessons: "Chapitres validés",
      examCTA: "Débuter l'examen unique de certification",
      examCompleted: "Certifié lickrotechLearn",
      examFailed: "Examen de certification échoué.",
      examScoreText: "Note obtenue",
      viewCert: "Afficher mon Certificat officiel",
      logout: "Déconnexion",
      modulesTitle: "Syllabus interactif",
      unlocked: "Déverrouillé",
      locked: "Verrouillé",
      start: "Ouvrir",
      done: "Terminé",
      myPrograms: "Mes certifications en cours",
      catalogTitle: "Programmes disponibles",
      enrollBtn: "Rejoindre le cursus",
      selectCourse: "Sélectionnez l'une de vos certifications actives pour afficher son syllabus."
    },
    en: {
      welcome: "Candidate space of",
      progressTitle: "Curriculum progression",
      completedLessons: "Chapters validated",
      examCTA: "Start single-attempt certification exam",
      examCompleted: "Certified lickrotechLearn",
      examFailed: "Certification exam failed.",
      examScoreText: "Score obtained",
      viewCert: "View official Certificate",
      logout: "Logout",
      modulesTitle: "Interactive Syllabus",
      unlocked: "Unlocked",
      locked: "Locked",
      start: "Open",
      done: "Done",
      myPrograms: "My Active Certifications",
      catalogTitle: "Recommended Certifications",
      enrollBtn: "Enroll in course",
      selectCourse: "Select one of your active certifications to display its syllabus."
    }
  }[lang];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Background Mesh */}
      <div className="grid-bg"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Lickrotech Logo" className="w-8 h-8 object-contain" />
          <div>
            <span className="font-extrabold tracking-tight text-lg">lickrotech</span>
            <span className="text-blue-500 font-semibold text-sm ml-1">Learn</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold hidden md:inline">{t.welcome} <span className="text-blue-500">{user.name}</span></span>

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
        
        {/* Active enrolled programs */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-blue-500 uppercase tracking-widest">{t.myPrograms}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COURSES.filter((c) => enrolledCourseIds.includes(c.id)).map((course) => {
              const active = selectedCourseId === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    active
                      ? 'border-blue-500 bg-blue-500/5 shadow-lg'
                      : 'border-[var(--border)] bg-[var(--bg-secondary)]/50 hover:border-slate-500'
                  }`}
                >
                  <h3 className="font-bold text-base text-blue-400">
                    {lang === 'fr' ? course.titleFr : course.titleEn}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2">
                    {lang === 'fr' ? course.descriptionFr : course.descriptionEn}
                  </p>
                </div>
              );
            })}
            {enrolledCourseIds.length === 0 && (
              <div className="p-8 text-center text-xs font-semibold text-[var(--text-muted)] border-2 border-dashed border-[var(--border)] rounded-2xl col-span-2 bg-[var(--bg-secondary)]/35">
                Aucun cursus démarré. Choisissez une formation recommandée ci-dessous pour débuter.
              </div>
            )}
          </div>
        </section>

        {/* Recommended catalog list */}
        {COURSES.filter((c) => !enrolledCourseIds.includes(c.id)).length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold uppercase tracking-widest">{t.catalogTitle}</h2>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'algo', 'front', 'back', 'web', 'oop', 'python'].map((catId) => (
                  <button
                    key={catId}
                    onClick={() => setDashboardCategory(catId)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                      dashboardCategory === catId
                        ? 'bg-blue-600 text-white'
                        : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-slate-500'
                    }`}
                  >
                    {catId.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COURSES.filter(
                (c) => !enrolledCourseIds.includes(c.id) && (dashboardCategory === 'all' || c.category === dashboardCategory)
              ).map((course) => (
                <div key={course.id} className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/60 flex flex-col justify-between hover:border-blue-500/35 transition-all">
                  <div className="space-y-2">
                    <h3 className="font-bold text-base">
                      {lang === 'fr' ? course.titleFr : course.titleEn}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                      {lang === 'fr' ? course.descriptionFr : course.descriptionEn}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrollLoading}
                    className="mt-4 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold w-fit transition-all shadow-md hover:shadow-blue-500/10"
                  >
                    {t.enrollBtn}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Selected Course progress and modules list */}
        {activeCourse ? (
          <div className="space-y-8 pt-4">
            
            {/* Progress view */}
            <section className="glass-panel overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-[var(--border)] bg-[var(--glass-bg)] shadow-2xl">
              <div className="md:col-span-3 h-48 md:h-full min-h-[160px] relative overflow-hidden">
                <img src={activeCourse.imageUrl} alt="Course Cover" className="w-full h-full object-cover" />
              </div>
              <div className="md:col-span-6 p-6 md:py-8 space-y-4">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Active Enrollment</span>
                <h2 className="text-xl font-bold leading-tight">
                  {lang === 'fr' ? activeCourse.titleFr : activeCourse.titleEn}
                </h2>
                <div className="w-full bg-[var(--bg-tertiary)] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${percentComplete}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-[var(--text-secondary)] font-semibold">
                  <span>{percentComplete}% {t.done}</span>
                  <span>{completedCount} / {totalLessons} {t.completedLessons}</span>
                </div>
              </div>

              <div className="md:col-span-3 p-6 flex justify-center">
                {courseProgressState?.examAttempted ? (
                  <div className="text-center p-4 rounded-xl border border-[var(--border)] w-full bg-[var(--bg-tertiary)]">
                    <Award className={`w-10 h-10 mx-auto mb-2 ${courseProgressState.examScore >= 70 ? 'text-emerald-500' : 'text-rose-500'}`} />
                    <h4 className="font-bold text-xs">{courseProgressState.examScore >= 70 ? t.examCompleted : t.examFailed}</h4>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">{t.examScoreText}: {courseProgressState.examScore}%</p>
                    {courseProgressState.examScore >= 70 && (
                      <button
                        onClick={() => router.push(`/dashboard/certification?courseId=${activeCourse.id}`)}
                        className="mt-3 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold w-full transition-colors"
                      >
                        {t.viewCert}
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    disabled={!isExamUnlocked()}
                    onClick={() => router.push(`/dashboard/certification?courseId=${activeCourse.id}`)}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider ${
                      isExamUnlocked()
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/20'
                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    {t.examCTA}
                  </button>
                )}
              </div>
            </section>

            {/* Modules list */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-blue-500 uppercase tracking-widest">{t.modulesTitle}</h2>
              <div className="space-y-6">
                {activeCourse.modules.map((mod) => (
                  <div key={mod.id} className="glass-panel overflow-hidden border-[var(--border)] shadow-xl">
                    <div className="p-6 bg-[var(--bg-tertiary)]/50 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Module {mod.id}</span>
                        <h3 className="text-base font-bold">
                          {lang === 'fr' ? mod.titleFr : mod.titleEn}
                        </h3>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] max-w-sm">
                        {lang === 'fr' ? mod.descriptionFr : mod.descriptionEn}
                      </p>
                    </div>

                    <div className="divide-y divide-[var(--border)]">
                      {mod.lessons.map((les, idx) => {
                        const unlocked = isLessonUnlocked(mod.id, idx + 1);
                        const completed = courseProgressState?.progress && courseProgressState.progress[les.id] === true;

                        return (
                          <div key={les.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--bg-secondary)]/30 transition-colors">
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
                                <h4 className={`font-semibold text-sm ${!unlocked && 'text-[var(--text-muted)]'}`}>
                                  {lang === 'fr' ? les.titleFr : les.titleEn}
                                </h4>
                                <span className="text-[10px] text-[var(--text-muted)]">{les.duration}</span>
                              </div>
                            </div>

                            <div>
                              {unlocked ? (
                                <button
                                  onClick={() => router.push(`/dashboard/lessons/${les.id}?courseId=${activeCourse.id}`)}
                                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 uppercase tracking-wider ${
                                    completed
                                      ? 'border border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
                                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                                  }`}
                                >
                                  {completed ? t.done : t.start}
                                  {!completed && <Play className="w-3 h-3 fill-current" />}
                                </button>
                              ) : (
                                <span className="text-[10px] text-[var(--text-muted)] font-bold flex items-center gap-1">
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
          </div>
        ) : (
          <div className="p-12 text-center text-xs font-semibold text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]/25">
            {t.selectCourse}
          </div>
        )}
      </main>
    </div>
  );
}
