import { useState } from 'react';
import { ChevronRight, Trophy, Star, Heart, ChevronLeft, MoreVertical, Wifi, Battery, Signal, Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { Progress } from './components/ui/progress';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';

// Mock data
const currentCourse = {
  name: '高建华的经营方法论',
  progress: 45,
  status: '学习中'
};

const latestExam = {
  courseName: '高建华的经营方法论',
  result: '及格',
  date: '2026-04-15',
  isPassed: true
};

const examHistory = [
  { date: '2026-04-15', course: '高建华的经营方法论', result: '及格', isPassed: true },
  { date: '2026-03-20', course: '给决策者的战略课', result: '及格', isPassed: true },
  { date: '2026-02-10', course: 'AI视频教程 | 零基础...', result: '不及格', isPassed: false },
  { date: '2026-01-25', course: 'AIGC 10倍办公效率...', result: '及格', isPassed: true }
];

const learningAchievements = [
  { icon: Trophy, title: '总时长冠军', course: '高建华的经营方法论', value: '764分钟', color: 'from-amber-400 to-orange-500' },
  { icon: Star, title: '拓展学习之星', course: '给决策者的战略课', value: '422分钟', color: 'from-blue-400 to-indigo-500' },
  { icon: Heart, title: '最爱课程', course: 'AI视频教程 | 零基础...', value: '288分钟', color: 'from-pink-400 to-rose-500' }
];

const courseRankings = [
  { rank: 1, name: '高建华的经营方法论', duration: 12.7, emoji: '🏆', color: '#3b82f6' },
  { rank: 2, name: '给决策者的战略课', duration: 7.0, emoji: '🥈', color: '#8b5cf6' },
  { rank: 3, name: 'AI视频教程 | 零基础...', duration: 4.8, emoji: '🥉', color: '#ec4899' },
  { rank: 4, name: 'AIGC 10倍办公效率...', duration: 3.2, emoji: '4', color: '#f59e0b' },
  { rank: 5, name: '大模型的商业新范式...', duration: 2.1, emoji: '5', color: '#10b981' }
];

const totalStudyTime = 29.8; // 总学时（小时）

const passRateData = [
  { name: '高建华的经营方法论', rate: 92 },
  { name: '给决策者的战略课', rate: 85 },
  { name: 'AI视频教程 | 零基础...', rate: 78 },
  { name: 'AIGC 10倍办公效率...', rate: 88 },
  { name: '大模型的商业新范式...', rate: 81 }
];

// 生成日历数据
const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];

  // 填充空白
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // 填充日期
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
};

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export default function App() {
  const [showExamDetails, setShowExamDetails] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(3); // 4月
  const [startDate, setStartDate] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<number | null>(null);
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');
  const [showYearMonthMenu, setShowYearMonthMenu] = useState(false);

  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number | null) => {
    if (!day) return;

    if (selecting === 'start') {
      setStartDate(day);
      setEndDate(null);
      setSelecting('end');
    } else {
      if (day >= startDate!) {
        setEndDate(day);
        setSelecting('start');
        setShowCalendar(false);
      } else {
        // 如果选的结束日期早于开始日期，重新选开始日期
        setStartDate(day);
        setEndDate(null);
      }
    }
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    return day >= startDate && day <= endDate;
  };

  const getDateText = () => {
    if (startDate && endDate) {
      return `${startDate}月${endDate}日`;
    } else if (startDate) {
      return `${startDate}月 - 选择结束日期`;
    }
    return '选择日期范围';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Mobile Frame */}
      <div className="w-full max-w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative">
        {/* Status Bar */}
        <div className="bg-white px-6 pt-3 pb-2 flex items-center justify-between text-xs">
          <span className="font-semibold">15:58</span>
          <div className="flex items-center gap-1">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b">
          <ChevronLeft className="w-6 h-6" />
          <span className="font-medium">个人学习情况</span>
          <MoreVertical className="w-6 h-6" />
        </div>

        {/* Scrollable Content */}
        <div className="h-[calc(812px-88px)] overflow-y-auto bg-gray-50">
          {/* Module 1: Personal Learning Overview */}
          <div className="px-4 py-4">

            {/* Total Study Time with Course Distribution */}
            <Card className="p-4 mb-3 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium">个人总学时</h3>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="text-blue-600 p-1"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center mb-4">
                <p className="text-3xl font-semibold text-blue-600">{totalStudyTime}</p>
                <p className="text-xs text-gray-500">小时</p>
              </div>

              {/* Calendar Filter - Inline */}
              {showCalendar && (
                <div className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={prevMonth} className="p-1">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowYearMonthMenu(!showYearMonthMenu)}
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        {currentYear}年{currentMonth + 1}月
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {showYearMonthMenu && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-lg shadow-lg border z-10">
                          <button
                            onClick={() => {
                              setStartDate(1);
                              setEndDate(new Date(currentYear, currentMonth + 1, 0).getDate());
                              setShowYearMonthMenu(false);
                              setShowCalendar(false);
                            }}
                            className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                          >
                            筛选当月
                          </button>
                          <button
                            onClick={() => {
                              setStartDate(1);
                              setEndDate(new Date(currentYear, 11, 31).getDate());
                              setShowYearMonthMenu(false);
                              setShowCalendar(false);
                            }}
                            className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 whitespace-nowrap border-t"
                          >
                            筛选当年
                          </button>
                        </div>
                      )}
                    </div>
                    <button onClick={nextMonth} className="p-1">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                      <div key={day} className="text-center text-xs text-gray-400 py-1">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateClick(day)}
                        disabled={!day}
                        className={`
                          h-8 text-xs rounded flex items-center justify-center
                          ${!day ? 'invisible' : ''}
                          ${day && isInRange(day) ? 'bg-blue-100' : ''}
                          ${day === startDate ? 'bg-blue-600 text-white' : ''}
                          ${day === endDate ? 'bg-blue-600 text-white' : ''}
                          ${day && day !== startDate && day !== endDate ? 'hover:bg-gray-200' : ''}
                        `}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 text-center text-xs text-gray-500">
                    {getDateText()}
                  </div>
                </div>
              )}

              {/* Course Distribution Chart */}
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-2">课程分布</p>
                <div className="space-y-2">
                  {courseRankings.map((course) => {
                    const percentage = ((course.duration / totalStudyTime) * 100).toFixed(1);
                    return (
                      <div key={course.rank}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-700 truncate flex-1">{course.name}</span>
                          <span className="text-xs text-gray-500 ml-2">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{ width: `${percentage}%`, backgroundColor: course.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Current Course Progress */}
            <Card className="p-4 mb-3 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">当前课程</p>
                  <h3 className="text-sm font-medium mb-2">{currentCourse.name}</h3>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5">
                    {currentCourse.status}
                  </Badge>
                </div>
                <button className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-700 active:bg-blue-800 ml-2 flex-shrink-0">
                  继续学习
                </button>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">学习进度</span>
                  <span className="text-sm font-semibold text-blue-600">{currentCourse.progress}%</span>
                </div>
                <Progress value={currentCourse.progress} className="h-1.5" />
              </div>
            </Card>

            {/* Exam Status */}
            <Card className="p-4 mb-3 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">考试情况</h3>
                <button
                  onClick={() => setShowExamDetails(!showExamDetails)}
                  className="text-xs text-blue-600 hover:text-blue-700 active:text-blue-800 flex items-center gap-1"
                >
                  {showExamDetails ? '收起' : '查看更多'} <ChevronRight className={`w-3 h-3 transition-transform ${showExamDetails ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Exam Statistics Pie Chart */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="12"
                      strokeDasharray={`${(3/4) * 2 * Math.PI * 56} ${2 * Math.PI * 56}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px] text-gray-400">考试总数</p>
                    <p className="text-2xl font-semibold">4</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-600">及格</span>
                  </div>
                  <p className="text-xl font-semibold">3</p>
                  <p className="text-[10px] text-gray-400">75%</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs text-gray-600">不及格</span>
                  </div>
                  <p className="text-xl font-semibold">1</p>
                  <p className="text-[10px] text-gray-400">25%</p>
                </div>
              </div>

              {/* Exam History Details */}
              {showExamDetails && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  {examHistory.map((exam, index) => (
                    <div key={index} className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium">{exam.course}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{exam.date}</p>
                      </div>
                      <Badge className={`text-[10px] ml-2 ${exam.isPassed ? 'bg-green-500' : 'bg-red-500'}`}>
                        {exam.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Course Popularity Ranking */}
            <Card className="p-4 mb-3 shadow-sm">
              <h3 className="text-sm font-medium mb-3">课程学习时长排行TOP5</h3>
              <div className="space-y-2">
                {courseRankings.map((course) => (
                  <div
                    key={course.rank}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg active:bg-gray-100 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-semibold">
                      {course.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{course.name}</p>
                      <p className="text-[10px] text-gray-500">({course.duration.toFixed(1)} h)</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}