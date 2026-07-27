'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertCircle, Play, Sparkles, Terminal, Globe, Moon, Sun } from 'lucide-react';
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
    if (lesson.id === '1-1') {
      return (
        <div className="flowchart-container my-6">
          <div className="flowchart-node node-start-end">Début / Start</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Lire Largeur & Hauteur</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Calculer: Aire = Largeur * Hauteur</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Retourner Aire / Area</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-start-end">Fin / End</div>
        </div>
      );
    } else if (lesson.id === '2-1') {
      return (
        <div className="flowchart-container my-6">
          <div className="flowchart-node node-start-end">Début / Start</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Lire Nombre / Read Number</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-decision">Reste (Nombre / 2) == 0 ?</div>
          <div className="flex gap-16 justify-center items-center my-2">
            <div className="text-emerald-500 font-bold text-xs flex flex-col items-center">
              <span>Oui / Yes</span>
              <div className="flowchart-arrow h-12"></div>
              <div className="flowchart-node node-process bg-emerald-500">Retourner True</div>
            </div>
            <div className="text-rose-500 font-bold text-xs flex flex-col items-center">
              <span>Non / No</span>
              <div className="flowchart-arrow h-12"></div>
              <div className="flowchart-node node-process bg-rose-500">Retourner False</div>
            </div>
          </div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-start-end">Fin / End</div>
        </div>
      );
    } else if (lesson.id === '3-1') {
      return (
        <div className="flowchart-container my-6">
          <div className="flowchart-node node-start-end">Début / Start</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Initialiser Somme = 0, i = 1</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-decision">i &lt;= n ?</div>
          <div className="flex gap-12 justify-center items-center my-2">
            <div className="text-emerald-500 font-bold text-xs flex flex-col items-center">
              <span>Oui / Yes</span>
              <div className="flowchart-arrow h-12"></div>
              <div className="flowchart-node node-process bg-blue-600">Somme += i; i++</div>
              <div className="flowchart-arrow h-6"></div>
              <span className="text-[var(--text-muted)] text-[10px]">Boucler vers condition</span>
            </div>
            <div className="text-rose-500 font-bold text-xs flex flex-col items-center">
              <span>Non / No</span>
              <div className="flowchart-arrow h-12"></div>
              <div className="flowchart-node node-process bg-emerald-500">Retourner Somme</div>
            </div>
          </div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-start-end">Fin / End</div>
        </div>
      );
    } else {
      return (
        <div className="flowchart-container my-6">
          <div className="flowchart-node node-start-end">Début / Start</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Lire Tableau [arr] / Read Array</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-process">Calculer Max = Math.max(...arr)</div>
          <div className="flowchart-arrow"></div>
          <div className="flowchart-node node-start-end">Fin / End</div>
        </div>
      );
    }
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Lesson content */}
        <section className="lg:col-span-6 space-y-6 overflow-y-auto max-h-[85vh] pr-2">
          <div className="glass-panel p-6 md:p-8 space-y-6 bg-[var(--glass-bg)] border-[var(--border)]">
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

            {/* Lofi study mascot sitting beside student coding play area */}
            <div className="border-t border-[var(--border)] pt-6 flex flex-col items-center text-center space-y-4">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Compagnon de Travail Actif</span>
              <LofiStudyAnimation />
              <p className="text-[10px] text-[var(--text-muted)] italic max-w-xs leading-relaxed">
                "Restez concentré, écrivez votre fonction dans l'éditeur et testez la validation."
              </p>
            </div>
          </div>
        </section>

        {/* Right Side: Playground */}
        <section className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 space-y-4 flex flex-col h-full bg-[var(--glass-bg)] border-[var(--border)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-base">{t.exerciseTitle}</h3>
              </div>
              <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-[10px] font-bold uppercase tracking-widest">
                {lesson.exercise.lang.toUpperCase()}
              </span>
            </div>

            <div className="text-xs font-semibold py-3 px-4 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-slate-200 leading-relaxed">
              {lang === 'fr' ? lesson.exercise.questionFr : lesson.exercise.questionEn}
            </div>

            <div className="flex-1 min-h-[300px] relative rounded-xl overflow-hidden border border-[var(--border)] bg-slate-950 font-mono text-xs p-4 shadow-inner">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent resize-none outline-none border-none text-emerald-400 focus:ring-0 font-mono leading-relaxed"
                style={{ tabSize: 2 }}
                spellCheck="false"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {results && (
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
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

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={handleSubmitCode}
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/10"
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
