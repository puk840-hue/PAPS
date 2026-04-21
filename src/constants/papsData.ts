import { Gender, GradeLevel, PapsItem, StandardRange } from '../types';

// Simplified points for each grade
export const GRADE_POINTS = {
  1: 20,
  2: 16,
  3: 12,
  4: 8,
  5: 4
};

// Simplified Standards based on the PDF screenshots
// Capturing a subset for demonstration: Grades '중1', '중2', '중3'
export const PAPS_STANDARDS: any = {
  male: {
    '중1': {
      '왕복오래달리기': [
        { min: 64, max: 1000, points: 20, grade: 1 },
        { min: 50, max: 63, points: 16, grade: 2 },
        { min: 36, max: 49, points: 12, grade: 3 },
        { min: 20, max: 35, points: 8, grade: 4 },
        { min: 0, max: 19, points: 4, grade: 5 },
      ],
      '앉아윗몸앞으로굽히기': [
        { min: 10.0, max: 100, points: 20, grade: 1 },
        { min: 6.0, max: 9.9, points: 16, grade: 2 },
        { min: 2.0, max: 5.9, points: 12, grade: 3 },
        { min: -4.0, max: 1.9, points: 8, grade: 4 },
        { min: -100, max: -4.1, points: 4, grade: 5 },
      ],
      '윗몸말아올리기': [
        { min: 90, max: 1000, points: 20, grade: 1 },
        { min: 55, max: 89, points: 16, grade: 2 },
        { min: 33, max: 54, points: 12, grade: 3 },
        { min: 14, max: 32, points: 8, grade: 4 },
        { min: 0, max: 13, points: 4, grade: 5 },
      ],
      '제자리멀리뛰기': [
        { min: 211.1, max: 1000, points: 20, grade: 1 },
        { min: 177.1, max: 211, points: 16, grade: 2 },
        { min: 159.1, max: 177, points: 12, grade: 3 },
        { min: 131.1, max: 159, points: 8, grade: 4 },
        { min: 0, max: 131, points: 4, grade: 5 },
      ],
      'BMI': [
        { min: 15.4, max: 23.2, points: 20, grade: 1 },
        { min: 0, max: 15.3, points: 12, grade: 3 },
        { min: 23.3, max: 24.9, points: 12, grade: 3 },
        { min: 25.0, max: 29.9, points: 8, grade: 4 },
        { min: 30.0, max: 100, points: 4, grade: 5 },
      ]
    },
    '초6': {
      '왕복오래달리기': [
        { min: 78, max: 1000, points: 20, grade: 1 },
        { min: 54, max: 77, points: 16, grade: 2 },
        { min: 32, max: 53, points: 12, grade: 3 },
        { min: 22, max: 31, points: 8, grade: 4 },
        { min: 0, max: 21, points: 4, grade: 5 },
      ],
      '앉아윗몸앞으로굽히기': [
        { min: 8.0, max: 100, points: 20, grade: 1 },
        { min: 5.0, max: 7.9, points: 16, grade: 2 },
        { min: 1.0, max: 4.9, points: 12, grade: 3 },
        { min: -4.0, max: 0.9, points: 8, grade: 4 },
        { min: -100, max: -4.1, points: 4, grade: 5 },
      ],
      '윗몸말아올리기': [
        { min: 80, max: 1000, points: 20, grade: 1 },
        { min: 40, max: 79, points: 16, grade: 2 },
        { min: 22, max: 39, points: 12, grade: 3 },
        { min: 10, max: 21, points: 8, grade: 4 },
        { min: 0, max: 9, points: 4, grade: 5 },
      ],
      '제자리멀리뛰기': [
        { min: 200, max: 1000, points: 20, grade: 1 },
        { min: 167, max: 199, points: 16, grade: 2 },
        { min: 148, max: 166, points: 12, grade: 3 },
        { min: 122, max: 147, points: 8, grade: 4 },
        { min: 0, max: 121, points: 4, grade: 5 },
      ],
      'BMI': [
        { min: 14.9, max: 22.5, points: 20, grade: 1 },
        { min: 0, max: 14.8, points: 12, grade: 3 },
        { min: 22.6, max: 24.9, points: 12, grade: 3 },
        { min: 25.0, max: 29.9, points: 8, grade: 4 },
        { min: 30.0, max: 100, points: 4, grade: 5 },
      ]
    },
    '초4': {
      '왕복오래달리기': [
        { min: 96, max: 1000, points: 20, grade: 1 },
        { min: 69, max: 95, points: 16, grade: 2 },
        { min: 45, max: 68, points: 12, grade: 3 },
        { min: 26, max: 44, points: 8, grade: 4 },
        { min: 0, max: 25, points: 4, grade: 5 },
      ],
      '윗몸말아올리기': [
        { min: 80, max: 1000, points: 20, grade: 1 },
        { min: 40, max: 79, points: 16, grade: 2 },
        { min: 22, max: 39, points: 12, grade: 3 },
        { min: 7, max: 21, points: 8, grade: 4 },
        { min: 0, max: 6, points: 4, grade: 5 },
      ],
      'BMI': [
        { min: 14.3, max: 20.7, points: 20, grade: 1 },
        { min: 0, max: 14.2, points: 12, grade: 3 },
        { min: 20.8, max: 23.2, points: 12, grade: 3 },
        { min: 23.3, max: 29.9, points: 8, grade: 4 },
        { min: 30.0, max: 100, points: 4, grade: 5 },
      ]
    },
    '초5': {
      '왕복오래달리기': [
        { min: 100, max: 1000, points: 20, grade: 1 },
        { min: 73, max: 99, points: 16, grade: 2 },
        { min: 50, max: 72, points: 12, grade: 3 },
        { min: 29, max: 49, points: 8, grade: 4 },
        { min: 0, max: 28, points: 4, grade: 5 },
      ],
      'BMI': [
        { min: 14.6, max: 21.6, points: 20, grade: 1 },
        { min: 0, max: 14.5, points: 12, grade: 3 },
        { min: 21.7, max: 24.4, points: 12, grade: 3 },
        { min: 24.5, max: 29.9, points: 8, grade: 4 },
        { min: 30.0, max: 100, points: 4, grade: 5 },
      ]
    }
  },
  female: {
    '중1': {
      '왕복오래달리기': [
        { min: 35, max: 1000, points: 20, grade: 1 },
        { min: 25, max: 34, points: 16, grade: 2 },
        { min: 19, max: 24, points: 12, grade: 3 },
        { min: 14, max: 18, points: 8, grade: 4 },
        { min: 0, max: 13, points: 4, grade: 5 },
      ],
      '앉아윗몸앞으로굽히기': [
        { min: 15.0, max: 100, points: 20, grade: 1 },
        { min: 11.0, max: 14.9, points: 16, grade: 2 },
        { min: 8.0, max: 10.9, points: 12, grade: 3 },
        { min: 2.0, max: 7.9, points: 8, grade: 4 },
        { min: -100, max: 1.9, points: 4, grade: 5 },
      ],
      '윗몸말아올리기': [
        { min: 58, max: 1000, points: 20, grade: 1 },
        { min: 43, max: 57, points: 16, grade: 2 },
        { min: 22, max: 42, points: 12, grade: 3 },
        { min: 7, max: 21, points: 8, grade: 4 },
        { min: 0, max: 6, points: 4, grade: 5 },
      ],
      '제자리멀리뛰기': [
        { min: 175.1, max: 1000, points: 20, grade: 1 },
        { min: 144.1, max: 175, points: 16, grade: 2 },
        { min: 127.1, max: 144, points: 12, grade: 3 },
        { min: 100.1, max: 127, points: 8, grade: 4 },
        { min: 0, max: 100, points: 4, grade: 5 },
      ],
      'BMI': [
        { min: 15.2, max: 22.1, points: 20, grade: 1 },
        { min: 0, max: 15.1, points: 12, grade: 3 },
        { min: 22.2, max: 24.7, points: 12, grade: 3 },
        { min: 24.8, max: 29.9, points: 8, grade: 4 },
        { min: 30.0, max: 100, points: 4, grade: 5 },
      ]
    },
    '초6': {
      '왕복오래달리기': [
        { min: 69, max: 1000, points: 20, grade: 1 },
        { min: 50, max: 68, points: 16, grade: 2 },
        { min: 25, max: 49, points: 12, grade: 3 },
        { min: 20, max: 24, points: 8, grade: 4 },
        { min: 0, max: 19, points: 4, grade: 5 },
      ],
      '앉아윗몸앞으로굽히기': [
        { min: 14.0, max: 100, points: 20, grade: 1 },
        { min: 10.0, max: 13.9, points: 16, grade: 2 },
        { min: 5.0, max: 9.9, points: 12, grade: 3 },
        { min: -0.1, max: 4.9, points: 8, grade: 4 },
        { min: -100, max: -0.2, points: 4, grade: 5 },
      ],
      '윗몸말아올리기': [
        { min: 60, max: 1000, points: 20, grade: 1 },
        { min: 43, max: 59, points: 16, grade: 2 },
        { min: 23, max: 42, points: 12, grade: 3 },
        { min: 7, max: 22, points: 8, grade: 4 },
        { min: 0, max: 6, points: 4, grade: 5 },
      ],
      '제자리멀리뛰기': [
        { min: 175.1, max: 1000, points: 20, grade: 1 },
        { min: 144.1, max: 175, points: 16, grade: 2 },
        { min: 127.1, max: 144, points: 12, grade: 3 },
        { min: 100.1, max: 127, points: 8, grade: 4 },
        { min: 0, max: 100, points: 4, grade: 5 },
      ],
      'BMI': [
        { min: 14.7, max: 21.4, points: 20, grade: 1 },
        { min: 0, max: 14.6, points: 12, grade: 3 },
        { min: 21.5, max: 23.9, points: 12, grade: 3 },
        { min: 24.0, max: 29.9, points: 8, grade: 4 },
        { min: 30.0, max: 100, points: 4, grade: 5 },
      ]
    }
  }
};

