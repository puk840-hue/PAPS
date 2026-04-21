export type Gender = 'male' | 'female';
export type GradeLevel = '초4' | '초5' | '초6' | '중1' | '중2' | '중3' | '고1' | '고2' | '고3';

export type PapsArea = '심폐지구력' | '유연성' | '근력·근지구력' | '순발력' | '비만';

export type PapsItem = 
  | '왕복오래달리기' | '오래달리기-걷기' | '스텝검사'
  | '앉아윗몸앞으로굽히기' | '종합유연성'
  | '악력' | '윗몸말아올리기' | '팔굽혀펴기'
  | '50m달리기' | '제자리멀리뛰기'
  | 'BMI';

export interface PapsMeasurement {
  item: PapsItem;
  value: number;
  score: number;
  grade: number;
}

export interface PapsRecord {
  id: string;
  name?: string;
  date: string;
  gender: Gender;
  gradeLevel: GradeLevel;
  measurements: Record<PapsArea, PapsMeasurement>;
  totalScore: number;
  overallGrade: number;
}

export interface StandardRange {
  min: number;
  max: number;
  points: number;
}

export interface PapsStandards {
  [gender: string]: {
    [grade: string]: {
      [item: string]: StandardRange[];
    };
  };
}
