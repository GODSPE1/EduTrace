// Database type definitions for EduTrace application
// These types match the Supabase database schema

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string | null
  slug: string
  image_url: string | null
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Roadmap {
  id: string
  course_id: string
  title: string
  description: string | null
  slug: string
  estimated_hours: number
  order_index: number
  is_published: boolean
  created_at: string
  updated_at: string
  course?: Course
}

export interface Topic {
  id: string
  roadmap_id: string
  title: string
  description: string | null
  content: string | null
  slug: string
  order_index: number
  estimated_minutes: number
  resources: ResourceLink[]
  is_published: boolean
  created_at: string
  updated_at: string
  roadmap?: Roadmap
}

export interface ResourceLink {
  type: 'article' | 'video' | 'diagram' | 'quiz' | 'tutorial' | 'notebook' | 'textbook' | 'practice' | 'simulation' | 'infographic'
  title: string
  url: string
}

export interface Quiz {
  id: string
  topic_id: string | null
  roadmap_id: string | null
  title: string
  description: string | null
  quiz_type: 'topic' | 'final_exam'
  passing_score: number
  time_limit_minutes: number | null
  max_attempts: number
  is_published: boolean
  created_at: string
  updated_at: string
  topic?: Topic
  roadmap?: Roadmap
  questions?: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'matching'
  options: string[]
  correct_answer: string[]
  explanation: string | null
  points: number
  order_index: number
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  topic_id: string
  roadmap_id: string
  is_completed: boolean
  completion_date: string | null
  time_spent_minutes: number
  created_at: string
  updated_at: string
  topic?: Topic
  roadmap?: Roadmap
}

export interface QuizResult {
  id: string
  user_id: string
  quiz_id: string
  score: number
  total_points: number
  percentage: number
  passed: boolean
  answers: Record<string, any>
  time_taken_minutes: number | null
  attempt_number: number
  completed_at: string
  created_at: string
  quiz?: Quiz
}

export interface Certificate {
  id: string
  user_id: string
  roadmap_id: string
  certificate_type: 'completion' | 'achievement' | 'badge'
  title: string
  description: string | null
  issued_date: string
  certificate_url: string | null
  badge_image_url: string | null
  verification_code: string
  is_public: boolean
  metadata: Record<string, any>
  created_at: string
  roadmap?: Roadmap
}

export interface Achievement {
  id: string
  user_id: string
  achievement_type: string
  title: string
  description: string | null
  icon: string | null
  earned_date: string
  metadata: Record<string, any>
  created_at: string
}

// Database function return types
export interface RoadmapProgress {
  total_topics: number
  completed_topics: number
  progress_percentage: number
}

// API response types
export interface CourseWithRoadmaps extends Course {
  roadmaps: Roadmap[]
}

export interface RoadmapWithTopics extends Roadmap {
  topics: Topic[]
  course: Course
}

export interface TopicWithProgress extends Topic {
  user_progress?: UserProgress
  quiz?: Quiz
}

export interface QuizWithQuestions extends Quiz {
  questions: QuizQuestion[]
}

export interface UserDashboard {
  user: Profile
  enrolledRoadmaps: RoadmapProgress[]
  recentProgress: UserProgress[]
  certificates: Certificate[]
  achievements: Achievement[]
  totalCoursesStarted: number
  totalCoursesCompleted: number
  totalQuizzesPassed: number
}

// Form types for API requests
export interface CreateQuizResultRequest {
  quiz_id: string
  score: number
  total_points: number
  answers: Record<string, any>
  time_taken_minutes?: number
  attempt_number: number
}

export interface UpdateProgressRequest {
  topic_id: string
  roadmap_id: string
  is_completed: boolean
  time_spent_minutes?: number
}

export interface CreateCertificateRequest {
  roadmap_id: string
  certificate_type: 'completion' | 'achievement' | 'badge'
  title: string
  description?: string
  metadata?: Record<string, any>
}

// Filter and query types
export interface CourseFilters {
  category?: string
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
  search?: string
}

export interface QuizFilters {
  quiz_type?: 'topic' | 'final_exam'
  passed?: boolean
  roadmap_id?: string
}

export interface CertificateFilters {
  certificate_type?: 'completion' | 'achievement' | 'badge'
  is_public?: boolean
  roadmap_id?: string
}