export const EXERCISE_INFO: Record<PapsItem, { tips: string[]; mistakes: string[] }> = {
  '왕복오래달리기': {
    tips: ['처음에는 일정한 속도를 유지하세요.', '호흡은 코로 들이마시고 입으로 내뱉으세요.', '발뒤꿈치부터 지면에 닿도록 하세요.'],
    mistakes: ['초반에 너무 빨리 달리기', '신호음 전에 미리 출발하기', '정지 시 갑자기 멈추기']
  },
  '오래달리기-걷기': {
    tips: ['보폭을 일정하게 유지하세요.', '팔을 가볍게 흔들어 추진력을 얻으세요.', '시선은 전방 15m를 주시하세요.'],
    mistakes: ['구부정한 자세로 걷기', '불규칙한 호흡', '적절하지 않은 신발 착용']
  },
  '스텝검사': {
    tips: ['일정한 박자에 맞춰 오르내리세요.', '무릎이 완전히 펴질 때까지 올라가세요.', '검사 후 1분간 휴식하며 심박수를 재세요.'],
    mistakes: ['난간을 잡고 올라가기', '양발을 동시에 구르기', '박자를 놓치고 무리하게 따라가기']
  },
  '앉아윗몸앞으로굽히기': {
    tips: ['반동을 주지 말고 천천히 밀어주세요.', '숨을 내쉬면서 상체를 숙이세요.', '무릎이 굽혀지지 않도록 주의하세요.'],
    mistakes: ['갑자기 강한 힘으로 밀기', '무릎을 들어 올리기', '손가락 끝만 사용해 밀기']
  },
  '종합유연성': {
    tips: ['좌우 균형을 확인하며 실시하세요.', '통증이 없는 범위 내에서 최대한 뻗으세요.', '충분한 준비운동 후 측정하세요.'],
    mistakes: ['반동 이용하기', '정지 상태를 유지하지 못함', '참고 무리하게 꺾기']
  },
  '악력': {
    tips: ['손바닥의 두툼한 부분과 손가락 마디를 활용하세요.', '팔이 몸에 닿지 않게 주의하세요.', '숨을 참지 말고 내쉬며 순간적으로 힘을 주어 짜세요.'],
    mistakes: ['악력계를 몸에 밀착시키기', '손목을 무리하게 비틀기', '한번에 힘을 주지 못함']
  },
  '윗몸말아올리기': {
    tips: ['팔을 허벅지 위에 대고 손끝이 무릎에 닿을 때까지 올리세요.', '일정한 리듬(3초당 1회)을 유지하세요.', '복근의 힘에 집중하세요.'],
    mistakes: ['목을 잡아당기기', '엉덩이를 바닥에서 떼기', '반동을 이용해 배치기']
  },
  '팔굽혀펴기': {
    tips: ['몸이 일직선이 되도록 유지하세요.', '가슴이 바닥에 가까워질 때까지 내려가세요.', '팔을 펼 때 호흡을 내뱉으세요.'],
    mistakes: ['허리가 아래로 처짐', '엉덩이만 높게 들림', '팔을 끝까지 펴지 않음']
  },
  '50m달리기': {
    tips: ['스타트 시 몸을 낮게 유지하며 가속하세요.', '팔을 힘차게 흔들어 보폭을 넓히세요.', '결승선을 지날 때까지 속도를 줄이지 마세요.'],
    mistakes: ['출발 시 고개를 바로 들기', '옆 라인을 보며 달리기', '결승선 앞에서 미리 속도 줄이기']
  },
  '제자리멀리뛰기': {
    tips: ['도약 시 팔을 뒤에서 앞으로 힘차게 휘두르세요.', '발바닥 전체로 지면을 강하게 미세요.', '착지 시 무릎을 굽혀 충격을 흡수하고 몸을 앞으로 숙이세요.'],
    mistakes: ['이중 도약(두 번 구르기)', '착지 후 뒤로 손 짚기', '위로만 높이 뛰기']
  },
  'BMI': {
    tips: ['성장기이므로 단순 수치보다 변화 추이가 중요합니다.', '규칙적인 식습관과 수면이 기본입니다.', '물 섭취량을 늘리세요.'],
    mistakes: ['극단적인 다이어트', '성장 지연을 초래하는 영양 부족', '운동 없는 체중 감량']
  }
};

