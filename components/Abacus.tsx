import React, { useMemo, useCallback } from 'react';
import { Grandeur, PlacedDigit } from '../types';
import { UNITS } from '../constants';

interface AbacusProps {
  grandeur: Grandeur;
  value: number;
  startUnit: string;
  targetUnit: string;
  showSolution: boolean;
  solution: number;
}

const getSubCols = (grandeur: Grandeur): number => {
  switch (grandeur) {
    case 'aires':
      return 2;
    case 'volumes':
      return 3;
    default:
      return 1;
  }
};

const EXTRA_COLS = 3;

const Abacus: React.FC<AbacusProps> = ({ grandeur, value, startUnit, targetUnit, showSolution, solution }) => {
  const units = UNITS[grandeur];
  const subCols = getSubCols(grandeur);
  
  const placeInitialDigits = useCallback((): PlacedDigit[] => {
    const placed: PlacedDigit[] = [];
    const valueStr = String(value).replace(',', '.');
    const [integerPart, fractionalPart] = valueStr.split('.');
    
    const startUnitIndex = units.findIndex(u => u.symbol === startUnit);
    if (startUnitIndex === -1) return [];

    const unitTotalPosition = startUnitIndex * subCols + (subCols - 1);

    // Place integer part
    integerPart.split('').reverse().forEach((digit, i) => {
        const currentTotalPosition = unitTotalPosition - i;
        const colIndex = Math.floor(currentTotalPosition / subCols);
        const subColIndex = ((currentTotalPosition % subCols) + subCols) % subCols;
        placed.push({ digit, isUnit: i === 0, colIndex, subColIndex });
    });

    // Place fractional part
    if (fractionalPart) {
      fractionalPart.split('').forEach((digit, i) => {
        const currentTotalPosition = unitTotalPosition + i + 1;
        const colIndex = Math.floor(currentTotalPosition / subCols);
        const subColIndex = currentTotalPosition % subCols;
        placed.push({ digit, isUnit: false, colIndex, subColIndex });
      });
    }
    return placed;
  }, [value, startUnit, units, subCols]);

  const digits = useMemo(() => {
      const initialDigits = placeInitialDigits();
      if (!showSolution) {
          return initialDigits;
      }

      const allDigits = [...initialDigits];
      const targetUnitIndex = units.findIndex(u => u.symbol === targetUnit);

      if (targetUnitIndex === -1) return allDigits;

      let maxTotalPosition = -Infinity;
      initialDigits.forEach(d => {
          maxTotalPosition = Math.max(maxTotalPosition, d.colIndex * subCols + d.subColIndex);
      });
      
      const targetTotalPosition = targetUnitIndex * subCols + (subCols - 1);
      
      if (targetTotalPosition > maxTotalPosition) {
          for (let pos = maxTotalPosition + 1; pos <= targetTotalPosition; pos++) {
              const col = Math.floor(pos / subCols);
              const subCol = pos % subCols;
              if (!allDigits.some(d => d.colIndex === col && d.subColIndex === subCol)) {
                  allDigits.push({
                      digit: '0',
                      isUnit: false,
                      colIndex: col,
                      subColIndex: subCol,
                  });
              }
          }
      }
      
      return allDigits;

  }, [placeInitialDigits, showSolution, targetUnit, units, subCols]);

  const targetUnitIndex = units.findIndex(u => u.symbol === targetUnit);

  const renderCells = () => {
    const cells = [];
    for (let i = -EXTRA_COLS; i < units.length + EXTRA_COLS; i++) {
      for (let j = 0; j < subCols; j++) {
        const digitInfo = digits.find(d => d.colIndex === i && d.subColIndex === j);
        const isSolutionBoundary = showSolution && i === targetUnitIndex && j === subCols - 1;
        
        let cellClasses = "h-12 border text-center text-2xl font-mono relative";
        
        if (digitInfo) {
            cellClasses += " font-bold text-slate-800";
            if (digitInfo.isUnit) {
                cellClasses += " bg-blue-200";
            } else {
                cellClasses += " bg-white";
            }
        } else {
             cellClasses += " bg-white";
        }
        
        if (i < 0 || i >= units.length) {
            cellClasses = cellClasses.replace("bg-white", "bg-slate-50");
        }

        if (isSolutionBoundary) {
            cellClasses += " border-r-4 border-r-red-500";
        }
        
        cells.push(
            <td key={`${i}-${j}`} className={cellClasses}>
                {digitInfo?.digit}
                 {isSolutionBoundary && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-red-500 text-2xl font-bold">,</span>}
            </td>
        );
      }
    }
    return cells;
  };
  
   const renderCapacityHeaders = () => {
    if (grandeur === 'volumes') {
        const leftUnits = 3; // km³, hm³, dam³
        const rightUnits = 2; // cm³, mm³
        return (
             <tr className="bg-green-100">
                <td colSpan={(EXTRA_COLS + leftUnits) * subCols}></td>
                <td className="border p-1 text-center font-semibold" colSpan={subCols}>
                    <div className="flex justify-around"><span>hL</span><span>daL</span><span>L</span></div>
                </td>
                <td className="border p-1 text-center font-semibold" colSpan={subCols}>
                     <div className="flex justify-around"><span>dL</span><span>cL</span><span>mL</span></div>
                </td>
                <td colSpan={(EXTRA_COLS + rightUnits) * subCols}></td>
            </tr>
        )
    }
    return null;
   }

  return (
    <div className="overflow-x-auto p-2 bg-slate-100 rounded-lg">
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr className="bg-slate-200">
            {Array.from({ length: EXTRA_COLS }).map((_, i) => (
              <th key={`pre-${i}`} colSpan={subCols} className="p-2 border bg-slate-100"></th>
            ))}
            {units.map((unit) => (
              <th key={unit.symbol} colSpan={subCols} className="p-2 border font-semibold text-slate-700">
                {unit.symbol || ''}
              </th>
            ))}
             {Array.from({ length: EXTRA_COLS }).map((_, i) => (
              <th key={`post-${i}`} colSpan={subCols} className="p-2 border bg-slate-100"></th>
            ))}
          </tr>
        </thead>
        <tbody>
            <tr>{renderCells()}</tr>
            {renderCapacityHeaders()}
        </tbody>
      </table>
    </div>
  );
};

export default Abacus;