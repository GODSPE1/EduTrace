'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { roadmapData, type Roadmap, type RoadmapModule } from '@/app/data/roadmaps';

export default function RoadmapDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const roadmap: Roadmap | undefined = roadmapData[slug];

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Roadmap Not Found</h1>
        <p className="text-gray-600 mb-6">The roadmap you're looking for doesn't exist.</p>
        <Link href="/roadmaps">
          <Button>Browse All Roadmaps</Button>
        </Link>
      </div>
    );
  }

  const completedModules = roadmap.modules.filter((m: RoadmapModule) => m.completed).length;
  const progressPercentage = (completedModules / roadmap.modules.length) * 100;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link href="/roadmaps" className="hover:text-gray-700">Roadmaps</Link>
          <span className="mx-2">/</span>
          <span>{roadmap.title}</span>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{roadmap.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{roadmap.description}</p>
            
            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {roadmap.category}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500">⭐</span>
                <span className="ml-1 font-medium">{roadmap.rating}</span>
                <span className="text-gray-500 ml-1">({roadmap.students.toLocaleString()} students)</span>
              </div>
              <div>
                <span className="text-gray-500">Duration: </span>
                <span className="font-medium">{roadmap.duration}</span>
              </div>
              <div>
                <span className="text-gray-500">Level: </span>
                <span className="font-medium">{roadmap.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <Card className="w-full lg:w-80">
            <CardHeader>
              <CardTitle>Start Learning</CardTitle>
              <CardDescription>
                Progress: {completedModules}/{roadmap.modules.length} modules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <Button className="w-full" size="lg">
                {completedModules > 0 ? 'Continue Learning' : 'Start Roadmap'}
              </Button>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  ❤️ Save to Favorites
                </Button>
                <Button variant="outline" className="w-full">
                  📤 Share Roadmap
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Learning Modules */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Path</h2>
            <div className="space-y-4">
              {roadmap.modules.map((module: RoadmapModule, index: number) => (
                <Card key={module.id} className={`transition-all ${module.completed ? 'bg-green-50 border-green-200' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          module.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {module.completed ? '✓' : index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {module.description} • {module.duration}
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {module.completed ? 'Review' : 'Start'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic: string) => (
                        <span
                          key={topic}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prerequisites */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prerequisites</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {roadmap.prerequisites.map((prereq: string, index: number) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {prereq}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {roadmap.outcomes.map((outcome: string, index: number) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-green-500 mr-3 mt-0.5">✓</span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
