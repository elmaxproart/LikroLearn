const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/dashboard/lessons/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const startStr = '  const renderFlowchart = () => {';
const endStr = '\n  return (';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.error('Boundaries not found', { startIndex, endIndex });
  process.exit(1);
}

const newFunction = `  const renderFlowchart = () => {
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

`;

content = content.slice(0, startIndex) + newFunction + content.slice(endIndex);
fs.writeFileSync(filePath, content);
console.log('Done: renderFlowchart updated with per-lesson flowcharts and null fallback.');
