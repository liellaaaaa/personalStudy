import { useState, useMemo } from 'react';
import { ChevronRight, Trophy, Star, Heart, ChevronLeft, MoreVertical, Wifi, Battery, Signal, Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { Progress } from './components/ui/progress';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';

// Mock data - 完整数据
const allCourseData = [
  { rank: 1, name: '高建华的经营方法论', duration: 12.7, color: '#3b82f6' },
  { rank: 2, name: '给决策者的战略课', duration: 7.0, color: '#8b5cf6' },
  { rank: 3, name: 'AI视频教程 | 零基础...', duration: 4.8, color: '#ec4899' },
  { rank: 4, name: 'AIGC 10倍办公效率...', duration: 3.2, color: '#f59e0b' },
  { rank: 5, name: '大模型的商业新范式...', duration: 2.1, color: '#10b981' }
];

const allExamData = [
  { date: '2026-04-15', course: '高建华的经营方法论', result: '及格', isPassed: true },
  { date: '2026-03-20', course: '给决策者的战略课', result: '及格', isPassed: true },
  { date: '2026-02-10', course: 'AI视频教程 | 零基础...', result: '不及格', isPassed: false },
  { date: '2026-01-25', course: 'AIGC 10倍办公效率...', result: '及格', isPassed: true }
];

const currentCourse = {
  name: '高建华的经营方法论',
  progress: 45,
  status: '学习中'
};

// 生成日历数据
const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

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

  // 计算筛选后的数据
  const filteredData = useMemo(() => {
    if (!startDate || !endDate) {
      // 无筛选 - 返回全部数据
      return {
        totalTime: 29.8,
        courses: allCourseData,
        exams: allExamData,
        examStats: { total: 4, passed: 3, failed: 1, passRate: 75 }
      };
    }

    // 计算筛选的天数
    const selectedDays = endDate - startDate + 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const ratio = selectedDays / daysInMonth;

    // 模拟筛选后的数据 - 按比例缩减
    const filteredTime = (29.8 * ratio).toFixed(1);
    const filteredCourses = allCourseData.map(course => ({
      ...course,
      duration: +(course.duration * ratio).toFixed(1)
    }));

    // 筛选考试记录
    const filteredExams = allExamData.filter(exam => {
      const examDay = parseInt(exam.date.split('-')[2]);
      return examDay >= startDate && examDay <= endDate && parseInt(exam.date.split('-')[1]) === currentMonth + 1;
    });

    const passed = filteredExams.filter(e => e.isPassed).length;
    const passRate = filteredExams.length > 0 ? Math.round((passed / filteredExams.length) * 100) : 0;

    return {
      totalTime: parseFloat(filteredTime),
      courses: filteredCourses,
      exams: filteredExams,
      examStats: {
        total: filteredExams.length,
        passed,
        failed: filteredExams.length - passed,
        passRate
      }
    };
  }, [startDate, endDate, currentMonth, currentYear]);

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
      return `${currentYear}年${currentMonth + 1}月${startDate}日 - ${endDate}日`;
    } else if (startDate) {
      return `${currentMonth + 1}月${startDate}日 - 选择结束日期`;
    }
    return '选择日期范围';
  };

  const isFiltered = startDate !== null && endDate !== null;

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
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">个人总学时</h3>
                  {isFiltered && (
                    <Badge className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5">已筛选</Badge>
                  )}
                </div>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="text-blue-600 p-1"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center mb-4">
                <p className="text-3xl font-semibold text-blue-600">{filteredData.totalTime}</p>
                <p className="text-xs text-gray-500">小时</p>
              </div>

              {/* Calendar Filter - Inline */}
              {showCalendar && (
                <div className="border rounded-lg p-3 bg-gray-50 mb-3">
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

                  {isFiltered && (
                    <button
                      onClick={() => { setStartDate(null); setEndDate(null); }}
                      className="mt-2 w-full text-xs text-gray-500 py-1 border rounded hover:bg-gray-50"
                    >
                      清除筛选
                    </button>
                  )}
                </div>
              )}

              {/* Course Distribution Chart */}
              <div className="mb-0">
                <p className="text-xs text-gray-600 mb-2">课程分布</p>
                <div className="space-y-2">
                  {filteredData.courses.map((course) => {
                    const percentage = ((course.duration / filteredData.totalTime) * 100).toFixed(1);
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
            <Card className="p-3 mb-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">当前课程</p>
                  <h3 className="text-sm font-medium">{currentCourse.name}</h3>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-700 active:text-blue-800 flex items-center gap-1 ml-2 flex-shrink-0">
                  继续学习 <ChevronRight className="w-3 h-3" />
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
                    {filteredData.examStats.total > 0 && (
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="12"
                        strokeDasharray={`${(filteredData.examStats.passed / filteredData.examStats.total) * 2 * Math.PI * 56} ${2 * Math.PI * 56}`}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px] text-gray-400">考试总数</p>
                    <p className="text-2xl font-semibold">{filteredData.examStats.total}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-600">及格</span>
                  </div>
                  <p className="text-xl font-semibold">{filteredData.examStats.passed}</p>
                  <p className="text-[10px] text-gray-400">{filteredData.examStats.passRate}%</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs text-gray-600">不及格</span>
                  </div>
                  <p className="text-xl font-semibold">{filteredData.examStats.failed}</p>
                  <p className="text-[10px] text-gray-400">{100 - filteredData.examStats.passRate}%</p>
                </div>
              </div>

              {/* Exam History Details */}
              {showExamDetails && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  {filteredData.exams.map((exam, index) => (
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

            {/* Learning Duration Ranking */}
            <Card className="p-4 mb-3 shadow-sm">
              <h3 className="text-sm font-medium mb-3">课程时长排行</h3>
              <div className="space-y-2">
                {filteredData.courses.map((course, index) => (
                  <div
                    key={course.rank}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg active:bg-gray-100 cursor-pointer"
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium text-white ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-gray-300'}`}>
                      {course.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{course.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-1">
                          <div
                            className="h-1 rounded-full"
                            style={{ width: `${((course.duration / filteredData.courses[0].duration) * 100).toFixed(0)}%`, backgroundColor: course.color }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500">{course.duration.toFixed(1)}h</span>
                      </div>
                    </div>
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