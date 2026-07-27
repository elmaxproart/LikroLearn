'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertCircle, Play, Sparkles, Terminal, Globe, Moon, Sun, BookOpen, ChevronRight, Check } from 'lucide-react';
import { COURSES } from '@/lib/courseData';
import LofiStudyAnimation from '@/components/LofiStudyAnimation';

function LessonContent() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId') || 'algo-101';

  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Lesson state
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [code, setCode] = useState('');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auth check
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

    // Load target course and lesson
    const course = COURSES.find((c) => c.id === courseId);
    if (!course) {
      router.push('/dashboard');
      return;
    }

    // Validate progression lock
    const courseProgress = parsedUser.courses ? parsedUser.courses[courseId] : null;
    if (!courseProgress) {
      router.push('/dashboard');
      return;
    }

    const allLessons = course.modules.flatMap((m) => m.lessons);
    const idx = allLessons.findIndex((l) => l.id === id);
    if (idx > 0) {
      const prevLesson = allLessons[idx - 1];
      if (courseProgress.progress[prevLesson.id] !== true) {
        router.push('/dashboard');
        return;
      }
    }

    let target = null;
    for (const mod of course.modules) {
      const les = mod.lessons.find((l) => l.id === id);
      if (les) {
        target = les;
        break;
      }
    }

    if (!target) {
      router.push('/dashboard');
      return;
    }

    setCourse(course);
    setLesson(target);
    setCode(target.exercise.initialCode);
  }, [id, courseId, router]);

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

  const handleSubmitCode = async () => {
    setError('');
    setResults(null);
    setLoading(true);

    try {
      const response = await fetch('/api/exercise/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          courseId,
          lessonId: lesson.id,
          code,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission');
      }

      setResults(data);

      if (data.passed) {
        setUser(data.user);
        localStorage.setItem('student_user', JSON.stringify(data.user));
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const parseInlineMarkdown = (line: string) => {
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const splitParts = line.split(regex);
    return splitParts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-100">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded text-blue-400 font-mono text-[10px]">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const parseMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="text-lg md:text-xl font-extrabold text-blue-400 mt-4 mb-2 border-b border-[var(--border)] pb-1.5 uppercase tracking-wider">{trimmed.slice(2)}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="text-sm font-bold text-slate-200 mt-3 mb-1.5">{trimmed.slice(3)}</h2>;
      }
      if (trimmed.startsWith('- ')) {
        const content = parseInlineMarkdown(trimmed.slice(2));
        return <li key={idx} className="ml-5 list-disc text-xs text-[var(--text-secondary)] my-1">{content}</li>;
      }
      if (trimmed === '') {
        return <div key={idx} className="h-2"></div>;
      }

      return <p key={idx} className="text-xs text-[var(--text-secondary)] leading-relaxed my-1.5">{parseInlineMarkdown(trimmed)}</p>;
    });
  };

  if (!lesson || !user) return <div className="p-8 text-center">Loading...</div>;

  const t = {
    fr: {
      back: "Retour au Dashboard",
      courseContent: "Contenu de la Leçon",
      exerciseTitle: "Console d'Exercice Guidé",
      submitBtn: "Valider mon code",
      successMsg: "Excellent ! Tous les tests passent avec succès.",
      failMsg: "Certains tests ont échoué. Corrigez votre algorithme.",
      consolePlaceholder: "Le résultat de la validation s'affichera ici.",
      solutionSuccess: "Félicitations, cette étape est validée !",
      flowchartTitle: "Logigramme de l'Algorithme",
      nextLessonCTA: "Continuer le cours"
    },
    en: {
      back: "Back to Dashboard",
      courseContent: "Lesson Content",
      exerciseTitle: "Guided Exercise Console",
      submitBtn: "Run and Validate Code",
      successMsg: "Excellent! All tests passed successfully.",
      failMsg: "Some test cases failed. Adjust your algorithm.",
      consolePlaceholder: "Validation output will be displayed here.",
      solutionSuccess: "Congratulations! This lesson is complete.",
      flowchartTitle: "Algorithm Flowchart",
      nextLessonCTA: "Continue course"
    }
  }[lang];

  const renderFlowchart = () => {
    // --- Module 1 ---
    if (lesson.id === '1-1') {
      return (
        <div className="flowchart-container my-6">
          <div className="flowchart-node node-start-end">Début / Start</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Lire Largeur & Hauteur</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Calculer: Aire = Largeur × Hauteur</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Retourner Aire / Area</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-start-end">Fin / End</div>
        </div>
      );
    }
    if (lesson.id === '1-2') {
      return (
        <div className="flowchart-container my-6">
          <div className="flowchart-node node-start-end">Début / Start</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Lire variables a et b</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process" style={{background:'rgba(147,51,234,0.4)'}}>temp ← a</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process" style={{background:'rgba(147,51,234,0.4)'}}>a ← b</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process" style={{background:'rgba(147,51,234,0.4)'}}>b ← temp</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Retourner [b, a]</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-start-end">Fin / End</div>
        </div>
      );
    }
    if (lesson.id === '1-3') {
      return (
        <div className="flowchart-container my-6">
          <div className="flowchart-node node-start-end" style={{fontSize:'10px'}}>Début / Start</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Lire n</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Calculer: résultat = n × 2</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Retourner résultat</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-start-end">Fin / End</div>
        </div>
      );
    }
    if (lesson.id === '1-4') {
      return (
        <div className="flowchart-container my-6">
          <div className="flowchart-node node-start-end">Début / Start</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Déclarer variables a, b</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Calculer: résultat = a + b</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Retourner résultat</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-start-end">Fin / End</div>
        </div>
      );
    }
    if (lesson.id === '1-5') {
      return (
        <div className="flowchart-container my-6">
          <div className="flowchart-node node-start-end">Début / Start</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Lire Nombre n</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-decision">Reste (n / 2) == 0 ?</div>
          <div className="flex gap-16 justify-center items-center my-2">
            <div className="text-emerald-500 font-bold text-xs flex flex-col items-center">
              <span>Oui</span>
              <div className="flowchart-arrow h-10"></div>
              <div className="flowchart-node node-process" style={{background:'rgba(16,185,129,0.4)'}}>Retourner true</div>
            </div>
            <div className="text-rose-500 font-bold text-xs flex flex-col items-center">
              <span>Non</span>
              <div className="flowchart-arrow h-10"></div>
              <div className="flowchart-node node-process" style={{background:'rgba(239,68,68,0.4)'}}>Retourner false</div>
            </div>
          </div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-start-end">Fin / End</div>
        </div>
      );
    }
    // --- Module 2 ---
    if (lesson.id === '2-4') {
      return (
        <div className="flowchart-container my-6">
          <div className="flowchart-node node-start-end">Début / Start</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Lire a, b</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-decision">a &gt; b ?</div>
          <div className="flex gap-16 justify-center items-center my-2">
            <div className="text-emerald-500 font-bold text-xs flex flex-col items-center">
              <span>Oui</span>
              <div className="flowchart-arrow h-10"></div>
              <div className="flowchart-node node-process" style={{background:'rgba(16,185,129,0.4)'}}>Retourner 1</div>
            </div>
            <div className="text-rose-500 font-bold text-xs flex flex-col items-center">
              <span>Non</span>
              <div className="flowchart-arrow h-10"></div>
              <div className="flowchart-node node-process" style={{background:'rgba(239,68,68,0.4)'}}>Retourner 0</div>
            </div>
          </div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-start-end">Fin / End</div>
        </div>
      );
    }
    if (lesson.id === '2-5') {
      return (
        <div className="flowchart-container my-6">
          <div className="flowchart-node node-start-end">Début / Start</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">s = 0, i = 1</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-decision">i &lt;= n ?</div>
          <div className="flex gap-12 justify-center items-center my-2">
            <div className="text-emerald-500 font-bold text-xs flex flex-col items-center">
              <span>Oui</span>
              <div className="flowchart-arrow h-12"></div>
              <div className="flowchart-node node-process" style={{background:'rgba(59,130,246,0.4)'}}>s += i; i++</div>
              <div className="flowchart-arrow h-6"></div>
              <span className="text-[10px] text-slate-400">Boucler</span>
            </div>
            <div className="text-rose-500 font-bold text-xs flex flex-col items-center">
              <span>Non</span>
              <div className="flowchart-arrow h-12"></div>
              <div className="flowchart-node node-process" style={{background:'rgba(16,185,129,0.4)'}}>Retourner s</div>
            </div>
          </div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-start-end">Fin / End</div>
        </div>
      );
    }
    // --- Module 3 ---
    if (lesson.id === '3-5') {
      return (
        <div className="flowchart-container my-6">
          <div className="flowchart-node node-start-end">Début / Start</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Lire n</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-decision">n &lt;= 1 ?</div>
          <div className="flex gap-12 justify-center items-center my-2">
            <div className="text-emerald-500 font-bold text-xs flex flex-col items-center">
              <span>Oui</span>
              <div className="flowchart-arrow h-10"></div>
              <div className="flowchart-node node-process" style={{background:'rgba(16,185,129,0.4)'}}>Retourner 1</div>
            </div>
            <div className="text-rose-500 font-bold text-xs flex flex-col items-center">
              <span>Non</span>
              <div className="flowchart-arrow h-10"></div>
              <div className="flowchart-node node-process" style={{background:'rgba(147,51,234,0.4)'}}>Retourner n × fact(n-1)</div>
            </div>
          </div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-start-end">Fin / End</div>
        </div>
      );
    }
    // Pas de logigramme pour cette leçon
    return null;
  };


  return (
    <div className="flex-1 flex flex-col min-h-screen mobile-page-container">
      {/* Background Grid */}
      <div className="grid-bg"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </button>

        <div className="flex items-center gap-4">
          <button onClick={toggleLang} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors flex items-center gap-1 text-sm font-medium">
            <Globe className="w-4 h-4 text-blue-500" />
            {lang.toUpperCase()}
          </button>

          <button onClick={toggleTheme} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors">
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Main content columns */}
      <main className="flex-1 w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px]">
        
        {/* Left Sidebar: Navigation */}
        <aside className="lg:col-span-3 space-y-4 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar hidden lg:block">
          <div className="glass-panel p-5 bg-[var(--glass-bg)] border-[var(--border)] sticky top-0">
            <h2 className="text-sm font-extrabold mb-4 uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              {lang === 'fr' ? course?.titleFr : course?.titleEn}
            </h2>
            <div className="space-y-6">
              {course?.modules.map((mod: any) => (
                <div key={mod.id} className="space-y-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{mod.weekLabel || `Module ${mod.id}`}</span>
                    <h3 className="text-xs font-bold text-slate-300 leading-tight">
                      {lang === 'fr' ? mod.titleFr : mod.titleEn}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-1 pl-2 border-l-2 border-[var(--border)]">
                    {mod.lessons.map((les: any) => {
                      const isActive = les.id === lesson.id;
                      const isCompleted = user?.courses?.[courseId]?.progress?.[les.id] === true;
                      
                      return (
                        <button
                          key={les.id}
                          onClick={() => router.push(`/dashboard/lessons/${les.id}?courseId=${courseId}`)}
                          className={`text-left text-[11px] py-1.5 px-3 rounded-lg transition-all flex items-center justify-between ${
                            isActive 
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold' 
                              : isCompleted 
                                ? 'text-slate-400 hover:text-slate-300 hover:bg-[var(--bg-tertiary)]' 
                                : 'text-slate-500 hover:text-slate-300 hover:bg-[var(--bg-tertiary)]'
                          }`}
                        >
                          <span className="truncate pr-2">{lang === 'fr' ? les.titleFr : les.titleEn}</span>
                          {isCompleted && <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Lesson content */}
        <section className="lg:col-span-4 space-y-6 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar">
          <div className="glass-panel p-6 space-y-6 bg-[var(--glass-bg)] border-[var(--border)]">
            <div className="prose dark:prose-invert max-w-none text-sm text-[var(--text-secondary)] leading-relaxed">
              <div>
                {parseMarkdown(lang === 'fr' ? lesson.contentFr : lesson.contentEn)}
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                {t.flowchartTitle}
              </h3>
              {renderFlowchart()}
            </div>

            {lesson.attachmentUrl && (
              <div className="border-t border-[var(--border)] pt-6 space-y-3 flex flex-col items-start">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Ressources Téléchargeables</span>
                <a
                  href={lesson.attachmentUrl}
                  download={lesson.attachmentName || 'cours_document.pdf'}
                  className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-emerald-500/40 rounded-xl text-xs font-semibold transition-all w-full group"
                >
                  <svg className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1m8-8v8m0 0l-3-3m3 3l3-3M2 17h20" />
                  </svg>
                  <span className="text-emerald-400 group-hover:underline truncate">{lesson.attachmentName || 'Télécharger le document PDF'}</span>
                </a>
              </div>
            )}

            <div className="border-t border-[var(--border)] pt-6 flex flex-col items-center text-center space-y-4">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Compagnon de Travail Actif</span>
              <LofiStudyAnimation />
              <p className="text-[10px] text-[var(--text-muted)] italic max-w-xs leading-relaxed">
                "Restez concentré, lisez la théorie et testez vos connaissances dans l'éditeur à droite."
              </p>
            </div>
          </div>
        </section>

        {/* Right Side: Playground */}
        <section className="lg:col-span-5 space-y-6 max-h-[85vh] flex flex-col">
          <div className="glass-panel p-5 flex flex-col h-full bg-[var(--glass-bg)] border-[var(--border)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-base">{t.exerciseTitle}</h3>
              </div>
              <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-[10px] font-bold uppercase tracking-widest">
                {lesson.exercise?.lang?.toUpperCase() || 'CODE'}
              </span>
            </div>

            {lesson.exercise && (
              <div className="text-xs font-semibold py-3 px-4 mb-4 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-slate-200 leading-relaxed">
                {lang === 'fr' ? lesson.exercise.questionFr : lesson.exercise.questionEn}
              </div>
            )}

            <div className="flex-1 min-h-[300px] relative rounded-xl overflow-hidden border border-[var(--border)] bg-slate-950 font-mono text-xs p-4 shadow-inner mb-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent resize-none outline-none border-none text-emerald-400 focus:ring-0 font-mono leading-relaxed"
                style={{ tabSize: 2 }}
                spellCheck="false"
              />
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {results && (
              <div className={`p-4 mb-4 rounded-xl border flex items-start gap-3 ${
                results.passed
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
              }`}>
                {results.passed ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                <div className="space-y-1">
                  <h4 className="font-bold text-xs">{results.passed ? t.successMsg : t.failMsg}</h4>
                  {results.error && <p className="text-[10px] font-mono text-red-400 mt-1">Error: {results.error}</p>}
                  <p className="text-[10px] font-bold mt-1">Score: {results.score}%</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 mt-auto">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSubmitCode}
                  disabled={loading || !lesson.exercise}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/10 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {loading ? "Evaluation..." : t.submitBtn}
                </button>

                {results?.passed && (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                  >
                    {t.nextLessonCTA}
                  </button>
                )}
              </div>

              {results?.passed && (lesson.explanationFr || lesson.exercise?.solutionTemplate) && (
                <div className="border-t border-[var(--border)] pt-4 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Correction & Explication de l'Enseignant</span>
                  </div>
                  <div className="p-4 bg-emerald-950/10 border border-emerald-500/20 rounded-xl space-y-2 text-left">
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {lang === 'fr' ? lesson.explanationFr : lesson.explanationEn}
                    </p>
                    {lesson.exercise?.solutionTemplate && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Code Corrigé Type :</span>
                        <pre className="p-3 bg-slate-950 rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto">
                          {lesson.exercise.solutionTemplate}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold">Loading Lesson...</div>}>
      <LessonContent />
    </Suspense>
  );
}
