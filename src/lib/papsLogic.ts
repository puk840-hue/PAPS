import { PAPS_STANDARDS } from '../constants/papsData';
import { Gender, GradeLevel, PapsItem, PapsMeasurement, PapsArea } from '../types';

export function calculateGrade(gender: Gender, gradeLevel: GradeLevel, item: PapsItem, value: number): { score: number; grade: number } {
  const standards = PAPS_STANDARDS[gender]?.[gradeLevel]?.[item];
  
  if (!standards) {
    // Fallback if data not found (using 중1 as base if current grade not mapped)
    const fallbackStandards = PAPS_STANDARDS[gender]?.['중1']?.[item];
    if (!fallbackStandards) return { score: 0, grade: 5 };
    
    return findInStandards(fallbackStandards, value);
  }

  return findInStandards(standards, value);
}

function findInStandards(standards: any[], value: number): { score: number; grade: number } {
  for (const range of standards) {
    if (value >= range.min && value <= range.max) {
      return { score: range.points, grade: range.grade };
    }
  }
  
  // If outside logic
  const minVal = Math.min(...standards.map(r => r.min));
  const maxVal = Math.max(...standards.map(r => r.max));
  
  if (value < minVal) {
    const worst = standards.find(r => r.grade === 5);
    return { score: worst?.points || 4, grade: 5 };
  }
  
  if (value > maxVal) {
    const best = standards.find(r => r.grade === 1);
    return { score: best?.points || 20, grade: 1 };
  }

  return { score: 0, grade: 5 };
}

export function getOverallGrade(totalScore: number): number {
  if (totalScore >= 80) return 1;
  if (totalScore >= 60) return 2;
  if (totalScore >= 40) return 3;
  if (totalScore >= 20) return 4;
  return 5;
}

export function getAreaByItem(item: PapsItem): PapsArea {
  switch (item) {
    case '왕복오래달리기':
    case '오래달리기-걷기':
    case '스텝검사':
      return '심폐지구력';
    case '앉아윗몸앞으로굽히기':
    case '종합유연성':
      return '유연성';
    case '악력':
    case '윗몸말아올리기':
    case '팔굽혀펴기':
      return '근력·근지구력';
    case '50m달리기':
    case '제자리멀리뛰기':
      return '순발력';
    case 'BMI':
      return '비만';
    default:
      return '비만';
  }
}