export const EXERCISE_PRESCRIPTIONS = {
  '심폐지구력': {
    low: ['[강도: 숨이 약간 찰 정도] 매일 30분 낙천적인 속도로 걷기 - 3세트', '천천히 달리기(조깅) 15분 - 주 4회', '줄넘기 1분 5세트 (세트 간 30초 휴식)'],
    mid: ['[강도: 땀이 맺힐 정도] 자전거 타기 40분 - 주 3회', '수영 자유형 20분 - 주 2회', '축구/농구 등 구기운동 1시간 - 주 2회'],
    high: ['[강도: 최대 심박수의 80% 이상] 인터벌 러닝 (1분 전력질주 + 1분 걷기) 10세트', '장거리 달리기 5km 완주 시도', '고강도 타바타 운동 20분 - 주 3회']
  },
  '유연성': {
    low: ['[강도: 약한 당김] 매일 오전/오후 15분 전신 스트레칭', '요가 기초 (고양이 자세, 아기 자세) 10회씩 3세트', '의자에 앉아 허리 비틀기 30초씩 5회'],
    mid: ['[강도: 시원한 통증] 필라테스 기초 과정 40분 - 주 3회', '정적 스트레칭 각 동작 45초 유지 - 10개 동작', '폼롤러를 이용한 근막 이완 20분'],
    high: ['[강도: 한계 지점 도달] 기계체조 기초 동작 연습 30분', '심화 빈야사 요가 1시간 - 주 3회', 'PAPS 과목(앉아앞으로굽히기) 매일 3회 측정 및 기록'],
  },
  '근력·근지구력': {
    low: ['[강도: 약간 힘듦] 무릎 대고 팔굽혀펴기 10회 3세트', '벽 밀기 운동 20초 유지 5세트', '투명의자 자세 30초 3세트'],
    mid: ['[강도: 근육이 뻐근함] 팔굽혀펴기 정석 15회 4세트', '윗몸 말아 올리기 30회 3세트', '아령(2kg) 사이드 레터럴 레이즈 15회 3세트'],
    high: ['[강도: 실패 지점 1~2회 전] 턱걸이 매달리기 1분 또는 턱걸이 5회 이상 5세트', '플랭크 2분 유지 3세트', '스쿼트 본인 체중의 50% 중량 추가 12회 4세트']
  },
  '순발력': {
    low: ['[강도: 가벼움] 제자리 높이 뛰기 10회 3세트', '짧은 거리(10m) 왕복 대시 5회', '민첩성 사다리 기본 스텝 10분'],
    mid: ['[강도: 빠름] 사이드 스텝 30초 5세트', '제자리 멀리 뛰기 기술 연습 10회 (팔 휘두르기 집중)', '박스 점프 (높이 30cm) 12회 3세트'],
    high: ['[강도: 폭발적] 플라이오메트릭 훈련 30분 - 주 2회', '단거리 50m 전력 질주 5회 (완전 휴식 병행)', '연속적 장애물 넘기 점프 20회 3세트']
  },
  '비만': {
    low: ['[강도: 중강도 유지] 주 5회 이상 유산소 운동 (파워워킹) 40분', '저지방 식단 및 당류 섭취 50% 제한', '식후 15분 걷기 필수화'],
    mid: ['[강도: 근육량 증진 초점] 인터벌 트레이닝 30분 - 주 4회', '고단백 식사 (닭가슴살, 계란 등) 위주 구성', '탄수화물 섭취량 조절 (현미밥 대체)'],
    high: ['[강도: 전신 고칼로리 소모] 버피 테스트 20회 5세트', '웨이트 트레이닝 기초 과정 이수하여 기초대사량Up', '하루 2L 이상 충분한 수분 섭취']
  }
};
