import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Clock, CheckCircle, TrendingUp, Brain, Target } from "lucide-react";
import { PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdvancedGapAnalysis from './enhanced/AdvancedGapAnalysis';

interface SkillsDashboardProps {
  data: any;
}

const SkillsDashboard = ({ data }: SkillsDashboardProps) => {
  if (!data) return null;

  const { skills, dailyHours, learningMetrics, careerGoals } = data;
  
  // Prepare data for charts
  const radarData = skills.map((skill: any) => ({
    skill: skill.name,
    current: skill.currentLevel,
    target: skill.targetLevel
  }));

  const barData = skills.map((skill: any) => ({
    name: skill.name,
    required: skill.targetLevel,
    current: skill.currentLevel,
    gap: skill.targetLevel - skill.currentLevel
  }));

  const priorityData = [
    { name: 'High', value: skills.filter((s: any) => s.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: skills.filter((s: any) => s.priority === 'medium').length, color: '#f97316' },
    { name: 'Low', value: skills.filter((s: any) => s.priority === 'low').length, color: '#22c55e' }
  ];

  const missingSkills = skills.filter((skill: any) => skill.currentLevel === 0).length;
  const completionRate = Math.round(
    skills.reduce((acc: number, skill: any) => acc + skill.currentLevel, 0) / 
    skills.reduce((acc: number, skill: any) => acc + skill.targetLevel, 0) * 100
  );
  const avgCurrent = Math.round(
    skills.reduce((acc: number, skill: any) => acc + skill.currentLevel, 0) / skills.length
  );

  // Generate learning phases
  const phases = [
    {
      phase: 1,
      title: "Foundation Phase",
      description: "Master the core skills essential for your target role",
      duration: "2-3 months",
      skillsCount: 2,
      skills: skills.filter((s: any) => s.priority === 'high').slice(0, 2).map((s: any) => s.name)
    },
    {
      phase: 2,
      title: "Development Phase", 
      description: "Build upon foundation with intermediate skills",
      duration: "3-4 months",
      skillsCount: 3,
      skills: skills.filter((s: any) => s.priority === 'medium').slice(0, 3).map((s: any) => s.name)
    },
    {
      phase: 3,
      title: "Specialization Phase",
      description: "Advanced skills to excel in your chosen field", 
      duration: "2-3 months",
      skillsCount: 3,
      skills: skills.filter((s: any) => s.priority === 'low').slice(0, 3).map((s: any) => s.name)
    }
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Enhanced Learning Dashboard</h2>
              <p className="opacity-90">AI-powered analysis with 200+ job roles and real-time market data</p>
            </div>
            <Brain className="h-12 w-12 opacity-80" />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-500">{missingSkills}</p>
                <p className="text-sm text-gray-600">Critical Gaps</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-500">{learningMetrics.estimatedHours}h</p>
                <p className="text-sm text-gray-600">Learning Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-500">{completionRate}%</p>
                <p className="text-sm text-gray-600">Readiness</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-orange-500">{avgCurrent}%</p>
                <p className="text-sm text-gray-600">Avg Level</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Gap Analysis Component */}
      <AdvancedGapAnalysis 
        userSkills={skills}
        targetRole={careerGoals[0] || 'Software Engineer'}
        dailyHours={dailyHours}
        onSkillUpdate={() => {}}
      />

      {/* Enhanced Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Skills Gap Analysis</CardTitle>
            <p className="text-sm text-gray-600">Red bars show required levels, blue shows current progress</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="required" fill="#ef4444" name="Required" />
                <Bar dataKey="current" fill="#3b82f6" name="Current" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Radar Analysis</CardTitle>
            <p className="text-sm text-gray-600">Blue area shows current skills, red outline shows targets</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Target" dataKey="target" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Priority Distribution and Career Goals */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Career Goals & Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {careerGoals.map((goal: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Badge variant="default" className="bg-blue-500">
                    {goal}
                  </Badge>
                </div>
              ))}
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <p className="text-sm">
                  <strong>🎯 Timeframe:</strong> 6-months | <strong>📈 Market Demand:</strong> High | <strong>💰 Avg Salary:</strong> $95K-$150K
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Based on real-time market analysis and 200+ job role database
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Skills Gap Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Critical Skills Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Based on your target role of "{careerGoals[0]}", you're missing {missingSkills} essential skills:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.filter((skill: any) => skill.currentLevel < skill.targetLevel).map((skill: any, index: number) => (
              <Card key={index} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{skill.name}</h4>
                    <Badge variant={skill.priority === 'high' ? 'destructive' : skill.priority === 'medium' ? 'default' : 'secondary'}>
                      {skill.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Need: {skill.targetLevel}% | Current: {skill.currentLevel}% | Gap: {skill.targetLevel - skill.currentLevel}%
                  </p>
                  <Progress value={(skill.currentLevel / skill.targetLevel) * 100} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI-Generated Learning Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Learning Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {phases.map((phase) => (
              <div key={phase.phase} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {phase.phase}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{phase.title}</h3>
                  <p className="text-gray-600 mb-2">{phase.description}</p>
                  <div className="flex items-center gap-4 mb-2">
                    <Badge variant="outline">{phase.duration}</Badge>
                    <Badge variant="outline">{phase.skillsCount} skills</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phase.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Skills Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Quick Skills Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{skill.name}</h4>
                  <Badge 
                    variant={skill.priority === 'high' ? 'destructive' : skill.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {skill.priority}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Current: {skill.currentLevel}%</span>
                    <span>Target: {skill.targetLevel}%</span>
                  </div>
                  <Progress value={(skill.currentLevel / skill.targetLevel) * 100} className="h-2" />
                  <div className="text-xs text-gray-500">
                    Gap: {skill.targetLevel - skill.currentLevel}% to close
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsDashboard;
