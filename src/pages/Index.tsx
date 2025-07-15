
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, TrendingUp, Users } from "lucide-react";
import LearningSetup from "@/components/LearningSetup";
import SkillsDashboard from "@/components/SkillsDashboard";
import CompanyList from "@/components/CompanyList";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'setup' | 'dashboard'>('landing');
  const [learningData, setLearningData] = useState(null);

  const handleSetupComplete = (data: any) => {
    setLearningData(data);
    setCurrentView('dashboard');
  };

  if (currentView === 'setup') {
    return <LearningSetup onComplete={handleSetupComplete} />;
  }

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ML-Powered Learning Dashboard</h1>
              <p className="text-gray-600 mt-2">learning path based on your goals and current skills</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('setup')}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Back to Setup
            </Button>
          </div>
          
          <div className="grid gap-8">
            <SkillsDashboard data={learningData} />
            <CompanyList targetRole={learningData?.careerGoals?.[0] || 'software engineer'} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-6">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Learning Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enhance your skills with personalized learning paths powered by machine learning
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Goal Setting</CardTitle>
              <CardDescription>
                Define your learning objectives and career goals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Skill Assessment</CardTitle>
              <CardDescription>
                Evaluate your current skill levels and identify gaps
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 mx-auto">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Learning Path</CardTitle>
              <CardDescription>
                Get personalized recommendations and time estimates
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Setup Your Learning Profile</CardTitle>
              <CardDescription>
                Get started by defining your career goals and current skill levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setCurrentView('setup')} 
                size="lg"
                className="w-full md:w-auto px-8"
              >
                Start Learning Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
