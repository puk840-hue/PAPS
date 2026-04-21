import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  History, 
  PlusCircle, 
  TrendingUp, 
  User, 
  ClipboardCheck, 
  ChevronRight, 
  Trash2,
  Trophy,
  Dumbbell,
  Heart,
  Zap,
  Scale,
  Download,
  FileText,
  Lock,
  Share2,
  AlertCircle
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { PapsRecord, Gender, GradeLevel, PapsArea, PapsItem, PapsMeasurement } from './types';
import { calculateGrade, getOverallGrade, getAreaByItem } from './lib/papsLogic';
import { EXERCISE_PRESCRIPTIONS, EXERCISE_INFO } from './constants/papsData';

// --- Types ---
interface UserProfile {
  name: string;
  password?: string;
  gender?: Gender;
  gradeLevel?: GradeLevel;
}

// --- Components ---

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (s: string) => void }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 md:top-0 md:bottom-auto md:flex-col md:w-20 md:h-full md:border-r md:border-t-0">
    <NavItem icon={<Activity />} label="홈" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
    <NavItem icon={<PlusCircle />} label="기록" active={activeTab === 'form'} onClick={() => setActiveTab('form')} />
    <NavItem icon={<History />} label="역사" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
    <NavItem icon={<User />} label="프로필" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
  </nav>
);

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={`p-2 rounded-xl transition-all ${active ? 'bg-indigo-50 shadow-sm' : ''}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-tight md:hidden">{label}</span>
  </button>
);

const LoginView = ({ profile, onComplete }: { profile: UserProfile | null, onComplete: (p: { name: string, password?: string }) => void }) => {
  const [name, setName] = useState(profile?.name || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return setError('이름을 입력해주세요.');
    
    // Require 4 digits for password if provided or if already set
    if (password && !/^\d{4}$/.test(password)) {
      return setError('비밀번호는 숫자 4자리여야 합니다.');
    }

    if (profile && profile.password && profile.password !== password) {
      return setError('비밀번호가 일치하지 않습니다.');
    }

    onComplete({ name, password });
  };

  return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900 rounded-full -mr-48 -mt-48 opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900 rounded-full -ml-32 -mb-32 opacity-30" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
           <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-200 mb-6 group transition-transform hover:rotate-12">
              <Activity className="text-white" size={36} />
           </div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">PAPS Smart+</h1>
           <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mt-2">Personal Health Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <div className="w-1 h-1 bg-indigo-600 rounded-full" /> 이름
            </label>
            <div className="relative">
               <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
               <input 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800" 
                 placeholder="성함을 입력하세요"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
               <div className="w-1 h-1 bg-indigo-600 rounded-full" /> 비밀번호 (숫자 4자리)
            </label>
            <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
               <input 
                 type="text"
                 inputMode="numeric"
                 maxLength={4}
                 value={password}
                 onChange={(e) => setPassword(e.target.value.replace(/[^0-9]/g, ''))}
                 className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-black tracking-[1em] text-center" 
                 placeholder="0000"
               />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="text-rose-500 text-[10px] font-black text-center flex items-center justify-center gap-1.5 py-2 bg-rose-50 rounded-xl border border-rose-100"
            >
              <AlertCircle size={14} /> {error}
            </motion.div>
          )}

          <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black transition-all shadow-xl shadow-indigo-100 active:scale-95 group flex items-center justify-center gap-2">
            접속하기
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const SetupView = ({ onComplete }: { onComplete: (p: { gender: Gender, gradeLevel: GradeLevel }) => void }) => {
  const [gender, setGender] = useState<Gender>('male');
  const [grade, setGrade] = useState<GradeLevel>('중1');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl border border-slate-100"
      >
        <header className="mb-10 text-center">
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">기본 정보 설정</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">정확한 측정을 위해 학년과 성별을 선택해주세요.</p>
        </header>

        <div className="space-y-10">
          <div>
            <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 text-center">성별 선택</label>
            <div className="grid grid-cols-2 gap-4">
              {(['male', 'female'] as const).map(g => (
                <button 
                  key={g}
                  onClick={() => setGender(g)}
                  className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${gender === g ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100' : 'border-slate-50 bg-slate-50 text-slate-300'}`}
                >
                  <User size={32} />
                  <span className="font-black">{g === 'male' ? '남학생' : '여학생'}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 text-center">학년 선택</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {['초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3'].map((g) => (
                <button 
                  key={g}
                  onClick={() => setGrade(g as GradeLevel)}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-black ${grade === g ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-200'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onComplete({ gender, gradeLevel: grade })}
            className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-[2rem] font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
          >
            설정 완료 및 시작
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [records, setRecords] = useState<PapsRecord[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const savedRecords = localStorage.getItem('paps_records');
    const savedProfile = localStorage.getItem('paps_profile');
    if (savedRecords) setRecords(JSON.parse(savedRecords));
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setProfile(p);
      if (!p.password) setIsAuth(true);
    }
  }, []);

  const saveRecords = (newRecords: PapsRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('paps_records', JSON.stringify(newRecords));
  };

  const handleProfileSet = (p: Partial<UserProfile>) => {
    const updated = { ...profile, ...p } as UserProfile;
    setProfile(updated);
    localStorage.setItem('paps_profile', JSON.stringify(updated));
    if (updated.name && updated.gender && updated.gradeLevel) {
      setIsAuth(true);
    }
  };

  const addRecord = (record: PapsRecord) => {
    const newRecords = [record, ...records];
    saveRecords(newRecords);
  };

  const deleteRecord = (id: string) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      saveRecords(records.filter(r => r.id !== id));
    }
  };

  const downloadBackup = () => {
    const data = { profile, records };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paps_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (!profile || !isAuth) {
    if (!profile || !profile.name || !isAuth) {
      return <LoginView profile={profile} onComplete={handleProfileSet} />;
    }
    if (!profile.gender || !profile.gradeLevel) {
      return <SetupView onComplete={handleProfileSet} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-0 md:pl-20 font-sans text-slate-800">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-5xl mx-auto p-4 md:p-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Home records={records} onNewRecord={() => setActiveTab('form')} profileName={profile?.name || '사용자'} />
            </motion.div>
          )}
          {activeTab === 'form' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RecordForm onAdd={addRecord} profile={profile} onFinish={() => setActiveTab('home')} />
            </motion.div>
          )}
          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HistoryView records={records} onDelete={deleteRecord} />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Profile 
                profile={profile} 
                recordsCount={records.length} 
                onDownloadBackup={downloadBackup}
                onLogout={() => { setIsAuth(false); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Sub-views ---

function Home({ records, onNewRecord, profileName }: { records: PapsRecord[], onNewRecord: () => void, profileName: string }) {
  const latest = records[0];

  const chartData = latest ? Object.entries(latest.measurements).map(([area, m]) => ({
    subject: area,
    A: 6 - (m as any).grade, // Invert grade (1st grade = 5 points)
    fullMark: 5,
  })) : [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{profileName}님의 <span className="text-indigo-600">Smart 리포트</span></h1>
            <p className="text-sm font-semibold text-slate-400">당신의 건강 체력을 편리하게 관리하세요.</p>
          </div>
        </div>
        <button 
          onClick={onNewRecord}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          New Entry
        </button>
      </header>

      {latest ? (
        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-wider">Latest Grade</span>
               </div>
              <div className="w-40 h-40 rounded-full border-8 border-slate-50 flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin-slow"></div>
                <Trophy className="text-indigo-600" size={64} />
                <div className="absolute -bottom-2 bg-indigo-600 text-white px-6 py-2 rounded-full font-black text-2xl shadow-lg ring-8 ring-white">
                  {latest.overallGrade}등급
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">PAPS 등급 분석 완료</h2>
              <p className="text-sm font-bold text-slate-400 mb-8 tracking-wide uppercase">{latest.date} 기준</p>
              
              <div className="grid grid-cols-5 gap-3 w-full">
                {Object.entries(latest.measurements).map(([area, m]) => (
                  <div key={area} className="flex flex-col items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 transition-transform hover:scale-105">
                    <div className={`mb-2 ${getGradeTextColor(m?.grade)}`}>
                      {getAreaIcon(area as PapsArea, 20)}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase mb-1">{area}</span>
                    <span className="text-sm font-mono font-black text-slate-800 tracking-tighter">{m?.grade}급</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-5 bg-indigo-600 rounded-full"></div>
                  <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase tracking-widest">직관적 등급 밸런스</h3>
                </div>
                <div className="flex-1 min-h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                        <Radar
                          name="Level"
                          dataKey="A"
                          stroke="#4f46e5"
                          fill="#4f46e5"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                   </ResponsiveContainer>
                </div>
            </div>
          </section>

          <section className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
             <div className="lg:col-span-8 bg-indigo-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden group">
                <Activity className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700" size={280} />
                <div className="flex flex-col relative z-10 text-center md:text-left mb-8 md:mb-0">
                   <span className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em]">Smart Prescription</span>
                   <div className="text-4xl font-black mt-3 leading-tight">AI 맞춤형<br/>운동 솔루션</div>
                   <p className="text-indigo-200/80 text-sm mt-5 max-w-sm leading-relaxed font-medium">당신의 강점과 취약점을 분석하여 설계된 특별 가이드라인을 지금 확인하세요.</p>
                </div>
                <button className="bg-white text-indigo-900 hover:bg-indigo-50 px-8 py-4 rounded-2xl font-black text-sm transition-all relative z-10 shadow-2xl active:scale-95 group-hover:px-10">
                  전체 리포트 PDF 다운로드
                </button>
             </div>

             <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-1.5 h-5 bg-indigo-600 rounded-full"></div>
                  <h3 className="text-lg font-black tracking-tight text-slate-900">최근 체력 변화</h3>
                </div>
                <div className="flex-1 flex items-end justify-between gap-4 px-2 h-40">
                  {records.slice(0, 4).reverse().map((r, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 w-full group">
                      <div className="w-full relative flex items-end justify-center">
                         <div 
                           className="w-full bg-slate-50 rounded-t-2xl transition-all duration-700 group-hover:bg-indigo-50" 
                           style={{ height: `${(r.totalScore / 100) * 100 + 20}px` }}
                         />
                         <div 
                           className="absolute w-full bg-indigo-600 rounded-t-2xl transition-all duration-700 delay-100 opacity-70 group-hover:opacity-100" 
                           style={{ height: `${(r.totalScore / 100) * 40}px` }}
                         />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                        <span>{r.date.split('-')[1]}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span>{r.date.split('-')[2]}</span>
                      </span>
                    </div>
                  ))}
                </div>
             </div>
          </section>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 shadow-sm border border-slate-200 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ClipboardCheck className="text-slate-300" size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">건강 체력 관리의 시작</h2>
          <p className="text-slate-500 mb-10 font-medium">첫 번째 PAPS 측정 결과를 등록하여 체계적인 관리를 시작하세요.</p>
          <button 
            onClick={onNewRecord}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-indigo-100 tracking-tight"
          >
            기록 시작하기
          </button>
        </div>
      )}
    </motion.div>
  );
}

function RecordForm({ onAdd, profile, onFinish }: { onAdd: (r: PapsRecord) => void, profile: UserProfile | null, onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<Gender>(profile?.gender || 'male');
  const [grade, setGrade] = useState<GradeLevel>(profile?.gradeLevel || '중1');
  const [selectedItems, setSelectedItems] = useState<Record<PapsArea, PapsItem>>({
    '심폐지구력': '왕복오래달리기',
    '유연성': '앉아윗몸앞으로굽히기',
    '근력·근지구력': '윗몸말아올리기',
    '순발력': '제자리멀리뛰기',
    '비만': 'BMI'
  });
  const [values, setValues] = useState<Record<string, string>>({});
  const [latestRecord, setLatestRecord] = useState<PapsRecord | null>(null);

  const areas: PapsArea[] = ['심폐지구력', '유연성', '근력·근지구력', '순발력', '비만'];
  
  const handleComplete = () => {
    const measurements: Partial<Record<PapsArea, PapsMeasurement>> = {};
    let totalScore = 0;

    areas.forEach(area => {
      const item = selectedItems[area];
      const val = parseFloat(values[item] || '0');
      const { score, grade: itemGrade } = calculateGrade(gender, grade, item, val);
      measurements[area] = { item, value: val, score, grade: itemGrade };
      totalScore += score;
    });

    const newRecord: PapsRecord = {
      id: Date.now().toString(),
      name: profile?.name,
      date: new Date().toISOString().split('T')[0],
      gender,
      gradeLevel: grade,
      measurements: measurements as Record<PapsArea, PapsMeasurement>,
      totalScore,
      overallGrade: getOverallGrade(totalScore)
    };

    setLatestRecord(newRecord);
    setStep(3); // Go to Result Step
    onAdd(newRecord);
  };

  const steps = [
    { title: '기본 정보', desc: '성별과 학년을 선택해주세요.' },
    { title: '종목 선택', desc: '각 영역별 측정 종목을 선택해주세요.' },
    { title: '결과 입력', desc: '측정된 수치를 입력해주세요.' },
    { title: '측정 리포트', desc: '나의 등급과 솔루션을 확인하세요.' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === i ? 'bg-indigo-600 text-white shadow-lg' : step > i ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className={`w-6 h-1 rounded-full ${step > i ? 'bg-indigo-200' : 'bg-slate-100'}`} />}
          </div>
        ))}
      </div>

      <header className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{steps[step].title}</h2>
        <p className="text-slate-400 font-bold text-sm tracking-wide uppercase mt-1">{steps[step].desc}</p>
      </header>

      <div className={`${step === 3 ? 'bg-slate-50' : 'bg-white border border-slate-200 shadow-sm'} rounded-[2.5rem] p-8 md:p-10 min-h-[460px]`}>
        {step === 0 && (
          <div className="space-y-10">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center sm:text-left">학생 성별</label>
              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => setGender('male')}
                  className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center gap-3 ${gender === 'male' ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md shadow-indigo-50/20' : 'border-slate-50 bg-slate-50 text-slate-300'}`}
                >
                  <User size={32} /> 
                  <span className="font-black">남학생</span>
                </button>
                <button 
                  onClick={() => setGender('female')}
                  className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center gap-3 ${gender === 'female' ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md shadow-indigo-50/20' : 'border-slate-50 bg-slate-50 text-slate-300'}`}
                >
                  <User size={32} />
                  <span className="font-black">여학생</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center sm:text-left">학년 선택</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {['초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3'].map((g) => (
                  <button 
                    key={g}
                    onClick={() => setGrade(g as GradeLevel)}
                    className={`p-4 rounded-[1.5rem] border-2 transition-all text-sm font-black ${grade === g ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-200'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">상세 종목 선택 (영역별 1개)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {areas.map((area, idx) => (
                <div key={area} className="group p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50 hover:bg-white hover:border-indigo-100 transition-all">
                  <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">#0{idx + 1} {area}</label>
                  <div className="relative">
                    <select 
                      value={selectedItems[area]}
                      onChange={(e) => setSelectedItems({...selectedItems, [area]: e.target.value as PapsItem})}
                      className="w-full p-4 pr-12 rounded-xl bg-white border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm font-black text-slate-800 appearance-none transition-all cursor-pointer"
                    >
                      {getItemsByArea(area).map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            {areas.map(area => {
              const item = selectedItems[area];
              return (
                <div key={area} className="flex flex-col sm:flex-row sm:items-center gap-6 group bg-slate-50/50 p-6 rounded-[2rem] transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-50/30 border border-slate-100">
                  <div className="flex-1 flex items-center gap-5">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0">
                      {getAreaIcon(area, 24)}
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block leading-none mb-1.5">{area}</label>
                      <div className="text-base font-black text-slate-900 tracking-tight">{item}</div>
                    </div>
                  </div>
                  <div className="relative w-full sm:w-48">
                    <input 
                      type="number"
                      step="0.1"
                      value={values[item] || ''}
                      onChange={(e) => setValues({...values, [item]: e.target.value})}
                      placeholder="0.0"
                      className="w-full pl-6 pr-16 py-4 rounded-[1.5rem] bg-white border border-slate-200 focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none text-2xl font-mono font-black text-slate-900 shadow-sm"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 uppercase">{getUnit(item)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {step === 3 && latestRecord && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-bl-[6rem] opacity-5 shrink-0" />
               <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-200 ring-8 ring-indigo-50 relative z-10 shrink-0">
                 {latestRecord.overallGrade}
               </div>
               <div className="text-center md:text-left relative z-10">
                  <span className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em]">Overall Status</span>
                  <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">종합 {latestRecord.overallGrade}등급</h3>
                  <p className="text-slate-400 font-bold mt-2 flex items-center justify-center md:justify-start gap-2">
                    <TrendingUp size={16} /> 총점 {latestRecord.totalScore}점 / 100점
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {areas.map(area => {
                const m = latestRecord.measurements[area];
                return (
                  <div key={area} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-xl ${getGradeBg(m.grade)} text-white shadow-md`}>
                            {getAreaIcon(area, 20)}
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{area}</p>
                            <p className="font-black text-slate-900">{m.item}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-2xl font-black text-slate-900 tracking-tighter">{m.grade}<span className="text-xs ml-0.5">급</span></p>
                         <p className="text-[10px] font-black text-slate-300 mt-1 uppercase tracking-widest">{m.score} pts</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div className="p-5 bg-slate-50 rounded-[1.5rem]">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <Zap size={12} /> 운동 솔루션
                          </p>
                          <ul className="space-y-2">
                            {getPrescription(area, m.grade).map((p, i) => (
                              <li key={i} className="text-xs font-bold text-slate-600 flex items-start gap-2">
                                <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1.5 shrink-0" /> {p}
                              </li>
                            ))}
                          </ul>
                       </div>

                       {m.item && EXERCISE_INFO[m.item as PapsItem] && (
                         <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/30">
                               <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-2 leading-none">Pro Tips</p>
                               <p className="text-[10px] text-slate-600 font-bold leading-tight italic">{EXERCISE_INFO[m.item as PapsItem].tips[0]}</p>
                            </div>
                            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100/30">
                               <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mb-2 leading-none">Watch Out</p>
                               <p className="text-[10px] text-slate-600 font-bold leading-tight italic">{EXERCISE_INFO[m.item as PapsItem].mistakes[0]}</p>
                            </div>
                         </div>
                       )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-4">
        {step > 0 && step < 3 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="flex-1 p-5 rounded-[1.5rem] border-2 border-slate-200 font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
          >
            Go Back
          </button>
        )}
        <button 
          onClick={() => {
            if (step < 2) setStep(step + 1);
            else if (step === 2) handleComplete();
            else onFinish();
          }}
          className="flex-[3] p-5 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black transition-all active:scale-[0.98] shadow-2xl shadow-indigo-100 uppercase tracking-widest text-[10px]"
        >
          {step < 2 ? 'Next Step' : step === 2 ? 'Generate Analysis' : 'Finish & Exit'}
        </button>
      </div>
    </motion.div>
  );
}

function HistoryView({ records, onDelete }: { records: PapsRecord[], onDelete: (id: string) => void }) {
  const [selectedRecord, setSelectedRecord] = useState<PapsRecord | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async (record: PapsRecord) => {
    if (!reportRef.current) return;
    
    try {
      await document.fonts.ready;
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`PAPS_Report_${record.name || '학생'}_${record.date}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF 생성 오류: 브라우저 환경에 따라 작동하지 않을 수 있습니다. 새 탭에서 열기 기능을 권장합니다.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">측정 히스토리</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">Past measurement logs</p>
        </div>
        <div className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 shadow-sm">{records.length} ENTRIES</div>
      </header>
      
      <div className="space-y-5">
        {records.map(record => (
          <div 
            key={record.id} 
            className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300"
            onClick={() => setSelectedRecord(record)}
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-slate-50 ${getOverallGradeColor(record.overallGrade)}`}>
                {record.overallGrade}
              </div>
              <div>
                <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{record.gradeLevel} 학년도 측정</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{record.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xl font-black text-slate-900 tracking-tighter">{record.totalScore}<span className="text-[10px] text-slate-300 ml-1">pts</span></p>
                <div className="flex gap-1.5 mt-1.5 justify-end">
                  {Object.values(record.measurements).map((m, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${getGradeBg(m?.grade)} shadow-sm`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(record.id); }}
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                  <ChevronRight size={24} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <div className="py-24 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
            <Activity size={48} className="mx-auto text-slate-100 mb-4" />
            <p className="text-slate-300 font-black uppercase tracking-widest text-sm">No measurements found</p>
          </div>
        )}
      </div>

      {/* Modal for detail */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 text-slate-800">
            <motion.div 
              initial={{ y: 100, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 100, opacity: 0 }}
              className="bg-slate-50 w-full max-w-2xl rounded-t-[3rem] sm:rounded-[3rem] p-8 md:p-10 max-h-[92vh] overflow-y-auto shadow-2xl relative"
            >
              <div ref={reportRef} className="bg-slate-50 p-2 md:p-4 rounded-[2rem]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{selectedRecord.gradeLevel} 측정 상세 리포트</h3>
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest leading-loose">{selectedRecord.date} • {selectedRecord.gender === 'male' ? '남학생' : '여학생'}</p>
                  </div>
                  <button onClick={() => setSelectedRecord(null)} className="p-3 bg-white rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm">
                    <PlusCircle className="rotate-45" size={24} />
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-10">
                   <div className="flex-1 flex gap-6 items-center bg-indigo-50/50 p-6 rounded-[2.5rem] border border-indigo-100/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-bl-[4rem] opacity-50" />
                      <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shrink-0 relative z-10">
                        {selectedRecord.overallGrade}
                      </div>
                      <div className="relative z-10">
                        <p className="text-indigo-700 font-black text-lg uppercase tracking-tight leading-none mb-1">상태 분석 완료</p>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="text-slate-600 text-xs font-black tracking-widest uppercase">Total Score: {selectedRecord.totalScore}/100</span>
                        </div>
                      </div>
                   </div>
                   <div className="w-full md:w-64 h-48 bg-white rounded-[2.5rem] border border-slate-100 p-4 shrink-0 shadow-sm">
                      <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                           { subject: '심폐', A: selectedRecord.measurements['심폐지구력']?.grade || 5, fullMark: 5 },
                           { subject: '유연', A: selectedRecord.measurements['유연성']?.grade || 5, fullMark: 5 },
                           { subject: '근력', A: selectedRecord.measurements['근력·근지구력']?.grade || 5, fullMark: 5 },
                           { subject: '순발', A: selectedRecord.measurements['순발력']?.grade || 5, fullMark: 5 },
                           { subject: '비만', A: selectedRecord.measurements['비만']?.grade || 5, fullMark: 5 },
                         ].map(d => ({ ...d, A: 6 - d.A }))}>
                           <PolarGrid stroke="#f1f5f9" />
                           <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 900 }} />
                           <Radar name="Balance" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
                         </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {Object.entries(selectedRecord.measurements).map(([area, measurement]) => {
                    const m = measurement as PapsMeasurement;
                    return (
                      <div key={area} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-indigo-50 hover:border-indigo-100 group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                             <div className={`p-1.5 rounded-lg ${getGradeTextColor(m.grade)}`}>
                               {getAreaIcon(area as PapsArea, 18)}
                             </div>
                             <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{area}</span>
                          </div>
                          <span className={`text-base font-black ${getGradeTextColor(m.grade)}`}>{m.grade}급</span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-3 px-1">
                           <span className="text-xs font-black text-slate-800">{m.item}</span>
                           <span className="text-sm font-black text-slate-900 tracking-tighter">{m.value}{getUnit(m.item || '')}</span>
                        </div>

                        <div className="p-3 bg-indigo-50/50 rounded-xl mb-4">
                           <ul className="space-y-1">
                              {getPrescription(area as PapsArea, m.grade || 5).map((p, idx) => (
                                <li key={idx} className="text-[9px] text-indigo-700 font-bold leading-tight flex gap-1.5">
                                   <div className="w-1 h-1 bg-indigo-300 rounded-full mt-1 shrink-0" />
                                   {p}
                                </li>
                              ))}
                           </ul>
                        </div>

                        {m.item && EXERCISE_INFO[m.item as PapsItem] && (
                          <div className="pt-3 border-t border-slate-50 space-y-2">
                             <div>
                                <span className="text-[8px] font-black text-emerald-600 uppercase flex items-center gap-1 leading-none tracking-widest">Technique Tips</span>
                                <p className="text-[9px] text-slate-500 font-medium mt-1 leading-normal italic">
                                  {EXERCISE_INFO[m.item as PapsMeasurement['item']].tips.join(' • ')}
                                </p>
                             </div>
                             <div>
                                <span className="text-[8px] font-black text-rose-500 uppercase flex items-center gap-1 leading-none tracking-widest">Common Mistakes</span>
                                <p className="text-[9px] text-slate-400 font-medium mt-1 leading-normal">
                                  {EXERCISE_INFO[m.item as PapsMeasurement['item']].mistakes.join(', ')}
                                </p>
                             </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button 
                  onClick={() => downloadPDF(selectedRecord)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
                >
                  <FileText size={18} className="group-hover:scale-110 transition-transform" />
                  운동 보고서 PDF 다운로드 (원페이지)
                </button>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="w-full py-3 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-all"
                >
                  Close Detailed Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Profile({ profile, recordsCount, onDownloadBackup, onLogout }: { profile: UserProfile | null, recordsCount: number, onDownloadBackup: () => void, onLogout: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 text-center pt-10">
      <div className="w-40 h-40 bg-white rounded-[3rem] mx-auto flex items-center justify-center relative border-8 border-slate-100 shadow-2xl shadow-indigo-100/30">
        <div className="w-full h-full rounded-[2.5rem] bg-indigo-50 flex items-center justify-center">
          <User size={80} className="text-indigo-600 opacity-80" />
        </div>
        <div className="absolute -right-2 -bottom-2 bg-indigo-600 p-4 rounded-3xl text-white shadow-xl ring-8 ring-white">
          <ClipboardCheck size={28} />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          <span className="text-indigo-600">{profile?.name}</span>님, 안녕하세요!
        </h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-3 italic tracking-[.3em] leading-relaxed">Precision diagnostics for extreme potential.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <StatCard label="Measures" value={recordsCount} />
        <StatCard label="Rank" value="MVP" />
        <StatCard label="XP" value={recordsCount * 150} />
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10" />
        <h3 className="text-lg font-black tracking-tight text-slate-900 mb-8 relative z-10 uppercase tracking-widest flex items-center gap-2">
           <Zap size={20} className="text-indigo-600" /> 애플리케이션 제어
        </h3>
        <div className="space-y-6 relative z-10">
           <button 
             onClick={onDownloadBackup}
             className="w-full flex justify-between items-center p-4 hover:bg-slate-50 transition-all rounded-2xl group border border-transparent hover:border-slate-100"
           >
             <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Download size={20} /></div>
                <span className="font-black text-slate-700">전체 기록 백업 (JSON)</span>
             </div>
             <ChevronRight className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" size={20} />
           </button>
           
           <div className="h-px bg-slate-50" />
           
           <button 
             onClick={onLogout}
             className="w-full flex justify-between items-center p-4 hover:bg-rose-50 transition-all rounded-2xl group border border-transparent hover:border-rose-100"
           >
             <div className="flex items-center gap-4 text-rose-500">
                <div className="p-3 bg-rose-50 text-rose-500 rounded-xl"><Lock size={20} /></div>
                <span className="font-black">다른 이름으로 시작 (로그아웃)</span>
             </div>
             <ChevronRight className="text-rose-300 group-hover:translate-x-1 transition-all" size={20} />
           </button>
        </div>
      </div>
    </motion.div>
  );
}

const StatCard = ({ label, value }: any) => (
  <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col items-center group hover:border-indigo-200 transition-all">
    <p className="text-[9px] text-slate-400 mb-2 font-black uppercase tracking-widest">{label}</p>
    <p className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{value}</p>
  </div>
);

// --- Helpers ---

function getGradeTextColor(grade?: number) {
  switch (grade) {
    case 1: return 'text-emerald-500';
    case 2: return 'text-indigo-600';
    case 3: return 'text-amber-500';
    case 4: return 'text-rose-500';
    default: return 'text-slate-400';
  }
}

function getGradeBg(grade?: number) {
  switch (grade) {
    case 1: return 'bg-emerald-500';
    case 2: return 'bg-blue-500';
    case 3: return 'bg-orange-400';
    case 4: return 'bg-rose-400';
    case 5: return 'bg-gray-400';
    default: return 'bg-gray-200';
  }
}

function getOverallGradeColor(grade: number) {
  switch (grade) {
    case 1: return 'bg-gradient-to-br from-emerald-400 to-emerald-600';
    case 2: return 'bg-gradient-to-br from-blue-400 to-blue-600';
    case 3: return 'bg-gradient-to-br from-orange-400 to-orange-600';
    case 4: return 'bg-gradient-to-br from-rose-400 to-rose-600';
    default: return 'bg-gradient-to-br from-gray-400 to-gray-600';
  }
}

function getAreaIcon(area: PapsArea, size = 24) {
  switch (area) {
    case '심폐지구력': return <Heart size={size} />;
    case '유연성': return <Activity size={size} />;
    case '근력·근지구력': return <Dumbbell size={size} />;
    case '순발력': return <Zap size={size} />;
    case '비만': return <Scale size={size} />;
    default: return <Activity size={size} />;
  }
}

function getItemsByArea(area: string): PapsItem[] {
  switch (area) {
    case '심폐지구력': return ['왕복오래달리기', '오래달리기-걷기', '스텝검사'];
    case '유연성': return ['앉아윗몸앞으로굽히기', '종합유연성'];
    case '근력·근지구력': return ['윗몸말아올리기', '팔굽혀펴기', '악력'];
    case '순발력': return ['제자리멀리뛰기', '50m달리기'];
    case '비만': return ['BMI'];
    default: return [];
  }
}

function getUnit(item: string) {
  if (item === '왕복오래달리기' || item === '윗몸말아올리기' || item === '팔굽혀펴기') return '회';
  if (item === '오래달리기-걷기' || item === '50m달리기') return '초';
  if (item === '앉아윗몸앞으로굽히기' || item === '제자리멀리뛰기') return 'cm';
  if (item === '악력') return 'kg';
  if (item === '종합유연성' || item === '스텝검사') return '점';
  return '';
}

function getPrescription(area: PapsArea, grade: number) {
  const p = EXERCISE_PRESCRIPTIONS[area];
  if (!p) return [];
  if (grade <= 1) return p.high;
  if (grade <= 3) return p.mid;
  return p.low;
}
