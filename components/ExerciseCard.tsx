import React, { useState, useRef, useCallback } from 'react';
import { Exercise } from '../types';
import Abacus from './Abacus';

interface ExerciseCardProps {
  exercise: Exercise;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [showAbacus, setShowAbacus] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = useCallback((withSolution: boolean) => {
    if (!cardRef.current) return;
    const wasSolutionVisible = showSolution;
    const wasAbacusVisible = showAbacus;

    // Force visibility for PDF generation
    setShowSolution(withSolution);
    setShowAbacus(true);

    setTimeout(async () => {
      try {
        const { jsPDF } = (window as any).jspdf;
        const canvas = await (window as any).html2canvas(cardRef.current, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        const fileName = withSolution
          ? `solution_${exercise.id}_${exercise.grandeur}.pdf`
          : `exercice_${exercise.id}_${exercise.grandeur}.pdf`;
        pdf.save(fileName);
      } catch (error) {
        console.error("Erreur lors de la création du PDF:", error);
      } finally {
        // Restore previous state
        setShowSolution(wasSolutionVisible);
        setShowAbacus(wasAbacusVisible);
      }
    }, 200);
  }, [exercise, showSolution, showAbacus]);

  return (
    <div ref={cardRef} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 transition-all duration-300">
      <h3 className="text-xl font-bold text-slate-800 mb-4">
        Exercice {exercise.id}: <span className="font-normal">{exercise.statement}</span>
      </h3>
      
      {!showAbacus && (
          <button
            onClick={() => setShowAbacus(true)}
            className="mt-4 px-5 py-2.5 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 transition-all"
          >
            Afficher l'abaque de conversion
          </button>
      )}

      {showAbacus && (
        <>
          <Abacus 
            grandeur={exercise.grandeur}
            value={exercise.value}
            startUnit={exercise.startUnit}
            targetUnit={exercise.targetUnit}
            showSolution={showSolution}
            solution={exercise.solution}
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all"
            >
              {showSolution ? 'Cacher' : 'Afficher'} la solution
            </button>
            <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleDownloadPdf(false)}
                  className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  Télécharger l'exercice
                </button>
                 <button
                  onClick={() => handleDownloadPdf(true)}
                  className="px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  Télécharger la solution
                </button>
            </div>
          </div>

          {showSolution && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in">
              <p className="text-lg font-semibold text-slate-700">
                Solution: <span className="font-bold text-green-600">{exercise.solution} {exercise.targetUnit}</span>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExerciseCard;