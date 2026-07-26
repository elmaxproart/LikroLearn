'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, BarChart3, Clock, AlertOctagon, RefreshCw, FileText, CheckCircle2, XCircle, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/metrics');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load metrics');
      }
      setMetrics(data.kpis);
      setStudents(data.students || []);
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auth Check
    const stored = localStorage.getItem('student_user');
    if (!stored) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(stored);
    if (!parsed.isAdmin) {
      router.push('/dashboard');
      return;
    }

    fetchMetrics();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('student_user');
    router.push('/');
  };

  if (loading && !metrics) return <div className="p-8 text-center text-sm font-semibold">Loading Admin Panel...</div>;

  const targetCourseId = "algo-101";

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Background Mesh */}
      <div className="grid-bg"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg">L</div>
          <div>
            <span className="font-extrabold tracking-tight text-lg">lickrotech</span>
            <span className="text-blue-500 font-semibold text-sm ml-1">Learn Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchMetrics}
            className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className="w-4 h-4 text-blue-500" />
          </button>
          
          <button onClick={handleLogout} className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-full transition-colors flex items-center gap-2 text-sm font-medium">
            <LogOut className="w-4 h-4" />
            <span>Quitter / Exit</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Supervision Académique Lickrotechnologie</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1 uppercase tracking-widest">
            Auteur-Superviseur : <strong className="text-blue-500">Tene Bana Maxym</strong>
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* 18 KPIs Dashboard Grid */}
        <section className="space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2 text-blue-500 uppercase tracking-widest">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Indicateurs Clés de Performance (18 KPIs)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">1. Candidats</span>
              <p className="text-2xl font-bold mt-1 text-blue-400">{metrics?.totalStudents || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">2. Actifs 24h</span>
              <p className="text-2xl font-bold mt-1 text-emerald-400">{metrics?.active24h || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">3. Complétion</span>
              <p className="text-2xl font-bold mt-1 text-slate-200">{metrics?.completionRate || 0}%</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">4. Soumissions</span>
              <p className="text-2xl font-bold mt-1 text-slate-200">{metrics?.totalExercisesAnswered || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">5. Taux Réussite</span>
              <p className="text-2xl font-bold mt-1 text-slate-200">{metrics?.passRate || 0}%</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">6. Succès 1er Essai</span>
              <p className="text-2xl font-bold mt-1 text-amber-500">{metrics?.firstTimeSuccessRate || 0}%</p>
            </div>

            {/* Row 2 */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">7. Note Moyenne</span>
              <p className="text-2xl font-bold mt-1 text-slate-200">{metrics?.avgExamScore || 0}%</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">8. Certificats Émis</span>
              <p className="text-2xl font-bold mt-1 text-indigo-400">{metrics?.totalCertificates || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">9. Temps Moyen</span>
              <p className="text-2xl font-bold mt-1 text-slate-400">{metrics?.avgReadTimeEstimate || 0}m</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">10. Candidats FR</span>
              <p className="text-2xl font-bold mt-1 text-slate-200">{metrics?.langFr || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">11. Candidats EN</span>
              <p className="text-2xl font-bold mt-1 text-slate-200">{metrics?.langEn || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">12. Bots Bloqués</span>
              <p className="text-2xl font-bold mt-1 text-rose-500">{metrics?.recaptchaBlocks || 0}</p>
            </div>

            {/* Row 3 */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">13. Vercel Blob Calls</span>
              <p className="text-2xl font-bold mt-1 text-slate-200">{metrics?.blobApiCalls || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">14. DAU (Actifs Jour)</span>
              <p className="text-2xl font-bold mt-1 text-teal-400">{metrics?.dau || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">15. Progrès Moyen</span>
              <p className="text-2xl font-bold mt-1 text-slate-200">{metrics?.avgProgress || 0}%</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">16. Temps Certif</span>
              <p className="text-2xl font-bold mt-1 text-violet-400">{metrics?.avgCertTimeHours || 0}h</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">17. Soumissions JS</span>
              <p className="text-2xl font-bold mt-1 text-slate-200">{metrics?.totalJsSubmissions || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">18. Latence API</span>
              <p className="text-xs font-bold mt-2.5 text-emerald-400">{metrics?.systemStatus}</p>
            </div>
          </div>
        </section>

        {/* Student database table */}
        <section className="glass-panel overflow-hidden border-[var(--border)] shadow-xl">
          <div className="p-6 bg-[var(--bg-tertiary)]/50 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold flex items-center gap-2 uppercase tracking-wider">
              <Users className="w-5 h-5 text-blue-500" />
              Répertoire et Progression des Candidats
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg-tertiary)] text-[var(--text-muted)] uppercase text-[10px] font-bold border-b border-[var(--border)]">
                  <th className="p-4">Candidat</th>
                  <th className="p-4">Langue</th>
                  <th className="p-4">Inscription</th>
                  <th className="p-4">Chapitres validés (Algo)</th>
                  <th className="p-4">Examen Tenté (Algo)</th>
                  <th className="p-4">Score Certif (Algo)</th>
                  <th className="p-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {students.map((student) => {
                  const enrollment = student.courses ? student.courses[targetCourseId] : null;
                  const completedLessonsCount = enrollment
                    ? Object.keys(enrollment.progress || {}).filter((k) => enrollment.progress[k] === true).length
                    : 0;

                  return (
                    <tr key={student.email} className="hover:bg-[var(--bg-tertiary)]/20 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-sm text-[var(--text-primary)]">{student.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{student.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)] font-bold uppercase">
                          {student.lang}
                        </span>
                      </td>
                      <td className="p-4 text-[10px] text-[var(--text-muted)]">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-semibold">
                        {enrollment ? `${completedLessonsCount} / 4` : 'Non inscrit'}
                      </td>
                      <td className="p-4">
                        {enrollment?.examAttempted ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Oui / Yes
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)] font-medium flex items-center gap-1 text-[10px]">
                            <XCircle className="w-3.5 h-3.5" />
                            Non / No
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-sm text-[var(--text-primary)]">
                        {enrollment?.examScore !== null ? `${enrollment?.examScore}%` : '-'}
                      </td>
                      <td className="p-4">
                        {enrollment?.examScore !== null && enrollment?.examScore >= 70 ? (
                          <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold uppercase tracking-wider text-[9px]">
                            Certifié
                          </span>
                        ) : enrollment?.examAttempted ? (
                          <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full font-bold uppercase tracking-wider text-[9px]">
                            Échoué
                          </span>
                        ) : enrollment ? (
                          <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-bold uppercase tracking-wider text-[9px]">
                            En cours
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-full font-bold uppercase tracking-wider text-[9px]">
                            Aucun
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs text-[var(--text-muted)]">
                      Aucun candidat inscrit pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
export const dynamic = 'force-dynamic';
