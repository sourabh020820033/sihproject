
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, TrendingUp, Clock, Target, Zap, Brain, Award } from "lucide-react";
import { skillsApi } from '@/services/skillsApi';
import { getAllJobRoles, searchJobRoles } from '@/services/skillsDatabase';
import { toast } from "@/hooks/use-toast";

interface AdvancedGapAnalysisProps {
  userSkills: any[];
  targetRole: string;
  dailyHours: number;
  onSkillUpdate: (skills: any[]) => void;
}

const AdvancedGapAnalysis = ({ userSkills, targetRole, dailyHours, onSkillUpdate }: AdvancedGapAnalysisProps) => {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(targetRole);
  const [allRoles] = useState(getAllJobRoles());
  const [filteredRoles, setFilteredRoles] = useState(allRoles);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm) {
      setFilteredRoles(searchJobRoles(searchTerm));
    } else {
      setFilteredRoles(allRoles);
    }
  }, [searchTerm, allRoles]);

  useEffect(() => {
    if (selectedRole) {
      performAdvancedAnalysis();
    }
  }, [selectedRole, userSkills, dailyHours]);

  const performAdvancedAnalysis = async () => {
    setLoading(true);
    try {
      console.log('Performing advanced gap analysis for:', selectedRole);
      
      // Find the selected role
      const roleData = allRoles.find(role => 
        role.id === selectedRole || role.title.toLowerCase() === selectedRole.toLowerCase()
      );
      
      if (!roleData) {
        throw new Error('Role not found');
      }

      // Fetch enhanced skills data from API
      const skillsResponse = await skillsApi.fetchSkillsForRole(roleData.id);
      const trendingSkills = await skillsApi.fetchTrendingSkills();
      const salaryData = await skillsApi.fetchSalaryData(roleData.id, 'global');

      // Perform gap analysis
      const gapAnalysis = calculateEnhancedGapAnalysis(
        userSkills,
        skillsResponse.skills,
        trendingSkills,
        dailyHours
      );

      setAnalysisData({
        roleData,
        requiredSkills: skillsResponse.skills,
        gapAnalysis,
        trendingSkills,
        salaryData,
        metadata: skillsResponse.metadata
      });

      toast({
        title: "Analysis Complete",
        description: `Found ${skillsResponse.skills.length} skills for ${roleData.title} with ${gapAnalysis.criticalGaps.length} critical gaps identified.`,
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Using cached data for analysis.",
        variant: "destructive"
      });
      
      // Fallback to basic analysis
      const roleData = allRoles.find(role => role.title.toLowerCase() === selectedRole.toLowerCase());
      if (roleData) {
        const basicAnalysis = calculateEnhancedGapAnalysis(userSkills, roleData.requiredSkills, [], dailyHours);
        setAnalysisData({
          roleData,
          requiredSkills: roleData.requiredSkills,
          gapAnalysis: basicAnalysis,
          trendingSkills: [],
          salaryData: roleData.averageSalary,
          metadata: { source: 'cached', confidence: 0.8, lastUpdated: new Date().toISOString() }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateEnhancedGapAnalysis = (userSkills: any[], requiredSkills: any[], trending: string[], dailyHours: number) => {
    const userSkillMap = new Map(userSkills.map(skill => [skill.name.toLowerCase(), skill]));
    
    const skillGaps = requiredSkills.map(reqSkill => {
      const userSkill = userSkillMap.get(reqSkill.name.toLowerCase());
      const currentLevel = userSkill ? userSkill.currentLevel : 0;
      const targetLevel = userSkill ? userSkill.targetLevel : reqSkill.importance * 10;
      const gap = Math.max(0, targetLevel - currentLevel);
      
      // Calculate learning time based on skill complexity and user's daily hours
      const complexityMultiplier = reqSkill.category === 'technical' ? 1.2 : 
                                   reqSkill.category === 'soft' ? 0.8 : 1.0;
      const learningTime = Math.ceil((gap / 100) * reqSkill.learningHours * complexityMultiplier);
      const daysToComplete = Math.ceil(learningTime / dailyHours);
      
      return {
        ...reqSkill,
        currentLevel,
        targetLevel,
        gap,
        learningTime,
        daysToComplete,
        priority: gap > 50 ? 'critical' : gap > 20 ? 'high' : 'medium',
        isTrending: trending.some(trend => reqSkill.name.toLowerCase().includes(trend.toLowerCase()))
      };
    });

    const criticalGaps = skillGaps.filter(skill => skill.priority === 'critical');
    const highPriorityGaps = skillGaps.filter(skill => skill.priority === 'high');
    const totalLearningTime = skillGaps.reduce((acc, skill) => acc + skill.learningTime, 0);
    const estimatedCompletionDays = Math.ceil(totalLearningTime / dailyHours);
    
    // Calculate readiness score
    const overallProgress = skillGaps.reduce((acc, skill) => acc + skill.currentLevel, 0) / 
                           skillGaps.reduce((acc, skill) => acc + skill.targetLevel, 0) * 100;
    
    const readinessScore = Math.min(100, Math.max(0, overallProgress));
    
    return {
      skillGaps: skillGaps.sort((a, b) => b.gap - a.gap),
      criticalGaps,
      highPriorityGaps,
      totalLearningTime,
      estimatedCompletionDays,
      readinessScore,
      missingSkills: skillGaps.filter(skill => skill.currentLevel === 0),
      strongSkills: skillGaps.filter(skill => skill.currentLevel >= skill.targetLevel * 0.8),
      trendingGaps: skillGaps.filter(skill => skill.isTrending && skill.gap > 0)
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return { level: 'Ready to Apply', color: 'text-green-600', icon: Award };
    if (score >= 60) return { level: 'Almost Ready', color: 'text-blue-600', icon: Target };
    if (score >= 40) return { level: 'In Progress', color: 'text-orange-600', icon: TrendingUp };
    return { level: 'Getting Started', color: 'text-red-600', icon: AlertTriangle };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 animate-pulse" />
            Performing Advanced Gap Analysis...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-20 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Advanced Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select target role for analysis" />
              </SelectTrigger>
              <SelectContent>
                {filteredRoles.slice(0, 50).map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.title} - {role.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={performAdvancedAnalysis} className="w-full">
              <Brain className="h-4 w-4 mr-2" />
              Start Advanced Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { roleData, gapAnalysis, salaryData, metadata } = analysisData;
  const readiness = getReadinessLevel(gapAnalysis.readinessScore);
  const ReadinessIcon = readiness.icon;

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Advanced Gap Analysis: {roleData.title}
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {metadata.confidence * 100}% Confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <ReadinessIcon className={`h-8 w-8 mx-auto mb-2 ${readiness.color}`} />
              <h3 className="font-semibold text-lg">Job Readiness</h3>
              <p className={`text-2xl font-bold ${readiness.color}`}>
                {Math.round(gapAnalysis.readinessScore)}%
              </p>
              <p className="text-sm text-gray-600">{readiness.level}</p>
            </div>
            
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold text-lg">Learning Time</h3>
              <p className="text-2xl font-bold text-blue-600">
                {gapAnalysis.totalLearningTime}h
              </p>
              <p className="text-sm text-gray-600">
                ~{gapAnalysis.estimatedCompletionDays} days at {dailyHours}h/day
              </p>
            </div>
            
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <h3 className="font-semibold text-lg">Critical Gaps</h3>
              <p className="text-2xl font-bold text-red-600">
                {gapAnalysis.criticalGaps.length}
              </p>
              <p className="text-sm text-gray-600">Urgent skills needed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Information */}
      <Card>
        <CardHeader>
          <CardTitle>Market Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Salary Range</h4>
              <p className="text-2xl font-bold text-green-600">
                ${typeof salaryData.min === 'number' ? salaryData.min.toLocaleString() : salaryData.min} - 
                ${typeof salaryData.max === 'number' ? salaryData.max.toLocaleString() : salaryData.max}
              </p>
              <p className="text-sm text-gray-600">
                Demand: {roleData.demandLevel} | Growth: +{roleData.growthProjection}%
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Your Potential</h4>
              <p className="text-xl font-semibold">
                ${Math.round((salaryData.min + salaryData.max) / 2 * (gapAnalysis.readinessScore / 100)).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Based on current readiness
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Skills Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Critical Skills Gaps ({gapAnalysis.criticalGaps.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gapAnalysis.criticalGaps.map((skill, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{skill.name}</h4>
                    {skill.isTrending && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <Badge className={getPriorityColor(skill.priority)}>
                    {skill.priority}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: {skill.currentLevel}%</span>
                    <span>Target: {skill.targetLevel}%</span>
                    <span>Gap: {skill.gap}%</span>
                  </div>
                  <Progress value={(skill.currentLevel / skill.targetLevel) * 100} />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Learning time: {skill.learningTime}h</span>
                    <span>Days to complete: {skill.daysToComplete}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {gapAnalysis.criticalGaps.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>Great! No critical skill gaps identified.</p>
                <p className="text-sm">You're well-prepared for this role.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Skills Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Skills Analysis ({gapAnalysis.skillGaps.length} skills)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {gapAnalysis.skillGaps.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {skill.category}
                    </Badge>
                    {skill.isTrending && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>
                  <Progress value={(skill.currentLevel / skill.targetLevel) * 100} className="h-2" />
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-medium">
                    {skill.currentLevel}% / {skill.targetLevel}%
                  </div>
                  <div className="text-xs text-gray-600">
                    {skill.learningTime}h to close gap
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Learning Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Phase 1: Critical Skills (Immediate)</h4>
              <div className="space-y-1">
                {gapAnalysis.criticalGaps.slice(0, 3).map((skill, i) => (
                  <div key={i} className="text-sm">
                    • {skill.name} ({skill.learningTime}h)
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Phase 2: High Priority (Next 2 months)</h4>
              <div className="space-y-1">
                {gapAnalysis.highPriorityGaps.slice(0, 3).map((skill, i) => (
                  <div key={i} className="text-sm">
                    • {skill.name} ({skill.learningTime}h)
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Phase 3: Enhancement (Ongoing)</h4>
              <div className="space-y-1">
                {gapAnalysis.skillGaps.filter(s => s.priority === 'medium').slice(0, 3).map((skill, i) => (
                  <div key={i} className="text-sm">
                    • {skill.name} ({skill.learningTime}h)
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedGapAnalysis;
