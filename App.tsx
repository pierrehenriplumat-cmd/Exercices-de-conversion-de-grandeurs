import React, { useState, useCallback } from 'react';
import { Grandeur, Exercise } from './types';
import { GRANDEURS, UNITS } from './constants';
import ExerciseCard from './components/ExerciseCard';

const App: React.FC = () => {
  const [grandeur, setGrandeur] = useState<Grandeur>('longueurs');
  const [nombre, setNombre] = useState<number>(5);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateExercises = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setExercises([]);

    try {
      const newExercises: Exercise[] = [];
      const units = UNITS[grandeur];

      for (let i = 0; i < nombre; i++) {
        let startUnitIndex, targetUnitIndex;
        do {
          startUnitIndex = Math.floor(Math.random() * units.length);
          targetUnitIndex = Math.floor(Math.random() * units.length);
        } while (startUnitIndex === targetUnitIndex || !units[startUnitIndex].symbol.trim() || !units[targetUnitIndex].symbol.trim());

        const startUnit = units[startUnitIndex];
        const targetUnit = units[targetUnitIndex];
        
        const value = parseFloat((Math.random() * 100 + 1).toFixed(Math.random() > 0.5 ? 2 : 0));

        let power;
        switch(grandeur) {
            case 'aires': power = 2; break;
            case 'volumes': power = 3; break;
            default: power = 1; break;
        }
        
        const conversionFactor = Math.pow(10, (targetUnitIndex - startUnitIndex) * power);
        const solution = value * conversionFactor;

        newExercises.push({
          id: i + 1,
          grandeur,
          statement: `Convertir ${value} ${startUnit.symbol} en ${targetUnit.symbol}`,
          value,
          startUnit: startUnit.symbol,
          targetUnit: targetUnit.symbol,
          solution: parseFloat(solution.toPrecision(15)), // handle floating point issues
        });
      }
      setExercises(newExercises);

    } catch (e) {
      console.error(e);
      setError("Une erreur est survenue lors de la génération des exercices.");
    } finally {
      setIsLoading(false);
    }
  }, [grandeur, nombre]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">Générateur d'Exercices de Conversion</h1>
            <p className="mt-1 text-slate-600">Créez des fiches d'exercices sur mesure pour maîtriser les conversions.</p>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label htmlFor="grandeur" className="block text-sm font-medium text-slate-700 mb-1">
                Choisir une grandeur
              </label>
              <select
                id="grandeur"
                value={grandeur}
                onChange={(e) => setGrandeur(e.target.value as Grandeur)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
              >
                {GRANDEURS.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1">
                Nombre d'exercices
              </label>
              <input
                type="number"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(Math.max(1, parseInt(e.target.value, 10)))}
                min="1"
                max="20"
                className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
              />
            </div>
            <button
              onClick={generateExercises}
              disabled={isLoading}
              className="w-full md:w-auto justify-self-start md:justify-self-end px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération...
                </>
              ) : (
                "Générer les exercices"
              )}
            </button>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}

        <div className="space-y-8">
          {exercises.map(ex => (
            <ExerciseCard 
                key={ex.id} 
                exercise={ex}
            />
          ))}
        </div>
      </main>

       <footer className="text-center py-6 mt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">Créé avec React et Tailwind CSS.</p>
        </footer>
    </div>
  );
};

export default App;