'use client';

import React, { useState } from 'react';
import { 
  Map, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  MoreHorizontal,
  LayoutDashboard
} from 'lucide-react';

// --- Types ---

type Role = 'CRP' | 'ARP' | 'BRP';

type Status = 'immediate' | 'follow-up' | 'doing-okay';

interface Teacher {
  id: string;
  name: string;
  school: string;
  status: Status;
  lastVisit: string;
  issues: string[];
  grade: string;
  subject: string;
  advice: string;
  actionTaken: boolean;
  suggestedModules: string[];
}

interface ClusterStats {
  id: string;
  name: string;
  engagement: number;
  issues: number;
  trend: 'up' | 'down' | 'stable';
}

// --- Mock Data ---

const TEACHERS_DATA: Teacher[] = [
  {
    id: 'T1',
    name: 'Anita Sharma',
    school: 'GPS Sector 12',
    status: 'immediate',
    lastVisit: '2024-01-15',
    issues: ['Classroom Management', 'Lesson Planning'],
    grade: 'Grade 5',
    subject: 'Math',
    advice: 'Use more visual aids for fractions.',
    actionTaken: false,
    suggestedModules: ['Visual Math Basics', 'Engaging Unruly Classes']
  },
  {
    id: 'T2',
    name: 'Rajesh Kumar',
    school: 'GPS Sector 4',
    status: 'follow-up',
    lastVisit: '2024-01-20',
    issues: ['Student Engagement'],
    grade: 'Grade 7',
    subject: 'Science',
    advice: 'Try the "Think-Pair-Share" activity.',
    actionTaken: true,
    suggestedModules: ['Active Learning Strategies']
  },
  {
    id: 'T3',
    name: 'Sunita Verma',
    school: 'GPS Sector 8',
    status: 'doing-okay',
    lastVisit: '2024-01-10',
    issues: [],
    grade: 'Grade 4',
    subject: 'English',
    advice: 'Continue with the current reading program.',
    actionTaken: true,
    suggestedModules: ['Advanced Storytelling']
  },
  {
    id: 'T4',
    name: 'Vikram Singh',
    school: 'GPS Sector 12',
    status: 'immediate',
    lastVisit: '2023-12-28',
    issues: ['Assessment Methods', 'Subject Knowledge'],
    grade: 'Grade 8',
    subject: 'Math',
    advice: 'Review algebraic concepts before next class.',
    actionTaken: false,
    suggestedModules: ['Algebra Foundations', 'Formative Assessment']
  },
  {
    id: 'T5',
    name: 'Priya Patel',
    school: 'GPS Sector 2',
    status: 'follow-up',
    lastVisit: '2024-01-18',
    issues: ['Time Management'],
    grade: 'Grade 3',
    subject: 'EVS',
    advice: 'Stick to the lesson timeline.',
    actionTaken: true,
    suggestedModules: ['Effective Time Management']
  }
];

const CLUSTER_STATS: ClusterStats[] = [
  { id: 'C1', name: 'Cluster A (North)', engagement: 78, issues: 12, trend: 'up' },
  { id: 'C2', name: 'Cluster B (East)', engagement: 65, issues: 24, trend: 'down' },
  { id: 'C3', name: 'Cluster C (South)', engagement: 82, issues: 8, trend: 'stable' },
  { id: 'C4', name: 'Cluster D (West)', engagement: 71, issues: 15, trend: 'up' },
];

// --- Components ---

