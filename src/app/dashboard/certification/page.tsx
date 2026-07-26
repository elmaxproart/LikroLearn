'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, AlertTriangle, ArrowLeft, CheckCircle2, XCircle, Printer, Globe, Sun, Moon } from 'lucide-react';
import { CERTIFICATION_EXAM_QUESTIONS } from '@/lib/courseData';

export default function CertificationPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Exam state
  const [answers, setAnswers] = useState<number[]>(new Array(5).fill(-1));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passedExam, setPassedExam] = useState<boolean | null>(null);

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

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    const updated = [...answers];
    updated[qIdx] = optIdx;
    setAnswers(updated);
  };

  const handleSubmitExam = async () => {
    if (answers.some((ans) => ans === -1)) {
      setError(lang === 'fr' ? 'Veuillez répondre à toutes les questions.' : 'Please answer all questions.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          answers,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur soumission');
      }

      setPassedExam(data.passed);
      
      // Update local storage
      const updatedUser = { ...user };
      updatedUser.examAttempted = true;
      updatedUser.examScore = data.score;
      updatedUser.examFinishedAt = new Date().toISOString();
      setUser(updatedUser);
      localStorage.setItem('student_user', JSON.stringify(updatedUser));
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  // Verify all lessons completed
  const totalLessons = 4;
  const completedCount = Object.keys(user.progress || {}).filter((k) => user.progress[k] === true).length;
  const isEligible = completedCount >= totalLessons || user.isAdmin;

  const t = {
    fr: {
      back: "Retour au Dashboard",
      examTitle: "Examen de Certification Officielle",
      examSub: "Validez vos acquis sur l'algorithmique, les logigrammes, JS et C.",
      warningTitle: "Attention : Tentative Unique !",
      warningDesc: "Cet examen ne peut être passé qu'une seule fois. Une fois soumis, vos résultats sont définitifs et envoyés à l'administration.",
      submitExam: "Soumettre mes Réponses",
      notEligibleTitle: "Examen Verrouillé",
      notEligibleDesc: `Vous devez d'abord compléter l'ensemble des 4 leçons pratiques pour déverrouiller l'évaluation. (${completedCount}/${totalLessons} complétées)`,
      examPassedTitle: "Félicitations, vous avez réussi !",
      examFailedTitle: "Évaluation Échouée",
      examFailedDesc: "Vous n'avez pas obtenu le score minimum requis de 70%. Votre tentative unique a été consommée. Les résultats ont été archivés pour votre enseignant.",
      certTitle: "CERTIFICAT DE RÉUSSITE",
      certSub: "Ce document officiel certifie que",
      certCourse: "a complété avec succès le cursus de certification",
      certCourseName: "Algorithmique & Fondamentaux de Programmation (JS & C)",
      certAuthorSign: "Signature de l'Auteur",
      certProductSign: "Produit de Lickrotechnologie",
      printCert: "Imprimer / Télécharger le Certificat",
      scoreEarned: "Score obtenu",
      dateText: "Délivré le"
    },
    en: {
      back: "Back to Dashboard",
      examTitle: "Official Certification Exam",
      examSub: "Validate your knowledge on algorithms, flowcharts, JS, and C.",
      warningTitle: "Warning: Single Attempt Only!",
      warningDesc: "This exam can only be taken once. Once submitted, your scores are final and registered with the administration.",
      submitExam: "Submit Answers",
      notEligibleTitle: "Exam Locked",
      notEligibleDesc: `You must complete all 4 practical lessons to unlock the certification exam. (${completedCount}/${totalLessons} completed)`,
      examPassedTitle: "Congratulations, you passed!",
      examFailedTitle: "Certification Failed",
      examFailedDesc: "You did not achieve the required passing score of 70%. Your single attempt is exhausted. Results are archived for the administrator.",
      certTitle: "CERTIFICATE OF COMPLETION",
      certSub: "This official document certifies that",
      certCourse: "has successfully completed the certification curriculum",
      certCourseName: "Algorithmics & Programming Fundamentals (JS & C)",
      certAuthorSign: "Author Signature",
      certProductSign: "Product of Lickrotechnologie",
      printCert: "Print / Download Certificate",
      scoreEarned: "Score obtained",
      dateText: "Issued on"
    }
  }[lang];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header (hidden during print) */}
      <header className="sticky top-0 z-50 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between print:hidden">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors"
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

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        
        {/* Scenario 1: Not Eligible (locked) */}
        {!isEligible && (
          <div className="glass-panel p-8 text-center space-y-4 max-w-md mx-auto">
            <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
            <h2 className="text-2xl font-bold">{t.notEligibleTitle}</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {t.notEligibleDesc}
            </p>
          </div>
        )}

        {/* Scenario 2: Eligible & Not Yet Attempted */}
        {isEligible && !user.examAttempted && (
          <div className="space-y-8">
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-blue-500" />
                <div>
                  <h1 className="text-2xl font-bold">{t.examTitle}</h1>
                  <p className="text-sm text-[var(--text-muted)]">{t.examSub}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm flex gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">{t.warningTitle}</h4>
                  <p className="text-xs mt-1">{t.warningDesc}</p>
                </div>
              </div>
            </div>

            {/* Questions list */}
            <div className="space-y-6">
              {CERTIFICATION_EXAM_QUESTIONS.map((q, qIdx) => (
                <div key={q.id} className="glass-panel p-6 space-y-4">
                  <h3 className="font-bold text-base">
                    {qIdx + 1}. {lang === 'fr' ? q.questionFr : q.questionEn}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(lang === 'fr' ? q.optionsFr : q.optionsEn).map((option, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(qIdx, optIdx)}
                        className={`p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                          answers[qIdx] === optIdx
                            ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                            : 'border-[var(--border)] hover:bg-[var(--bg-tertiary)]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-center font-bold text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmitExam}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 text-base"
            >
              {loading ? "Calcul du score..." : t.submitExam}
            </button>
          </div>
        )}

        {/* Scenario 3: Attempted & Passed (Certificate) */}
        {isEligible && user.examAttempted && user.examScore >= 70 && (
          <div className="space-y-8 py-6">
            
            {/* The Certificate card */}
            <div className="bg-white text-slate-900 border-8 border-slate-800 rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden shadow-2xl print:border-4 print:p-6 print:shadow-none mx-auto max-w-4xl" style={{ fontFamily: 'Georgia, serif' }}>
              
              {/* Decorative borders */}
              <div className="absolute inset-4 border border-slate-300 rounded-2xl pointer-events-none"></div>
              
              <div className="text-center space-y-6 relative z-10">
                <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-500 mb-2">
                  <Award className="w-16 h-16" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-slate-800 border-b border-slate-300 pb-4 max-w-md mx-auto">
                  {t.certTitle}
                </h1>
                <p className="text-sm italic text-slate-500 uppercase tracking-widest">
                  {t.certSub}
                </p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-blue-600 my-4" style={{ fontFamily: 'var(--font-sans)' }}>
                  {user.name}
                </h2>
                <p className="text-sm text-slate-500 max-w-lg mx-auto">
                  {t.certCourse}
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 italic my-2">
                  {t.certCourseName}
                </h3>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-sans">
                  {t.scoreEarned}: {user.examScore}% | {t.dateText}: {new Date(user.examFinishedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 mt-12 relative z-10 text-center font-sans">
                <div className="space-y-2">
                  <p className="text-base italic font-serif text-blue-700 text-2xl" style={{ fontFamily: '"Great Vibes", cursive, sans-serif' }}>
                    Tene Bana Maxym
                  </p>
                  <div className="w-24 h-0.5 bg-slate-400 mx-auto"></div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{t.certAuthorSign}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-base font-extrabold tracking-tight text-slate-800">
                    lickrotechLearn
                  </p>
                  <div className="w-24 h-0.5 bg-slate-400 mx-auto"></div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{t.certProductSign}</p>
                </div>
              </div>

              {/* Holographic badge in background */}
              <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-slate-50 border-4 border-slate-200 opacity-20 pointer-events-none flex items-center justify-center">
                <span className="text-slate-300 font-extrabold text-sm uppercase">VERIFIED</span>
              </div>
            </div>

            {/* Actions (hidden in print) */}
            <div className="text-center print:hidden">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                <Printer className="w-5 h-5" />
                {t.printCert}
              </button>
            </div>
          </div>
        )}

        {/* Scenario 4: Attempted & Failed */}
        {isEligible && user.examAttempted && user.examScore < 70 && (
          <div className="glass-panel p-8 text-center space-y-6 max-w-md mx-auto">
            <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
            <h2 className="text-2xl font-bold text-rose-500">{t.examFailedTitle}</h2>
            <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">{t.scoreEarned}</span>
              <p className="text-3xl font-extrabold text-rose-500 mt-1">{user.examScore}%</p>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {t.examFailedDesc}
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
