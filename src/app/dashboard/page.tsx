'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Award, CheckCircle2, Clock, Play, ArrowLeft, LogOut, ChevronRight, Globe, Sun, Moon, Star, Compass, User, Lock } from 'lucide-react';
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

  // Review form states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const [reviews, setReviews] = useState<any[]>([]);

  const loadReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.error(e);
    }
  };

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

    loadReviews();
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
    if (!user) return;
    setEnrollLoading(true);
    try {
      const response = await fetch('/api/course/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, courseId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to enroll');
      }

      // Update user localStorage and state
      const updatedUser = { ...user, courses: { ...user.courses, [courseId]: data.progress } };
      localStorage.setItem('student_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSelectedCourseId(courseId);
      // Reset review form
      setReviewSubmitted(false);
      setReviewComment('');
      setReviewRating(5);
    } catch (e: any) {
      alert(e.message || 'Error occurred during enrollment');
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent, courseId: string) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewLoading(true);
    setReviewError('');
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          courseId,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }
      setReviewSubmitted(true);
      loadReviews();
    } catch (err: any) {
      setReviewError(err.message || 'Error occurred');
    } finally {
      setReviewLoading(false);
    }
  };

  if (!user) return <div className="p-8 text-center text-sm font-semibold">Verification...</div>;

  const t = {
    fr: {
      welcome: "Candidat :",
      logout: "Déconnexion",
      myPrograms: "Mes Cursus Actifs",
      catalogTitle: "Choisir un nouveau cursus académique",
      enrollBtn: "S'inscrire à cette spécialisation",
      done: "complété",
      completedLessons: "leçons validées",
      viewCert: "Afficher le Certificat",
      examScoreText: "Score obtenu",
      examCompleted: "Certification validée !",
      examFailed: "Examen non validé",
      takeExam: "Passer l'Examen Final Unique",
      syllabus: "Syllabus Interactif (Progression Linéaire)",
      lessonLabel: "Leçon",
      startLesson: "Démarrer l'exercice",
      completedBadge: "Validé",
      writeReviewTitle: "Laisser votre avis réel sur ce cours",
      reviewLabelRating: "Note d'évaluation",
      reviewLabelComment: "Votre commentaire d'étudiant",
      reviewBtn: "Soumettre mon avis",
      reviewThanks: "Merci ! Votre avis a été enregistré avec succès et s'affiche sur la page d'accueil.",
      lockedMsg: "Verrouillé - Terminez les leçons précédentes",
      examLockedMsg: "Examen verrouillé - Validez toutes les leçons"
    },
    en: {
      welcome: "Candidate:",
      logout: "Sign Out",
      myPrograms: "My Enrolled Programs",
      catalogTitle: "Enroll in another specialization",
      enrollBtn: "Enroll in this program",
      done: "completed",
      completedLessons: "completed lessons",
      viewCert: "View Official Certificate",
      examScoreText: "Your Score",
      examCompleted: "Certified Graduate!",
      examFailed: "Exam Failed",
      takeExam: "Start Single-Attempt Final Exam",
      syllabus: "Interactive Syllabus (Linear progression)",
      lessonLabel: "Lesson",
      startLesson: "Start Coding Playground",
      completedBadge: "Completed",
      writeReviewTitle: "Write your real candidate review",
      reviewLabelRating: "Rating score",
      reviewLabelComment: "Your student experience comment",
      reviewBtn: "Submit Review",
      reviewThanks: "Thank you! Your real review has been saved and is displayed on the main landing page.",
      lockedMsg: "Locked - Complete previous lessons",
      examLockedMsg: "Exam locked - Complete all lessons"
    }
  }[lang];

  // List of enrolled course IDs
  const enrolledCourseIds = user.courses ? Object.keys(user.courses) : [];

  // Automatically select first course if none selected
  const currentSelectedCourseId = selectedCourseId || enrolledCourseIds[0] || null;
  const activeCourse = COURSES.find((c) => c.id === currentSelectedCourseId) || null;
  const courseProgressState = activeCourse ? user.courses[activeCourse.id] : null;

  // Calculate statistics for the active course
  const totalLessons = activeCourse
    ? activeCourse.modules.reduce((sum, mod) => sum + mod.lessons.length, 0)
    : 0;
  const completedCount = courseProgressState
    ? Object.keys(courseProgressState.progress || {}).filter((k) => courseProgressState.progress[k] === true).length
    : 0;
  const percentComplete = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Ordered list of all lessons in activeCourse to compute locks
  const allCourseLessons = activeCourse ? activeCourse.modules.flatMap((m) => m.lessons) : [];

  // Check if a lesson is unlocked (first is unlocked, or previous must be completed)
  const isLessonUnlocked = (lessonId: string) => {
    if (!courseProgressState) return false;
    const idx = allCourseLessons.findIndex((l) => l.id === lessonId);
    if (idx <= 0) return true; // First lesson is always open
    const prev = allCourseLessons[idx - 1];
    return courseProgressState.progress[prev.id] === true;
  };

  // Check if final exam is unlocked (all lessons must be completed)
  const isExamUnlocked = allCourseLessons.length > 0 && allCourseLessons.every((l) => courseProgressState?.progress[l.id] === true);

  const getCourseRatingInfo = (courseId: string) => {
    const courseReviews = reviews.filter((r) => r.courseId === courseId);
    if (courseReviews.length === 0) {
      return { avg: 5, count: 0 };
    }
    const sum = courseReviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      avg: Math.round((sum / courseReviews.length) * 10) / 10,
      count: courseReviews.length
    };
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen mobile-page-container">
      {/* Background Mesh */}
      <div className="grid-bg"></div>

      {/* Navigation Header */}
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
              const active = currentSelectedCourseId === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setReviewSubmitted(false);
                    setReviewComment('');
                    setReviewRating(5);
                  }}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    active
                      ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/5'
                      : 'border-[var(--border)] bg-[var(--bg-secondary)]/50 hover:border-slate-600'
                  }`}
                >
                  <h3 className="font-bold text-base text-blue-400">
                    {lang === 'fr' ? course.titleFr : course.titleEn}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-amber-400">
                    {[...Array(5)].map((_, i) => {
                      const ratingInfo = getCourseRatingInfo(course.id);
                      return (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(ratingInfo.avg) ? 'fill-current' : 'text-slate-600'
                          }`}
                        />
                      );
                    })}
                    <span className="text-[10px] text-[var(--text-muted)] font-bold ml-1">
                      {getCourseRatingInfo(course.id).avg} ({getCourseRatingInfo(course.id).count})
                    </span>
                  </div>
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
                    <div className="flex items-center gap-1 mt-1 text-amber-400">
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
                      <span className="text-[9px] text-[var(--text-muted)] font-bold ml-1">
                        {getCourseRatingInfo(course.id).avg} ({getCourseRatingInfo(course.id).count})
                      </span>
                    </div>
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
                ) : isExamUnlocked ? (
                  <button
                    onClick={() => router.push(`/dashboard/certification?courseId=${activeCourse.id}`)}
                    className="p-4 text-center rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer transition-all w-full space-y-2 group"
                  >
                    <Award className="w-8 h-8 text-emerald-500 mx-auto group-hover:scale-110 transition-transform animate-pulse" />
                    <h4 className="font-bold text-xs leading-snug">{t.takeExam}</h4>
                    <p className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Unlocked</p>
                  </button>
                ) : (
                  <div
                    title={t.examLockedMsg}
                    className="p-4 text-center rounded-xl border border-slate-700/40 bg-slate-800/10 w-full space-y-2 opacity-50 cursor-not-allowed"
                  >
                    <Lock className="w-8 h-8 text-slate-500 mx-auto" />
                    <h4 className="font-bold text-xs leading-snug text-slate-400">{t.takeExam}</h4>
                    <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Locked</p>
                  </div>
                )}
              </div>
            </section>

            {/* Leave a review form section */}
            <section className="glass-panel p-6 border-[var(--border)] bg-[var(--bg-secondary)]/50">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                {t.writeReviewTitle}
              </h3>
              {reviewSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  {t.reviewThanks}
                </div>
              ) : (
                <form onSubmit={(e) => handleReviewSubmit(e, activeCourse.id)} className="space-y-4">
                  {reviewError && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
                      {reviewError}
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                      {t.reviewLabelRating}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setReviewRating(starVal)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              starVal <= reviewRating ? 'text-amber-400 fill-current' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                      {t.reviewLabelComment}
                    </label>
                    <textarea
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                      className="w-full premium-input text-xs"
                      placeholder="Excellent cours, très complet et interactif..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    {reviewLoading ? 'Envoi...' : t.reviewBtn}
                  </button>
                </form>
              )}
            </section>

            {/* Syllabus module hierarchy */}
            <section className="space-y-4">
              <h3 className="text-base font-bold uppercase tracking-wider">{t.syllabus}</h3>
              <div className="space-y-4">
                {activeCourse.modules.map((mod) => (
                  <div key={mod.id} className="glass-panel overflow-hidden border-[var(--border)]">
                    <div className="p-4 bg-[var(--bg-tertiary)]/30 border-b border-[var(--border)] flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm text-blue-500">
                          {mod.id}. {lang === 'fr' ? mod.titleFr : mod.titleEn}
                        </h4>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                          {lang === 'fr' ? mod.descriptionFr : mod.descriptionEn}
                        </p>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-[var(--border)]">
                      {mod.lessons.map((lesson) => {
                        const isCompleted = courseProgressState?.progress[lesson.id] === true;
                        const isUnlocked = isLessonUnlocked(lesson.id);

                        return (
                          <div key={lesson.id} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--bg-tertiary)]/20 transition-colors ${!isUnlocked ? 'opacity-50' : ''}`}>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
                                {!isUnlocked && <Lock className="w-3 h-3 text-slate-500" />}
                                {t.lessonLabel} {lesson.id}
                              </span>
                              <h5 className="font-bold text-sm">{lang === 'fr' ? lesson.titleFr : lesson.titleEn}</h5>
                              <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {isCompleted ? (
                                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {t.completedBadge}
                                </span>
                              ) : !isUnlocked ? (
                                <span className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  Locked
                                </span>
                              ) : null}
                              
                              <button
                                onClick={() => {
                                  if (isUnlocked) {
                                    router.push(`/dashboard/lessons/${lesson.id}?courseId=${activeCourse.id}`);
                                  }
                                }}
                                disabled={!isUnlocked}
                                className={`px-3.5 py-2 border rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                                  isUnlocked
                                    ? 'bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border-blue-500/20 cursor-pointer'
                                    : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                                }`}
                              >
                                <Play className="w-3.5 h-3.5" />
                                {t.startLesson}
                              </button>
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
        ) : null}
      </main>

      {/* Fixed bottom navigation bar for mobile webapp feel */}
      <div className="mobile-nav-bar">
        <button onClick={() => router.push('/')} className="flex flex-col items-center gap-0.5 text-[var(--text-muted)] hover:text-blue-500">
          <Compass className="w-5 h-5" />
          <span className="text-[9px] font-bold">Explorer</span>
        </button>
        <button onClick={() => router.push('/dashboard')} className="flex flex-col items-center gap-0.5 text-blue-500">
          <BookOpen className="w-5 h-5" />
          <span className="text-[9px] font-bold">Dashboard</span>
        </button>
        {user?.isAdmin && (
          <button onClick={() => router.push('/admin')} className="flex flex-col items-center gap-0.5 text-[var(--text-muted)] hover:text-blue-500">
            <User className="w-5 h-5" />
            <span className="text-[9px] font-bold">Admin</span>
          </button>
        )}
      </div>
    </div>
  );
}
