
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, X, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getAllJobRoles, searchJobRoles } from '@/services/skillsDatabase';

interface Skill {
  name: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'high' | 'medium' | 'low';
}

interface LearningSetupProps {
  onComplete: (data: any) => void;
}

const LearningSetup = ({ onComplete }: LearningSetupProps) => {
  const [careerGoals, setCareerGoals] = useState<string[]>(['']);
  const [skills, setSkills] = useState<Skill[]>([
    { name: '', currentLevel: 0, targetLevel: 80, priority: 'medium' }
  ]);
  const [dailyHours, setDailyHours] = useState<number[]>([6]);
  const [timeframe, setTimeframe] = useState<string>('');
  const [jobRoleSearch, setJobRoleSearch] = useState('');
  const [availableRoles] = useState(getAllJobRoles());
  const [filteredRoles, setFilteredRoles] = useState(availableRoles.slice(0, 20));

  const handleJobRoleSearch = (query: string) => {
    setJobRoleSearch(query);
    if (query.trim()) {
      const filtered = searchJobRoles(query);
      setFilteredRoles(filtered.slice(0, 20));
    } else {
      setFilteredRoles(availableRoles.slice(0, 20));
    }
  };

  const addCareerGoal = () => {
    setCareerGoals([...careerGoals, '']);
  };

  const updateCareerGoal = (index: number, value: string) => {
    const updated = [...careerGoals];
    updated[index] = value;
    setCareerGoals(updated);
  };

  const removeCareerGoal = (index: number) => {
    setCareerGoals(careerGoals.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    setSkills([...skills, { name: '', currentLevel: 0, targetLevel: 80, priority: 'medium' }]);
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const calculateLearningHours = () => {
    const totalSkillGaps = skills.reduce((total, skill) => {
      return total + (skill.targetLevel - skill.currentLevel);
    }, 0);
    
    // Enhanced calculation based on skill complexity
    const estimatedHours = totalSkillGaps * 4.5;
    const dailyHoursValue = dailyHours[0];
    const daysNeeded = Math.ceil(estimatedHours / dailyHoursValue);
    
    return { estimatedHours: Math.round(estimatedHours), daysNeeded };
  };

  const handleGenerate = () => {
    const validGoals = careerGoals.filter(goal => goal.trim() !== '');
    const validSkills = skills.filter(skill => skill.name.trim() !== '');
    
    if (validGoals.length === 0 || validSkills.length === 0 || !timeframe) {
      toast({
        title: "Incomplete Profile",
        description: "Please fill in all required fields before generating your dashboard.",
        variant: "destructive"
      });
      return;
    }

    const learningMetrics = calculateLearningHours();
    
    const data = {
      careerGoals: validGoals,
      skills: validSkills,
      dailyHours: dailyHours[0],
      timeframe,
      learningMetrics
    };

    toast({
      title: "Dashboard Generated!",
      description: "Your enhanced learning dashboard with 200+ job roles is ready.",
    });

    onComplete(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Learning Profile Setup</h1>
          <p className="text-gray-600">AI-powered analysis with 200+ job roles and comprehensive skill mapping</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Career Goals & Target Roles</CardTitle>
            <p className="text-sm text-gray-600">Choose from 200+ job roles with comprehensive skill requirements</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search job roles (e.g., Frontend Developer, Data Scientist, Product Manager)"
                value={jobRoleSearch}
                onChange={(e) => handleJobRoleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {jobRoleSearch && (
              <div className="border rounded-lg p-4 bg-gray-50 max-h-40 overflow-y-auto">
                <h4 className="font-medium mb-2">Suggested Roles:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredRoles.map((role) => (
                    <Button
                      key={role.id}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const emptyIndex = careerGoals.findIndex(goal => goal === '');
                        if (emptyIndex !== -1) {
                          updateCareerGoal(emptyIndex, role.title);
                        } else {
                          setCareerGoals([...careerGoals, role.title]);
                        }
                        setJobRoleSearch('');
                      }}
                      className="text-left justify-start"
                    >
                      <div>
                        <div className="font-medium">{role.title}</div>
                        <div className="text-xs text-gray-500">{role.category}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {careerGoals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="e.g., Software Engineer, Data Scientist, Full Stack Developer"
                  value={goal}
                  onChange={(e) => updateCareerGoal(index, e.target.value)}
                  className="flex-1"
                />
                {careerGoals.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCareerGoal(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addCareerGoal} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Career Goal
            </Button>
          </CardContent>
        </Card>

        {/* Enhanced Skills Assessment */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Enhanced Skills Assessment</CardTitle>
            <p className="text-sm text-gray-600">Rate your current skills - our AI will suggest 8-9 additional skills per role</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="e.g., React, Python, Machine Learning, Communication Skills"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    value={skill.priority}
                    onValueChange={(value) => updateSkill(index, 'priority', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  {skills.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Current Level: {skill.currentLevel}%</Label>
                    <Slider
                      value={[skill.currentLevel]}
                      onValueChange={(value) => updateSkill(index, 'currentLevel', value[0])}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Target Level: {skill.targetLevel}%</Label>
                    <Slider
                      value={[skill.targetLevel]}
                      onValueChange={(value) => updateSkill(index, 'targetLevel', value[0])}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addSkill} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </CardContent>
        </Card>

        {/* Enhanced Learning Schedule */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Learning Schedule & Commitment</CardTitle>
            <p className="text-sm text-gray-600">Optimize your learning hours for maximum efficiency</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Daily Learning Hours: {dailyHours[0]} hours</Label>
              <Slider
                value={dailyHours}
                onValueChange={setDailyHours}
                max={12}
                min={1}
                step={0.5}
                className="mt-2"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1h/day (casual)</span>
                <span>6h/day (intensive)</span>
                <span>12h/day (bootcamp)</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Based on {dailyHours[0]} hours/day, estimated completion: {calculateLearningHours().daysNeeded} days
              </p>
            </div>
            
            <div>
              <Label>Learning Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your preferred timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-months">3 months (Accelerated)</SelectItem>
                  <SelectItem value="6-months">6 months (Standard)</SelectItem>
                  <SelectItem value="12-months">12 months (Comprehensive)</SelectItem>
                  <SelectItem value="18-months">18 months (Part-time)</SelectItem>
                  <SelectItem value="24-months">24 months (Gradual)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button onClick={handleGenerate} size="lg" className="px-8">
            Generate Enhanced ML-Powered Dashboard →
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Get personalized analysis for 200+ job roles with real-time market data
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningSetup;
