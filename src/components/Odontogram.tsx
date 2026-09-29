import React, { useState, useMemo, useEffect } from 'react';
import { Patient, ToothFinding, ToothSurface, ConditionType, ConditionMeta } from '../types';
import { CONDITION_METAS } from '../data/mockData';
import { AlertCircle, CheckCircle2, FileText, Printer, Trash2, Plus, Info, Sparkles, Search, Filter, Check } from 'lucide-react';

interface OdontogramProps {
  patient: Patient;
  onUpdateFindings: (patientId: string, newFindings: ToothFinding[]) => void;
  conditionColors?: Record<ConditionType, string>;
}

// FDI Quadrants Adult
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_LEFT  = [31, 32, 33, 34, 35, 36, 37, 38];

// FDI Deciduous (Primary teeth)
const PRIMARY_UPPER_RIGHT = [55, 54, 53, 52, 51];
const PRIMARY_UPPER_LEFT  = [61, 62, 63, 64, 65];
const PRIMARY_LOWER_RIGHT = [85, 84, 83, 82, 81];
const PRIMARY_LOWER_LEFT  = [71, 72, 73, 74, 75];

const TOOTH_LEVEL_CONDITIONS: ConditionType[] = [
  'ausente',
  'extraido',
  'corona',
  'endodoncia',
  'extraccion_indicada',
  'puente',
  'implante',
  'protesis_removible',
  'protesis_total',
  'perno',
  'sellador',
  'erupcion',
  'retenido',
  'supernumerario'
];

