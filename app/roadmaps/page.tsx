import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { roadmapData, type Roadmap } from '@/app/data/roadmaps';

// Convert roadmapData to array format for the roadmaps listing page
const roadmaps = Object.entries(roadmapData).map(([id, roadmap]: [string, Roadmap]) => ({
  id,
  title: roadmap.title,
  description: roadmap.description,
  difficulty: roadmap.difficulty,
  duration: roadmap.duration,
  students: roadmap.students,
  rating: roadmap.rating,
  topics: roadmap.modules.slice(0, 5).map(module => module.title.split(' ')[0]), // Extract key topics from module titles
  category: roadmap.category
}));

const categories = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'DevOps', 'Cybersecurity'];

export default function RoadmapsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Learning Roadmaps
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover structured learning paths designed by experts to help you master new skills and advance your career.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Search roadmaps..." 
              className="w-full"
            />
          </div>
          <Button variant="outline">Search</Button>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmaps.map((roadmap) => (
          <Card key={roadmap.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{roadmap.title}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {roadmap.category}
                    </span>
                    <span>⭐ {roadmap.rating}</span>
                  </div>
                </div>
              </div>
              <CardDescription className="text-gray-600">
                {roadmap.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="font-medium">{roadmap.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Difficulty:</span>
                    <p className="font-medium">{roadmap.difficulty}</p>
                  </div>
                </div>

                {/* Topics */}
                <div>
                  <span className="text-gray-500 text-sm">Topics:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {roadmap.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                    {roadmap.topics.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{roadmap.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Students count */}
                <div className="text-sm text-gray-500">
                  {roadmap.students.toLocaleString()} students enrolled
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Link href={`/roadmaps/${roadmap.id}`} className="flex-1">
                    <Button className="w-full">View Roadmap</Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    ❤️
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          Load More Roadmaps
        </Button>
      </div>
    </div>
  );
}
