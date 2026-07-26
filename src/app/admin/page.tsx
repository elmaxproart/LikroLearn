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

  if (loading && !metrics) return <div className="p-8 text-center">Loading Admin Panel...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between">
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Console Supervision Lickrotechnologie</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Supervision de lickrotechLearn par l'auteur <strong>Tene Bana Maxym</strong>.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* 18 KPIs Dashboard Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-500">
            <BarChart3 className="w-5 h-5" />
            Tableau de Bord KPI (18 Indicateurs de Performance)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* KPI 1 */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">1. Total Étudiants</span>
              <p className="text-2xl font-bold mt-1 text-blue-500">{metrics?.totalStudents || 0}</p>
            </div>
            {/* KPI 2 */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">2. Actifs 24h</span>
              <p className="text-2xl font-bold mt-1 text-emerald-500">{metrics?.active24h || 0}</p>
            </div>
            {/* KPI 3 */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">3. Taux Complétion</span>
              <p className="text-2xl font-bold mt-1">{metrics?.completionRate || 0}%</p>
            </div>
            {/* KPI 4 */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">4. Ex. Soumis</span>
              <p className="text-2xl font-bold mt-1">{metrics?.totalExercisesAnswered || 0}</p>
            </div>
            {/* KPI 5 */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">5. Réussite Examen</span>
              <p className="text-2xl font-bold mt-1">{metrics?.passRate || 0}%</p>
            </div>
            {/* KPI 6 */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">6. Succès 1er essai</span>
              <p className="text-2xl font-bold mt-1 text-amber-500">{metrics?.firstTimeSuccessRate || 0}%</p>
            </div>

            {/* Row 2 */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">7. Note Moy. Examen</span>
              <p className="text-2xl font-bold mt-1">{metrics?.avgExamScore || 0}%</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">8. Certificats Émis</span>
              <p className="text-2xl font-bold mt-1 text-indigo-500">{metrics?.totalCertificates || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">9. Temps Lecture</span>
              <p className="text-2xl font-bold mt-1 text-slate-400">{metrics?.avgReadTimeEstimate || 0}m</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">10. Préférence FR</span>
              <p className="text-2xl font-bold mt-1">{metrics?.langFr || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">11. Préférence EN</span>
              <p className="text-2xl font-bold mt-1">{metrics?.langEn || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">12. Bloqué Captcha</span>
              <p className="text-2xl font-bold mt-1 text-rose-500">{metrics?.recaptchaBlocks || 0}</p>
            </div>

            {/* Row 3 */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">13. Vercel Blob Calls</span>
              <p className="text-2xl font-bold mt-1">{metrics?.blobApiCalls || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">14. DAU (Actifs Jour)</span>
              <p className="text-2xl font-bold mt-1 text-teal-500">{metrics?.dau || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">15. Prog. Moyen</span>
              <p className="text-2xl font-bold mt-1">{metrics?.avgProgress || 0}%</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">16. Temps Moyen Cert</span>
              <p className="text-2xl font-bold mt-1 text-violet-500">{metrics?.avgCertTimeHours || 0}h</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">17. Soumissions JS</span>
              <p className="text-2xl font-bold mt-1">{metrics?.totalJsSubmissions || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium">18. Status Système</span>
              <p className="text-xs font-bold mt-2 text-emerald-500">{metrics?.systemStatus}</p>
            </div>
          </div>
        </section>

        {/* Students Table */}
        <section className="glass-panel overflow-hidden">
          <div className="p-6 bg-[var(--bg-tertiary)] border-b border-[var(--border)]">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Répertoire et Progression des Candidats
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--bg-tertiary)] text-[var(--text-muted)] uppercase text-xs font-bold border-b border-[var(--border)]">
                  <th className="p-4">Étudiant</th>
                  <th className="p-4">Langue</th>
                  <th className="p-4">Date Inscription</th>
                  <th className="p-4">Leçons validées</th>
                  <th className="p-4">Examen Tenté</th>
                  <th className="p-4">Score Certif</th>
                  <th className="p-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {students.map((student) => {
                  const completedLessonsCount = Object.keys(student.progress || {}).filter(
                    (k) => student.progress[k] === true
                  ).length;

                  return (
                    <tr key={student.email} className="hover:bg-[var(--bg-tertiary)]/20 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-base">{student.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{student.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-[var(--bg-tertiary)] text-xs font-bold uppercase">
                          {student.lang}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-[var(--text-muted)]">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-semibold text-center sm:text-left">
                        {completedLessonsCount} / 4
                      </td>
                      <td className="p-4">
                        {student.examAttempted ? (
                          <span className="text-emerald-500 font-bold flex items-center gap-1 text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            Oui / Yes
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)] font-medium flex items-center gap-1 text-xs">
                            <XCircle className="w-4 h-4" />
                            Non / No
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-base">
                        {student.examScore !== null ? `${student.examScore}%` : '-'}
                      </td>
                      <td className="p-4">
                        {student.examScore !== null && student.examScore >= 70 ? (
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-bold uppercase">
                            Certifié
                          </span>
                        ) : student.examAttempted ? (
                          <span className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-xs font-bold uppercase">
                            Échoué
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold uppercase">
                            En cours
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[var(--text-muted)]">
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