export const Odontogram: React.FC<OdontogramProps> = ({ patient, onUpdateFindings, conditionColors }) => {
  const [selectedCondition, setSelectedCondition] = useState<ConditionType>('caries_np');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(16);
  const [selectedSurface, setSelectedSurface] = useState<ToothSurface>('oclusal');
  const [lastAppliedMsg, setLastAppliedMsg] = useState<string | null>(null);

  const [isPrimaryTeethView, setIsPrimaryTeethView] = useState<boolean>(false);
  const [notesInput, setNotesInput] = useState<string>('');
  const [bridgeStartTooth, setBridgeStartTooth] = useState<number | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const findings = patient.odontogramFindings || [];

  // Cargar automáticamente la nota guardada de la pieza seleccionada
  useEffect(() => {
    if (selectedTooth !== null) {
      const existingWithNote = findings.find(f => f.toothNumber === selectedTooth && f.notes);
      setNotesInput(existingWithNote?.notes || '');
    } else {
      setNotesInput('');
    }
  }, [selectedTooth, findings]);

  const handleSaveToothNote = (toothNum: number | null, noteText: string) => {
    if (!toothNum) return;
    const trimmed = noteText.trim();
    const toothFindings = findings.filter(f => f.toothNumber === toothNum);

    let updated: ToothFinding[];

    if (toothFindings.length > 0) {
      // Actualizar la nota en todos los hallazgos existentes de esta pieza
      updated = findings.map(f => {
        if (f.toothNumber === toothNum) {
          return { ...f, notes: trimmed };
        }
        return f;
      });
    } else {
      // Si la pieza no tenía un hallazgo registrado aún, agregar un registro con la nota
      if (trimmed) {
        const newFinding: ToothFinding = {
          id: 'find-note-' + Date.now(),
          toothNumber: toothNum,
          surface: 'pieza',
          condition: 'sano',
          date: new Date().toISOString().split('T')[0],
          notes: trimmed
        };
        updated = [...findings, newFinding];
      } else {
        updated = findings;
      }
    }

    onUpdateFindings(patient.id, updated);
    setLastAppliedMsg(`Nota guardada para la Pieza #${toothNum}.`);
    setTimeout(() => setLastAppliedMsg(null), 3000);
  };

  // Combine default CONDITION_METAS with user custom colors from Settings
  const activeConditionMetas: Record<ConditionType, ConditionMeta> = useMemo(() => {
    const map = { ...CONDITION_METAS };
    if (conditionColors) {
      (Object.keys(map) as ConditionType[]).forEach(key => {
        if (conditionColors[key]) {
          map[key] = { ...map[key], color: conditionColors[key] };
        }
      });
    }
    return map;
  }, [conditionColors]);

  const ARCH_SEQUENCES = [
    [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
    [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
    [85, 84, 83, 82, 81, 71, 72, 73, 74, 75]
  ];

  // Helper to find condition for a tooth surface
  const getFindingForSurface = (toothNum: number, surface: ToothSurface) => {
    return findings.find(f => f.toothNumber === toothNum && f.surface === surface);
  };

  // Helper to find tooth-level condition
  const getToothLevelFinding = (toothNum: number) => {
    return findings.find(f => f.toothNumber === toothNum && (
      f.surface === 'pieza' || 
      TOOTH_LEVEL_CONDITIONS.includes(f.condition)
    ));
  };

  // Función principal para APLICAR una condición al diente seleccionado
  const applyConditionToTooth = (toothNum: number, surface: ToothSurface, cond: ConditionType) => {
    let targetSurface: ToothSurface = surface;
    if (TOOTH_LEVEL_CONDITIONS.includes(cond)) {
      targetSurface = 'pieza';
    }

    const existingIndex = findings.findIndex(f => f.toothNumber === toothNum && f.surface === targetSurface);
    let updated: ToothFinding[];
    const meta = activeConditionMetas[cond];

    if (cond === 'sano') {
      updated = findings.filter(f => !(f.toothNumber === toothNum && (f.surface === targetSurface || targetSurface === 'pieza')));
      setLastAppliedMsg(`Pieza #${toothNum} (${targetSurface}) marcada como Sana.`);
    } else {
      const newFinding: ToothFinding = {
        id: 'find-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        toothNumber: toothNum,
        surface: targetSurface,
        condition: cond,
        date: new Date().toISOString().split('T')[0],
        notes: notesInput || meta?.label || ''
      };

      if (existingIndex >= 0) {
        updated = [...findings];
        updated[existingIndex] = newFinding;
      } else {
        updated = [...findings, newFinding];
      }
      setLastAppliedMsg(`Aplicado '${meta?.label}' en Pieza #${toothNum} (${targetSurface}).`);
    }

    onUpdateFindings(patient.id, updated);

    // Auto-ocultar notificación
    setTimeout(() => {
      setLastAppliedMsg(null);
    }, 3500);
  };

  // PASO 1: Al hacer clic en una superficie o pieza dental
  const handleSurfaceClick = (toothNum: number, surface: ToothSurface, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTooth(toothNum);
    setSelectedSurface(surface);

    // Manejo de Puente Fijo (Pilar 1 -> Pilar 2)
    if (selectedCondition === 'puente') {
      if (bridgeStartTooth === null) {
        setBridgeStartTooth(toothNum);
      } else {
        const startNum = bridgeStartTooth;
        const endNum = toothNum;
        setBridgeStartTooth(null);

        if (startNum === endNum) return;

        const seq = ARCH_SEQUENCES.find(s => s.includes(startNum) && s.includes(endNum));
        if (!seq) {
          alert("Para crear un puente fijo, ambas piezas deben estar en la misma arcada.");
          return;
        }

        const idx1 = seq.indexOf(startNum);
        const idx2 = seq.indexOf(endNum);
        const minIdx = Math.min(idx1, idx2);
        const maxIdx = Math.max(idx1, idx2);

        const bridgeTeeth = seq.slice(minIdx, maxIdx + 1);
        const p1 = seq[minIdx];
        const p2 = seq[maxIdx];

        let updated = findings.filter(f => !bridgeTeeth.includes(f.toothNumber));
        const today = new Date().toISOString().split('T')[0];

        const bridgeFindingsToAdd: ToothFinding[] = bridgeTeeth.map(tNum => {
          const isPilar = tNum === p1 || tNum === p2;
          return {
            id: 'find-bridge-' + tNum + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            toothNumber: tNum,
            surface: 'pieza',
            condition: 'puente',
            date: today,
            bridgeStart: p1,
            bridgeEnd: p2,
            bridgeRole: isPilar ? 'pilar' : 'pontico',
            notes: isPilar 
              ? `Puente Fijo (Pilar #${p1} a #${p2})` 
              : `Puente Fijo (Póntico Intermedio #${p1} a #${p2})`
          };
        });

        onUpdateFindings(patient.id, [...updated, ...bridgeFindingsToAdd]);
      }
      return;
    }

    if (bridgeStartTooth !== null) setBridgeStartTooth(null);
  };

  // PASO 2: Al seleccionar una condición o tratamiento del panel
  const handleSelectCondition = (condition: ConditionType) => {
    setSelectedCondition(condition);

    // Si ya se eligió una pieza dentaria (Paso 1), aplicar inmediatamente la condición a esa pieza (Paso 2)
    if (selectedTooth !== null) {
      applyConditionToTooth(selectedTooth, selectedSurface, condition);
    }
  };

  const handleRemoveFinding = (findingId: string) => {
    const updated = findings.filter(f => f.id !== findingId);
    onUpdateFindings(patient.id, updated);
  };

  // Helper to render individual surface polygon with custom face styles
  const renderSurfacePolygon = (toothNum: number, surface: ToothSurface, points: string, title: string) => {
    const finding = getFindingForSurface(toothNum, surface);
    const isSelectedFace = toothNum === selectedTooth && surface === selectedSurface;

    let fill = '#ffffff';
    let stroke = '#64748b';
    let strokeWidth = '2.5';

    if (finding) {
      const meta = activeConditionMetas[finding.condition];
      if (finding.condition === 'obturacion_defectuosa') {
        fill = activeConditionMetas['caries_np']?.color || '#ef4444'; // Rojo caries
        stroke = '#2563eb'; // Bordes azules
        strokeWidth = '4.5';
      } else if (finding.condition === 'desgaste') {
        fill = '#e0f2fe'; // Fondo celeste suave
        stroke = meta?.color || '#06b6d4'; // Línea celeste
        strokeWidth = '5';
      } else if (finding.condition === 'surco_profundo') {
        fill = '#fee2e2'; // Fondo rojo suave
        stroke = meta?.color || '#dc2626'; // Rojo
        strokeWidth = '4';
      } else if (finding.condition === 'fractura') {
        fill = '#fee2e2'; // Fondo rojo suave
        stroke = meta?.color || '#dc2626'; // Rojo
        strokeWidth = '3';
      } else if (finding.condition === 'incrustacion') {
        fill = meta?.color || '#06b6d4'; // Celeste
        stroke = '#0284c7';
        strokeWidth = '3';
      } else {
        fill = meta?.color || '#ffffff';
      }
    }

    if (isSelectedFace && !finding) {
      stroke = '#10b981'; // Verde esmeralda para la cara seleccionada
      strokeWidth = '4.5';
    }

    return (
      <g key={surface}>
        <polygon 
          points={points} 
          fill={fill} 
          stroke={stroke} 
          strokeWidth={strokeWidth}
          className="hover:opacity-80 transition-opacity cursor-pointer"
          onClick={(e) => handleSurfaceClick(toothNum, surface, e)}
        >
          <title>Diente {toothNum} - {title}</title>
        </polygon>

        {/* Resaltado Selección Activa de Cara */}
        {isSelectedFace && (
          <polygon 
            points={points} 
            fill="rgba(16, 185, 129, 0.25)" 
            stroke="#10b981" 
            strokeWidth="5" 
            pointerEvents="none"
          />
        )}

        {/* Línea celeste por cara dental cuando hay Desgaste/Bruxismo */}
        {finding?.condition === 'desgaste' && (
          <line 
            x1={surface === 'vestibular' ? '25' : surface === 'lingual' ? '25' : surface === 'mesial' ? '12' : surface === 'distal' ? '88' : '30'}
            y1={surface === 'vestibular' ? '12' : surface === 'lingual' ? '88' : surface === 'mesial' ? '25' : surface === 'distal' ? '25' : '50'}
            x2={surface === 'vestibular' ? '75' : surface === 'lingual' ? '75' : surface === 'mesial' ? '12' : surface === 'distal' ? '88' : '70'}
            y2={surface === 'vestibular' ? '12' : surface === 'lingual' ? '88' : surface === 'mesial' ? '75' : surface === 'distal' ? '75' : '50'}
            stroke="#06b6d4"
            strokeWidth="6"
            strokeLinecap="round"
            pointerEvents="none"
          />
        )}

        {/* Raya horizontal roja cuando hay Surco Profundo */}
        {finding?.condition === 'surco_profundo' && (
          <line 
            x1={surface === 'vestibular' ? '20' : surface === 'lingual' ? '20' : surface === 'mesial' ? '6' : surface === 'distal' ? '78' : '30'}
            y1={surface === 'vestibular' ? '13' : surface === 'lingual' ? '87' : surface === 'mesial' ? '50' : surface === 'distal' ? '50' : '50'}
            x2={surface === 'vestibular' ? '80' : surface === 'lingual' ? '80' : surface === 'mesial' ? '22' : surface === 'distal' ? '94' : '70'}
            y2={surface === 'vestibular' ? '13' : surface === 'lingual' ? '87' : surface === 'mesial' ? '50' : surface === 'distal' ? '50' : '50'}
            stroke="#dc2626"
            strokeWidth="6"
            strokeLinecap="round"
            pointerEvents="none"
          />
        )}

        {/* Rayito / Fractura por cara en ROJO */}
        {finding?.condition === 'fractura' && (
          <polyline 
            points={
              surface === 'vestibular' ? '38,6 55,14 44,16 62,23' :
              surface === 'lingual' ? '38,78 55,86 44,88 62,95' :
              surface === 'mesial' ? '6,38 14,55 16,44 23,62' :
              surface === 'distal' ? '78,38 86,55 88,44 95,62' :
              '35,35 55,48 45,52 65,65'
            }
            fill="none" 
            stroke="#dc2626" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            pointerEvents="none"
          />
        )}
      </g>
    );
  };

  // Render individual Tooth SVG component
  const renderToothSVG = (toothNum: number) => {
    const toothLevel = getToothLevelFinding(toothNum);
    const isSelected = selectedTooth === toothNum;

    const hasCariesNP = findings.some(f => f.toothNumber === toothNum && f.condition === 'caries_np');
    const hasCariesP = findings.some(f => f.toothNumber === toothNum && f.condition === 'caries_p');
    
    const condId = toothLevel?.condition;
    const condColor = condId ? (activeConditionMetas[condId]?.color || '#ef4444') : '#ef4444';

    const isAusente = condId === 'ausente';
    const isExtraido = condId === 'extraido';
    const isCorona = condId === 'corona';
    const isEndodoncia = condId === 'endodoncia';
    const isExtraccionIndicada = condId === 'extraccion_indicada';
    const isPuente = condId === 'puente';
    const isImplante = condId === 'implante';
    const isPerno = condId === 'perno';
    const isSellador = condId === 'sellador';
    const isProtesisRemovible = condId === 'protesis_removible';
    const isProtesisTotal = condId === 'protesis_total';
    const isErupcion = condId === 'erupcion';
    const isRetenido = condId === 'retenido';
    const isSupernumerario = condId === 'supernumerario';

    const bridgeRole = toothLevel?.bridgeRole || (toothNum === toothLevel?.bridgeStart || toothNum === toothLevel?.bridgeEnd ? 'pilar' : 'pontico');
    const isBridgePilar = isPuente && bridgeRole === 'pilar';
    const isBridgePontico = isPuente && bridgeRole === 'pontico';
    const isBridgePendingStart = selectedCondition === 'puente' && bridgeStartTooth === toothNum;

    return (
      <div 
        key={toothNum} 
        onClick={() => setSelectedTooth(toothNum)}
        className={`relative flex flex-col items-center p-1.5 rounded-xl transition-all cursor-pointer select-none ${
          isSelected 
            ? 'bg-emerald-50 ring-2 ring-emerald-500 shadow-md scale-105 z-10' 
            : 'hover:bg-slate-100 hover:scale-102'
        }`}
      >
        <span className="text-xs font-extrabold text-slate-600 mb-1 tracking-wider flex items-center gap-1">
          {toothNum}
          {hasCariesNP && <span className="text-[10px] font-black text-red-600 bg-red-100 border border-red-300 px-1 rounded shadow-2xs">NP</span>}
          {hasCariesP && <span className="text-[10px] font-black text-red-700 bg-red-200 border border-red-400 px-1 rounded shadow-2xs">P</span>}
          {isEndodoncia && <span className="text-[10px] font-black text-blue-600 bg-blue-100 border border-blue-300 px-1 rounded shadow-2xs">TC</span>}
          {isPuente && <span className="text-[10px]" style={{ color: condColor }}>🌉</span>}
          {isImplante && <span className="text-[10px]" style={{ color: condColor }}>🔩</span>}
        </span>

        {/* Tooth SVG Diagram (5 interactive surface polygons + dynamic overlays) */}
        <div className="relative w-11 h-11">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            {/* Background Tooth Box */}
            <rect x="2" y="2" width="96" height="96" rx="12" fill="#f8fafc" stroke={isSelected ? '#10b981' : '#cbd5e1'} strokeWidth={isSelected ? '4' : '3'} />

            {/* Render 5 Surfaces */}
            {renderSurfacePolygon(toothNum, 'vestibular', '2,2 98,2 75,25 25,25', 'Vestibular')}
            {renderSurfacePolygon(toothNum, 'lingual', '25,75 75,75 98,98 2,98', 'Lingual / Palatina')}
            {renderSurfacePolygon(toothNum, 'mesial', '2,2 25,25 25,75 2,98', 'Mesial')}
            {renderSurfacePolygon(toothNum, 'distal', '98,2 98,98 75,75 75,25', 'Distal')}
            {renderSurfacePolygon(toothNum, 'oclusal', '25,25 75,25 75,75 25,75', 'Oclusal / Incisal')}

            {/* OVERLAYS CON COLORES DINÁMICOS */}

            {/* Pending Bridge Selection Highlight */}
            {isBridgePendingStart && (
              <rect x="4" y="4" width="92" height="92" rx="10" fill="none" stroke={activeConditionMetas.puente.color} strokeWidth="8" className="animate-pulse" />
            )}

            {/* Corona / Prótesis Fija */}
            {isCorona && (
              <rect x="6" y="6" width="88" height="88" rx="8" fill="none" stroke={condColor} strokeWidth="7" strokeDasharray="6 3" />
            )}

            {/* Perno / Poste Intrarradicular */}
            {isPerno && (
              <g>
                <line x1="50" y1="20" x2="50" y2="95" stroke={condColor} strokeWidth="10" />
                <line x1="30" y1="20" x2="70" y2="20" stroke={condColor} strokeWidth="8" />
              </g>
            )}

            {/* Sellador de Fosas y Fisuras */}
            {isSellador && (
              <g>
                <circle cx="50" cy="50" r="16" fill="none" stroke={condColor} strokeWidth="6" />
                <line x1="50" y1="30" x2="50" y2="70" stroke={condColor} strokeWidth="4" />
                <line x1="30" y1="50" x2="70" y2="50" stroke={condColor} strokeWidth="4" />
              </g>
            )}

            {/* Implante Dental */}
            {isImplante && (
              <g>
                <rect x="40" y="30" width="20" height="65" rx="4" fill={condColor} />
                <line x1="35" y1="42" x2="65" y2="42" stroke="#ffffff" strokeWidth="4" />
                <line x1="35" y1="56" x2="65" y2="56" stroke="#ffffff" strokeWidth="4" />
                <line x1="35" y1="70" x2="65" y2="70" stroke="#ffffff" strokeWidth="4" />
                <line x1="35" y1="84" x2="65" y2="84" stroke="#ffffff" strokeWidth="4" />
              </g>
            )}

            {/* Extracción Indicada */}
            {isExtraccionIndicada && (
              <g>
                <line x1="6" y1="36" x2="94" y2="36" stroke={condColor} strokeWidth="8" strokeLinecap="round" />
                <line x1="6" y1="64" x2="94" y2="64" stroke={condColor} strokeWidth="8" strokeLinecap="round" />
              </g>
            )}

            {/* Diente Ausente */}
            {isAusente && (
              <g>
                <line x1="10" y1="10" x2="90" y2="90" stroke={condColor} strokeWidth="10" strokeLinecap="round" />
                <line x1="90" y1="10" x2="10" y2="90" stroke={condColor} strokeWidth="10" strokeLinecap="round" />
              </g>
            )}

            {/* Diente Extraído */}
            {isExtraido && (
              <g>
                <line x1="10" y1="10" x2="90" y2="90" stroke={condColor} strokeWidth="10" strokeLinecap="round" />
                <line x1="90" y1="10" x2="10" y2="90" stroke={condColor} strokeWidth="10" strokeLinecap="round" />
              </g>
            )}

            {/* Prótesis Removible */}
            {isProtesisRemovible && (
              <path d="M 10 30 Q 50 0 90 30" fill="none" stroke={condColor} strokeWidth="8" strokeLinecap="round" />
            )}

            {/* Prótesis Total */}
            {isProtesisTotal && (
              <g>
                <path d="M 10 25 Q 50 0 90 25" fill="none" stroke={condColor} strokeWidth="7" strokeLinecap="round" />
                <path d="M 10 40 Q 50 15 90 40" fill="none" stroke={condColor} strokeWidth="7" strokeLinecap="round" />
              </g>
            )}

            {/* Diente en Erupción */}
            {isErupcion && (
              <g>
                <polyline points="30,35 50,15 70,35" fill="none" stroke={condColor} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="50" y1="15" x2="50" y2="50" stroke={condColor} strokeWidth="8" strokeLinecap="round" />
              </g>
            )}

            {/* Diente Retenido / Impactado */}
            {isRetenido && (
              <g>
                <rect x="15" y="15" width="70" height="70" rx="14" fill="none" stroke={condColor} strokeWidth="7" strokeDasharray="5 5" />
                <circle cx="50" cy="50" r="14" fill={condColor} />
              </g>
            )}

            {/* Diente Supernumerario */}
            {isSupernumerario && (
              <g>
                <circle cx="80" cy="20" r="14" fill={condColor} stroke="#ffffff" strokeWidth="2" />
                <text x="80" y="25" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="bold">+</text>
              </g>
            )}

            {/* Puente Fijo Pilar */}
            {isBridgePilar && (
              <g>
                <rect x="6" y="6" width="88" height="88" rx="8" fill="none" stroke={condColor} strokeWidth="7" strokeDasharray="6 3" />
                <rect x="0" y="0" width="100" height="12" fill={condColor} />
                <line x1="50" y1="0" x2="50" y2="24" stroke={condColor} strokeWidth="10" />
                <circle cx="50" cy="24" r="7" fill={condColor} />
              </g>
            )}

            {/* Puente Fijo Póntico */}
            {isBridgePontico && (
              <g>
                <line x1="15" y1="20" x2="85" y2="90" stroke={activeConditionMetas.ausente?.color || '#dc2626'} strokeWidth="8" strokeLinecap="round" />
                <line x1="85" y1="20" x2="15" y2="90" stroke={activeConditionMetas.ausente?.color || '#dc2626'} strokeWidth="8" strokeLinecap="round" />
                <rect x="0" y="0" width="100" height="12" fill={condColor} />
                <line x1="0" y1="6" x2="100" y2="6" stroke={condColor} strokeWidth="4" />
              </g>
            )}
          </svg>
        </div>

        {/* Small badge if findings exist */}
        {findings.some(f => f.toothNumber === toothNum) && (
          <span className="mt-1 w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
        )}
      </div>
    );
  };

  const selectedToothFindings = findings.filter(f => f.toothNumber === selectedTooth);

  // Filter conditions for selector by category and search term
  const filteredConditions = useMemo(() => {
    return Object.values(activeConditionMetas).filter(cond => {
      const matchesCategory = activeCategoryFilter === 'todas' || cond.category === activeCategoryFilter;
      const matchesQuery = !searchQuery.trim() || 
        cond.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cond.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeConditionMetas, activeCategoryFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & Patient Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            🦷
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Odontograma Clínico Completo (FDI): <span className="text-teal-600">{patient.name}</span>
            </h2>
            <p className="text-sm text-slate-500">
              DNI: <span className="font-semibold text-slate-700">{patient.dni}</span> | Obra Social: <span className="font-semibold text-slate-700">{patient.healthInsurance} ({patient.insuranceNumber || 'N/A'})</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPrimaryTeethView(!isPrimaryTeethView)}
            className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            {isPrimaryTeethView ? 'Ver Dientes Adultos (32)' : 'Ver Dientes Temporales (20)'}
          </button>

          <button 
            onClick={() => window.print()}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir Odontograma
          </button>
        </div>
      </div>

      {/* BANNER INTERACTIVO PASO 1 Y PASO 2 */}
      <div className="bg-gradient-to-r from-teal-700 via-slate-800 to-slate-900 text-white rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-xl bg-teal-500/30 text-teal-300 border border-teal-400/40 flex items-center justify-center font-black text-xl backdrop-blur-xs shadow-inner">
            📍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-400 text-slate-950 px-2 py-0.5 rounded-md">
                Paso 1: Pieza Dentaria Seleccionada
              </span>
              {selectedTooth ? (
                <span className="text-xl font-black text-white">Diente #{selectedTooth}</span>
              ) : (
                <span className="text-sm font-semibold text-teal-200">Haz clic en un diente para seleccionarlo</span>
              )}
            </div>

            {selectedTooth && (
              <div className="flex items-center gap-2 mt-1.5 text-xs text-teal-100 flex-wrap">
                <span className="font-semibold text-teal-300">Cara activa:</span>
                {(['vestibular', 'lingual', 'mesial', 'distal', 'oclusal', 'pieza'] as ToothSurface[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSurface(s)}
                    className={`px-2.5 py-0.5 rounded-lg capitalize font-bold transition-all ${
                      selectedSurface === s
                        ? 'bg-teal-400 text-slate-950 shadow-md ring-2 ring-teal-200'
                        : 'bg-slate-800/80 text-teal-100 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {s === 'pieza' ? 'Pieza Completa' : s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastAppliedMsg ? (
            <span className="text-xs font-extrabold bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 px-3.5 py-2 rounded-xl animate-fade-in flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {lastAppliedMsg}
            </span>
          ) : (
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-teal-300 block">Paso 2: Elegir Tratamiento abajo</span>
              <span className="text-[11px] text-slate-400">Haz clic en cualquier botón de diagnóstico para aplicarlo a la pieza</span>
            </div>
          )}
        </div>
      </div>

      {/* Odontograma Visual (Cuadrantes FDI) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 overflow-x-auto">
        <div className="min-w-[720px] space-y-6">
          
          {/* Superior Arch */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200">
            <div className="text-center text-xs font-bold uppercase tracking-wider text-teal-700 mb-3 bg-teal-100/60 py-1 rounded-lg">
              MAXILAR SUPERIOR (Cuadrante 1 y Cuadrante 2)
            </div>

            {!isPrimaryTeethView ? (
              <div className="flex justify-center gap-1">
                <div className="flex gap-1 border-r-2 border-dashed border-teal-300 pr-3">
                  {UPPER_RIGHT.map(num => renderToothSVG(num))}
                </div>
                <div className="flex gap-1 pl-3">
                  {UPPER_LEFT.map(num => renderToothSVG(num))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-1">
                <div className="flex gap-1 border-r-2 border-dashed border-teal-300 pr-3">
                  {PRIMARY_UPPER_RIGHT.map(num => renderToothSVG(num))}
                </div>
                <div className="flex gap-1 pl-3">
                  {PRIMARY_UPPER_LEFT.map(num => renderToothSVG(num))}
                </div>
              </div>
            )}
          </div>

          {/* Line separator representing occlusal plane */}
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400">
            <div className="h-px bg-slate-300 flex-1" />
            <span className="px-3 py-0.5 bg-slate-200 rounded-full text-slate-600">LÍNEA MEDIA / PLANO OCLUSAL</span>
            <div className="h-px bg-slate-300 flex-1" />
          </div>

          {/* Inferior Arch */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200">
            {!isPrimaryTeethView ? (
              <div className="flex justify-center gap-1">
                <div className="flex gap-1 border-r-2 border-dashed border-teal-300 pr-3">
                  {LOWER_RIGHT.map(num => renderToothSVG(num))}
                </div>
                <div className="flex gap-1 pl-3">
                  {LOWER_LEFT.map(num => renderToothSVG(num))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-1">
                <div className="flex gap-1 border-r-2 border-dashed border-teal-300 pr-3">
                  {PRIMARY_LOWER_RIGHT.map(num => renderToothSVG(num))}
                </div>
                <div className="flex gap-1 pl-3">
                  {PRIMARY_LOWER_LEFT.map(num => renderToothSVG(num))}
                </div>
              </div>
            )}

            <div className="text-center text-xs font-bold uppercase tracking-wider text-teal-700 mt-3 bg-teal-100/60 py-1 rounded-lg">
              MAXILAR INFERIOR (Cuadrante 4 y Cuadrante 3)
            </div>
          </div>

        </div>
      </div>

      {/* Selector de Condición y Tratamiento (PASO 2) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-600" />
              Paso 2: Selecciona la afección o tratamiento a aplicar sobre el Diente #{selectedTooth || '--'}:
            </h3>
            <p className="text-[11px] text-slate-400">Haz clic en cualquier tratamiento para marcarlo inmediatamente en la pieza y cara seleccionada arriba.</p>
          </div>

          {/* Buscador de Tratamientos */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar p. ej. implante, surco..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50"
            />
          </div>
        </div>

        {/* Pestañas de Categoría */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {[
            { id: 'todas', label: 'Todas (23)', icon: '📋' },
            { id: 'patologia', label: 'Patologías & Hallazgos (8)', icon: '🩺' },
            { id: 'tratamiento', label: 'Tratamientos & Restauraciones (7)', icon: '💊' },
            { id: 'protesis', label: 'Prótesis, Implantes & Cirugía (8)', icon: '🦷' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeCategoryFilter === cat.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Grid de botones de diagnóstico con color dinámico */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 p-1">
          {filteredConditions.map((cond) => {
            const isActive = selectedCondition === cond.id;
            return (
              <button
                key={cond.id}
                onClick={() => handleSelectCondition(cond.id as ConditionType)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isActive 
                    ? 'border-teal-500 bg-teal-50 shadow-md ring-2 ring-teal-400 font-semibold' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-white'
                }`}
                title={cond.description}
              >
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="w-4 h-4 rounded-full border border-slate-300 shadow-inner flex items-center justify-center text-[10px] shrink-0" 
                    style={{ backgroundColor: cond.color }}
                  >
                    {cond.id === 'extraccion_indicada' && (
                      <span className="font-extrabold text-white text-[9px] leading-none">=</span>
                    )}
                  </span>

                  {cond.symbol ? (
                    <span className="text-xs font-bold">{cond.symbol}</span>
                  ) : null}
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight">{cond.label}</span>
              </button>
            );
          })}
        </div>

        {/* Banner de Instrucciones para Modo Puente Fijo */}
        {selectedCondition === 'puente' && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-blue-800 text-xs font-medium animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-base">🌉</span>
              {bridgeStartTooth === null ? (
                <span><strong>Modo Puente Fijo Activo:</strong> Haz clic en la <u>Pieza Pilar 1</u> (primer diente del puente).</span>
              ) : (
                <span><strong>Pilar 1 seleccionado (#{bridgeStartTooth}):</strong> Ahora haz clic en la <u>Pieza Pilar 2</u> (último diente del puente) para enlazar el tramo.</span>
              )}
            </div>
            {bridgeStartTooth !== null && (
              <button 
                onClick={() => setBridgeStartTooth(null)} 
                className="px-2.5 py-1 bg-blue-200 hover:bg-blue-300 rounded-lg font-bold text-blue-900 transition"
              >
                Cancelar Selección
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dynamic Detail Panel for Selected Tooth & Complete Findings List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Selected Tooth Quick Inspector */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
                Detalle Pieza Dental: <span className="text-2xl font-black text-teal-600">#{selectedTooth || '--'}</span>
              </h3>
              <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-semibold">
                Nomenclatura FDI
              </span>
            </div>

            {selectedTooth ? (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-600 uppercase">
                      Nota / Observación para Pieza #{selectedTooth}:
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej. Sensibilidad al frío, cavidad en extensión..."
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveToothNote(selectedTooth, notesInput);
                        }
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium"
                    />
                    <button
                      onClick={() => handleSaveToothNote(selectedTooth, notesInput)}
                      className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 shrink-0"
                      title="Guardar nota de esta pieza dental"
                    >
                      💾 Guardar
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Hallazgos registrados en pieza #{selectedTooth}:</h4>
                  {selectedToothFindings.length === 0 ? (
                    <p className="text-sm text-slate-400 italic py-2">Sin lesiones ni restauraciones registradas.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedToothFindings.map(f => {
                        const meta = activeConditionMetas[f.condition];
                        return (
                          <div key={f.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: meta?.color }} />
                              <div>
                                <span className="font-bold text-slate-800">{meta?.label}</span>
                                <span className="text-slate-500 ml-2">({f.surface})</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleRemoveFinding(f.id)}
                              className="text-slate-400 hover:text-red-600 transition p-1"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Selecciona una pieza dental en el gráfico superior para ver o modificar su diagnóstico.</p>
            )}
          </div>
        </div>

        {/* Global Patient Findings Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Resumen Clínico General de Hallazgos ({findings.length})
            </h3>
          </div>

          {findings.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Odontograma Sano</p>
              <p className="text-xs text-slate-400">No se han marcado hallazgos patológicos en la dentadura.</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[280px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase sticky top-0">
                  <tr>
                    <th className="p-2.5 rounded-l-lg">Pieza</th>
                    <th className="p-2.5">Superficie</th>
                    <th className="p-2.5">Condición / Tratamiento</th>
                    <th className="p-2.5">Fecha</th>
                    <th className="p-2.5">Notas</th>
                    <th className="p-2.5 text-right rounded-r-lg">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {findings.map(f => {
                    const meta = activeConditionMetas[f.condition];
                    return (
                      <tr key={f.id} className="hover:bg-slate-50 transition">
                        <td className="p-2.5 font-black text-teal-700 text-sm">#{f.toothNumber}</td>
                        <td className="p-2.5 font-semibold capitalize text-slate-700">{f.surface}</td>
                        <td className="p-2.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-800 border border-slate-200`}>
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: meta?.color }} />
                            {meta?.label}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-500">{f.date}</td>
                        <td className="p-2.5 text-slate-600 max-w-[180px] truncate">{f.notes || '-'}</td>
                        <td className="p-2.5 text-right">
                          <button 
                            onClick={() => handleRemoveFinding(f.id)}
                            className="text-slate-400 hover:text-red-600 transition"
                            title="Eliminar hallazgo"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