const StatusBadge = ({ status }: { status: Status }) => {
  const styles = {
    immediate: 'bg-red-100 text-red-700 border-red-200',
    'follow-up': 'bg-orange-100 text-orange-700 border-orange-200',
    'doing-okay': 'bg-green-100 text-green-700 border-green-200',
  };

  const labels = {
    immediate: 'Needs Support',
    'follow-up': 'Follow Up',
    'doing-okay': 'Doing Well',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, action }: { title: string; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    {action}
  </div>
);

// --- Views ---

const CRPView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Visits</p>
              <h4 className="text-2xl font-bold text-gray-800">12</h4>
            </div>
            <div className="p-3 bg-orange-50 rounded-full text-orange-600">
              <Map className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Critical Issues</p>
              <h4 className="text-2xl font-bold text-gray-800">5</h4>
            </div>
            <div className="p-3 bg-red-50 rounded-full text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tasks Completed</p>
              <h4 className="text-2xl font-bold text-gray-800">28</h4>
            </div>
            <div className="p-3 bg-green-50 rounded-full text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teacher Priority List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <SectionHeader 
              title="Teacher Priority List" 
              action={
                <button className="text-sm text-orange-600 font-medium hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 font-semibold text-gray-500">Teacher</th>
                    <th className="pb-3 font-semibold text-gray-500">School</th>
                    <th className="pb-3 font-semibold text-gray-500">Status</th>
                    <th className="pb-3 font-semibold text-gray-500">Last Visit</th>
                    <th className="pb-3 font-semibold text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {TEACHERS_DATA.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3">
                        <div className="font-medium text-gray-800">{teacher.name}</div>
                        <div className="text-xs text-gray-500">{teacher.subject} • {teacher.grade}</div>
                      </td>
                      <td className="py-3 text-gray-600">{teacher.school}</td>
                      <td className="py-3"><StatusBadge status={teacher.status} /></td>
                      <td className="py-3 text-gray-500">{teacher.lastVisit}</td>
                      <td className="py-3">
                        <button className="text-gray-400 hover:text-orange-600">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* Last Visit Notes & Actions */}
          <Card className="p-6">
            <SectionHeader title="Recent Visit Insights" />
            <div className="space-y-4">
              {TEACHERS_DATA.slice(0, 2).map(teacher => (
                <div key={teacher.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{teacher.name}</span>
                      <span className="text-xs text-gray-400">| {teacher.lastVisit}</span>
                    </div>
                    {teacher.actionTaken ? 
                      <span className="text-xs flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Tried
                      </span> : 
                      <span className="text-xs flex items-center gap-1 text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    }
                  </div>
                  <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Advice:</span> {teacher.advice}</p>
                  <div className="flex gap-2 mt-2">
                     {teacher.suggestedModules.map(module => (
                       <span key={module} className="text-xs px-2 py-1 bg-white border border-orange-100 text-orange-700 rounded-md">
                         {module}
                       </span>
                     ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
           {/* Teacher Issue Summary */}
           <Card className="p-6">
             <SectionHeader title="Recurring Issues" />
             <div className="space-y-4">
               {[
                 { label: 'Classroom Management', count: 12, color: 'bg-red-500' },
                 { label: 'Lesson Planning', count: 8, color: 'bg-orange-500' },
                 { label: 'Student Engagement', count: 7, color: 'bg-yellow-500' },
                 { label: 'Use of TLM', count: 5, color: 'bg-blue-500' },
               ].map((item) => (
                 <div key={item.label}>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-600">{item.label}</span>
                     <span className="font-medium text-gray-800">{item.count}</span>
                   </div>
                   <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                     <div className={`h-full ${item.color}`} style={{ width: `${(item.count / 15) * 100}%` }}></div>
                   </div>
                 </div>
               ))}
             </div>
           </Card>

           {/* Suggested Support Actions */}
           <Card className="p-6 bg-orange-50 border-orange-100">
             <SectionHeader title="Next Visit Focus" />
             <ul className="space-y-3">
               {[
                 'Observe "Do Now" activities in Grade 5 Math.',
                 'Check if TLM is being used in Science classes.',
                 'Discuss student attendance with Headmaster.',
               ].map((action, i) => (
                 <li key={i} className="flex gap-3 items-start text-sm text-gray-700">
                   <div className="mt-0.5 min-w-4 min-h-4 rounded-full border border-orange-300 flex items-center justify-center bg-white">
                     <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                   </div>
                   {action}
                 </li>
               ))}
             </ul>
             <button className="w-full mt-4 py-2 bg-white border border-orange-200 text-orange-700 text-sm font-medium rounded-lg hover:bg-orange-100 transition">
               Generate Visit Plan
             </button>
           </Card>
        </div>
      </div>
    </div>
  );
};

const ARPView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Cluster Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CLUSTER_STATS.map((cluster) => (
          <Card key={cluster.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-800">{cluster.name}</h4>
              {cluster.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
              {cluster.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
              {cluster.trend === 'stable' && <MoreHorizontal className="w-4 h-4 text-gray-400" />}
            </div>
            <div className="space-y-2 mt-4">
               <div>
                 <div className="flex justify-between text-xs text-gray-500 mb-1">
                   <span>Engagement</span>
                   <span>{cluster.engagement}%</span>
                 </div>
                 <div className="h-1.5 bg-gray-100 rounded-full">
                   <div className="h-full bg-orange-500 rounded-full" style={{ width: `${cluster.engagement}%` }}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-xs text-gray-500 mb-1">
                   <span>Open Issues</span>
                   <span>{cluster.issues}</span>
                 </div>
                 <div className="h-1.5 bg-gray-100 rounded-full">
                   <div className="h-full bg-red-400 rounded-full" style={{ width: `${(cluster.issues / 30) * 100}%` }}></div>
                 </div>
               </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recurring Teacher Problems (Trend Visualization) */}
        <Card className="lg:col-span-2 p-6">
          <SectionHeader title="Recurring Teacher Problems Trend" />
          <div className="h-64 flex items-end justify-between gap-2 px-2 pb-2 border-b border-l border-gray-200">
             {[35, 42, 38, 45, 30, 25, 20].map((h, i) => (
               <div key={i} className="w-full flex flex-col items-center gap-2 group">
                 <div 
                   className="w-full bg-orange-200 group-hover:bg-orange-400 transition-colors rounded-t-sm relative" 
                   style={{ height: `${h * 2}px` }}
                 >
                   <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                     {h} Issues
                   </div>
                 </div>
                 <span className="text-xs text-gray-500">W{i+1}</span>
               </div>
             ))}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-orange-400 rounded-sm"></div> Classroom Mgmt
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-blue-400 rounded-sm"></div> Pedagogy
             </div>
          </div>
        </Card>

        {/* Teachers Needing Escalation */}
        <Card className="p-6">
          <SectionHeader title="Escalations" action={<span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">3 Critical</span>} />
          <div className="space-y-4">
             {[
               { name: 'Rohan Gupta', school: 'GPS Sector 1', reason: 'Absenteeism' },
               { name: 'Meena K', school: 'GPS Sector 9', reason: 'Performance' },
               { name: 'Suresh L', school: 'GPS Sector 3', reason: 'Compliance' },
             ].map((t, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-lg">
                 <div>
                   <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                   <p className="text-xs text-gray-500">{t.school}</p>
                 </div>
                 <span className="text-xs font-medium text-red-600 bg-white px-2 py-1 border border-red-200 rounded">
                   {t.reason}
                 </span>
               </div>
             ))}
          </div>
          <button className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 py-2 border border-dashed border-gray-300 rounded-lg">
            + Report New Escalation
          </button>
        </Card>
      </div>

      {/* Mini-Module Effectiveness */}
      <Card className="p-6">
        <SectionHeader title="Mini-Module Effectiveness" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: 'Most Used', name: 'Fraction Basics', stat: '142 uses', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
             { title: 'Most Effective', name: 'Storytelling L2', stat: '94% success', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
             { title: 'Ignored', name: 'Geometry Adv', stat: '12 uses', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
               <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
                 <item.icon className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-xs text-gray-500 font-medium uppercase">{item.title}</p>
                 <p className="font-bold text-gray-800">{item.name}</p>
                 <p className="text-sm text-gray-600">{item.stat}</p>
               </div>
             </div>
           ))}
        </div>
      </Card>
    </div>
  );
};

const BRPView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Block-Level Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col justify-between">
           <h3 className="text-gray-500 font-medium text-sm">Teacher Health Score</h3>
           <div className="flex items-end gap-2 mt-2">
             <span className="text-4xl font-bold text-gray-800">72%</span>
             <span className="text-sm text-green-600 mb-1 flex items-center">
               <TrendingUp className="w-3 h-3 mr-1" /> +4%
             </span>
           </div>
           <div className="w-full h-2 bg-gray-100 rounded-full mt-4 flex overflow-hidden">
             <div className="h-full bg-green-500" style={{ width: '60%' }}></div>
             <div className="h-full bg-yellow-400" style={{ width: '25%' }}></div>
             <div className="h-full bg-red-400" style={{ width: '15%' }}></div>
           </div>
           <div className="flex justify-between mt-2 text-xs text-gray-500">
             <span>Stable</span>
             <span>Improving</span>
             <span>Struggling</span>
           </div>
        </Card>

        <Card className="p-6 md:col-span-2">
           <SectionHeader title="Support Impact Summary (Pre vs Post)" />
           <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-600">Student Participation</span>
                   <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+15%</span>
                 </div>
                 <div className="h-2 bg-gray-100 rounded-full relative">
                   <div className="absolute top-0 left-0 h-full bg-gray-300 w-[60%] rounded-full"></div>
                   <div className="absolute top-0 left-0 h-full bg-orange-500 w-[75%] opacity-50 rounded-full"></div>
                 </div>
                 <div className="flex justify-between text-xs text-gray-400">
                   <span>Before Support</span>
                   <span>Current</span>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-600">Lesson Completion</span>
                   <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+8%</span>
                 </div>
                 <div className="h-2 bg-gray-100 rounded-full relative">
                   <div className="absolute top-0 left-0 h-full bg-gray-300 w-[70%] rounded-full"></div>
                   <div className="absolute top-0 left-0 h-full bg-orange-500 w-[78%] opacity-50 rounded-full"></div>
                 </div>
              </div>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade/Subject Heatmap */}
        <Card className="lg:col-span-2 p-6">
          <SectionHeader title="Problem Heatmap" />
          <div className="overflow-x-auto">
            <div className="min-w-100">
              <div className="grid grid-cols-6 gap-2 text-sm text-center mb-2 font-medium text-gray-500">
                <div className="text-left">Subject</div>
                <div>G1</div>
                <div>G2</div>
                <div>G3</div>
                <div>G4</div>
                <div>G5</div>
              </div>
              {['Math', 'Science', 'English', 'EVS', 'Hindi'].map(subject => (
                <div key={subject} className="grid grid-cols-6 gap-2 mb-2 items-center">
                  <div className="text-sm font-medium text-gray-700">{subject}</div>
                  {[1, 2, 3, 4, 5].map(g => {
                    const intensity = Math.floor(Math.random() * 4); // 0 to 3
                    const colors = ['bg-gray-100', 'bg-orange-200', 'bg-orange-300', 'bg-red-400'];
                    return (
                      <div 
                        key={g} 
                        className={`h-8 rounded ${colors[intensity]} flex items-center justify-center text-xs text-gray-700 transition-transform hover:scale-105 cursor-pointer`}
                        title={`${subject} G${g}: ${intensity === 3 ? 'High' : 'Low'} Issues`}
                      >
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 justify-end">
             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-100 rounded"></div> Low</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-200 rounded"></div> Med</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded"></div> High Issues</div>
          </div>
        </Card>

        {/* Action & Planning Panel */}
        <Card className="p-6 bg-gray-900 text-white border-gray-800">
           <SectionHeader title="Action Plan" action={<Calendar className="w-5 h-5 text-gray-400" />} />
           <div className="space-y-6">
             <div>
               <h4 className="text-orange-400 text-sm font-medium uppercase mb-2">Priority Focus</h4>
               <p className="text-gray-300 text-sm leading-relaxed">
                 Grade 5 Math performance in Cluster B has dropped. Schedule training session for CRPs on &quot;Fraction Pedagogy&quot;.
               </p>
             </div>
             
             <div>
               <h4 className="text-orange-400 text-sm font-medium uppercase mb-2">Recommended Actions</h4>
               <ul className="space-y-3">
                 {[
                   'Approve travel allowance for Cluster C team',
                   'Review "Science Kit" utilization report',
                   'Meeting with DIET Principal on Friday'
                 ].map((item, i) => (
                   <li key={i} className="flex gap-3 text-sm text-gray-300">
                     <div className="mt-1 w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center shrink-0">
                       <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                     </div>
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
             
             <button className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium transition">
               Create Monthly Plan
             </button>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeRole, setActiveRole] = useState<Role>('CRP');

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-orange-600 p-2 rounded-lg text-white">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Admin<span className="text-orange-600">Connect</span></span>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Role Switcher */}
               <div className="hidden md:flex bg-gray-100 p-1 rounded-lg">
                 {(['CRP', 'ARP', 'BRP'] as Role[]).map((role) => (
                   <button
                     key={role}
                     onClick={() => setActiveRole(role)}
                     className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                       activeRole === role 
                         ? 'bg-white text-orange-600 shadow-sm' 
                         : 'text-gray-500 hover:text-gray-700'
                     }`}
                   >
                     {role} View
                   </button>
                 ))}
               </div>
               
               <div className="h-8 w-px bg-gray-200 mx-2"></div>
               
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs">
                   AD
                 </div>
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeRole === 'CRP' && 'Cluster Resource Dashboard'}
            {activeRole === 'ARP' && 'Academic Resource Dashboard'}
            {activeRole === 'BRP' && 'Block Resource Planning'}
          </h1>
          <p className="text-gray-500 mt-1">
            {activeRole === 'CRP' && 'Manage teacher support and school visits for your cluster.'}
            {activeRole === 'ARP' && 'Analyze academic trends and effectiveness across clusters.'}
            {activeRole === 'BRP' && 'Strategic planning and health monitoring for the entire block.'}
          </p>
        </div>

        {/* Mobile Role Switcher (Visible only on small screens) */}
        <div className="md:hidden mb-6">
           <label className="block text-sm font-medium text-gray-700 mb-2">Select View</label>
           <select 
             className="w-full p-2 border border-gray-300 rounded-lg bg-white"
             value={activeRole}
             onChange={(e) => setActiveRole(e.target.value as Role)}
           >
             <option value="CRP">CRP View</option>
             <option value="ARP">ARP View</option>
             <option value="BRP">BRP View</option>
           </select>
        </div>

        {/* Dashboard Views */}
        {activeRole === 'CRP' && <CRPView />}
        {activeRole === 'ARP' && <ARPView />}
        {activeRole === 'BRP' && <BRPView />}
      </main>
    </div>
  );
}
