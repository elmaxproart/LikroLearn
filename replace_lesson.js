const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/dashboard/lessons/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the states
const stateStart = content.indexOf('  const [lesson, setLesson] = useState<any>(null);');
if (stateStart !== -1) {
    content = content.slice(0, stateStart) + 
      '  const [course, setCourse] = useState<any>(null);\n' + 
      content.slice(stateStart);
}

// Replace the setLesson
const setLessonStart = content.indexOf('    setLesson(target);');
if (setLessonStart !== -1) {
    content = content.slice(0, setLessonStart) + 
      '    setCourse(course);\n' + 
      content.slice(setLessonStart);
}

// Add BookOpen icon import
const iconImportStart = content.indexOf('import { ArrowLeft, CheckCircle2, AlertCircle, Play, Sparkles, Terminal, Globe, Moon, Sun } from \'lucide-react\';');
if (iconImportStart !== -1) {
    content = content.replace(
      'import { ArrowLeft, CheckCircle2, AlertCircle, Play, Sparkles, Terminal, Globe, Moon, Sun } from \'lucide-react\';',
      'import { ArrowLeft, CheckCircle2, AlertCircle, Play, Sparkles, Terminal, Globe, Moon, Sun, BookOpen, ChevronRight, Check } from \'lucide-react\';'
    );
}

// Replace the <main> block
const mainStart = content.indexOf('      {/* Main content columns */}');
const mainEnd = content.indexOf('      </main>');
if (mainStart !== -1 && mainEnd !== -1) {
    const newMain = `      {/* Main content columns */}
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
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{mod.weekLabel || \`Module \${mod.id}\`}</span>
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
                          onClick={() => router.push(\`/dashboard/lessons/\${les.id}?courseId=\${courseId}\`)}
                          className={\`text-left text-[11px] py-1.5 px-3 rounded-lg transition-all flex items-center justify-between \${
                            isActive 
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold' 
                              : isCompleted 
                                ? 'text-slate-400 hover:text-slate-300 hover:bg-[var(--bg-tertiary)]' 
                                : 'text-slate-500 hover:text-slate-300 hover:bg-[var(--bg-tertiary)]'
                          }\`}
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
              <div className={\`p-4 mb-4 rounded-xl border flex items-start gap-3 \${
                results.passed
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
              }\`}>
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
`;
    content = content.slice(0, mainStart) + newMain + content.slice(mainEnd);
}

fs.writeFileSync(filePath, content);
console.log('Successfully replaced layout of lesson page.');
