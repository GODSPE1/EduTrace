// Database helper functions for EduTrace application
import { createClient } from '@supabase/supabase-js'
import type { 
  Course, 
  Roadmap, 
  Topic, 
  Quiz, 
  QuizResult, 
  UserProgress, 
  Certificate,
  RoadmapProgress,
  CourseWithRoadmaps,
  RoadmapWithTopics,
  QuizWithQuestions,
  CreateQuizResultRequest,
  UpdateProgressRequest,
  CreateCertificateRequest,
  UserDashboard
} from './types'

// Initialize Supabase client (you may want to import from your existing supabase.ts file)
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing required Supabase environment variables')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Utility function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Rate limiting helper (simple in-memory cache for demo - use Redis in production)
const rateLimitCache = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): void {
  const now = Date.now()
  const key = identifier
  const userLimit = rateLimitCache.get(key)
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit window
    rateLimitCache.set(key, { count: 1, resetTime: now + windowMs })
    return
  }
  
  if (userLimit.count >= maxRequests) {
    throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((userLimit.resetTime - now) / 1000)} seconds`)
  }
  
  userLimit.count++
}

// Course queries
export async function getAllCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('title')

  if (error) throw error
  return data || []
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  // Input validation
  if (typeof slug !== 'string') {
    throw new Error('Slug must be a string')
  }
  
  // Validate slug format (alphanumeric, hyphens, underscores only)
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    throw new Error('Invalid slug format')
  }
  
  // Limit slug length
  if (slug.length > 100) {
    throw new Error('Slug is too long')
  }
  
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // No rows returned
    }
    throw error
  }

  return data
}

// Roadmap queries
export async function getRoadmapBySlug(slug: string): Promise<Roadmap | null> {
  // Input validation
  if (typeof slug !== 'string') {
    throw new Error('Slug must be a string')
  }
  
  // Validate slug format (alphanumeric, hyphens, underscores only)
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    throw new Error('Invalid slug format')
  }
  
  // Limit slug length
  if (slug.length > 100) {
    throw new Error('Slug is too long')
  }
  
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*, course:courses(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // No rows returned
    }
    throw error
  }

  return data
}

export async function getRoadmapProgress(userId: string, roadmapId: string): Promise<RoadmapProgress> {
  const { data, error } = await supabase
    .rpc('calculate_roadmap_progress', {
      p_user_id: userId,
      p_roadmap_id: roadmapId
    })

  if (error) throw error
  return data?.[0] || { total_topics: 0, completed_topics: 0, progress_percentage: 0 }
}

export async function isRoadmapCompleted(userId: string, roadmapId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('is_roadmap_completed', {
      p_user_id: userId,
      p_roadmap_id: roadmapId
    })

  if (error) throw error
  return data || false
}

export async function batchCheckRoadmapCompletion(userId: string, roadmapIds: string[]): Promise<Record<string, boolean>> {
  // Handle empty array case
  if (roadmapIds.length === 0) {
    return {}
  }

  // Create a custom RPC query that checks multiple roadmaps at once
  // This replaces the N+1 query problem with a single batch query
  const { data, error } = await supabase
    .rpc('batch_check_roadmap_completion', {
      p_user_id: userId,
      p_roadmap_ids: roadmapIds
    })

  if (error) {
    console.error('Error in batch roadmap completion check:', error)
    throw new Error(`Failed to check roadmap completion status: ${error.message}`)
  }

  // Transform the response into a lookup object
  const completionStatus: Record<string, boolean> = {}
  
  if (data && Array.isArray(data)) {
    for (const result of data) {
      if (result.roadmap_id && typeof result.is_completed === 'boolean') {
        completionStatus[result.roadmap_id] = result.is_completed
      }
    }
  }

  // Ensure all requested roadmaps have a status (default to false if missing)
  for (const roadmapId of roadmapIds) {
    if (!(roadmapId in completionStatus)) {
      completionStatus[roadmapId] = false
    }
  }

  return completionStatus
}

// Topic queries
export async function getTopicBySlug(roadmapSlug: string, topicSlug: string, userId?: string): Promise<Topic | null> {
  // First get the roadmap by slug
  const { data: roadmap } = await supabase
    .from('roadmaps')
    .select('id')
    .eq('slug', roadmapSlug)
    .single()

  if (!roadmap) return null

  const { data, error } = await supabase
    .from('topics')
    .select(`
      *,
      roadmap:roadmaps(*),
      quiz:quizzes(*)
    `)
    .eq('slug', topicSlug)
    .eq('roadmap_id', roadmap.id)
    .eq('is_published', true)
    .single()

  if (error) throw error
  return data
}

export async function getTopicProgress(userId: string, topicId: string): Promise<UserProgress | null> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Quiz queries
export async function getQuizWithQuestions(quizId: string): Promise<QuizWithQuestions | null> {
  // Validate quizId to prevent injection attacks
  if (typeof quizId !== 'string') {
    throw new Error('Quiz ID must be a string')
  }
  
  // Use UUID validation instead of regex pattern
  if (!isValidUUID(quizId)) {
    throw new Error('Invalid quiz ID format')
  }

  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      questions:quiz_questions(*)
    `)
    .eq('id', quizId)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // No rows returned
    }
    throw error
  }
  
  return data
}

export async function getQuizResults(userId: string, quizId: string): Promise<QuizResult[]> {
  // Input validation
  if (typeof userId !== 'string' || !isValidUUID(userId)) {
    throw new Error('Invalid user ID format')
  }
  
  if (typeof quizId !== 'string' || !isValidUUID(quizId)) {
    throw new Error('Invalid quiz ID format')
  }
  
  // Rate limiting check
  checkRateLimit(`quiz_results_${userId}`, 50, 60000)
  
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId)
    .eq('quiz_id', quizId)
    .order('attempt_number', { ascending: false })

  if (error) throw error
  return data || []
}

export async function canTakeQuiz(userId: string, quizId: string): Promise<{ canTake: boolean; attemptsUsed: number; maxAttempts: number }> {
  // Get quiz info and user's attempts
  const [quizResponse, resultsResponse] = await Promise.all([
    supabase.from('quizzes').select('max_attempts').eq('id', quizId).single(),
    supabase.from('quiz_results').select('attempt_number').eq('user_id', userId).eq('quiz_id', quizId)
  ])

  if (quizResponse.error) throw quizResponse.error
  if (resultsResponse.error && resultsResponse.error.code !== 'PGRST116') throw resultsResponse.error

  const maxAttempts = quizResponse.data.max_attempts
  const attemptsUsed = resultsResponse.data?.length || 0

  return {
    canTake: attemptsUsed < maxAttempts,
    attemptsUsed,
    maxAttempts
  }
}

// Progress tracking
export async function updateTopicProgress(userId: string, request: UpdateProgressRequest): Promise<UserProgress> {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      topic_id: request.topic_id,
      roadmap_id: request.roadmap_id,
      is_completed: request.is_completed,
      completion_date: request.is_completed ? new Date().toISOString() : null,
      time_spent_minutes: request.time_spent_minutes || 0
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function submitQuizResult(userId: string, request: CreateQuizResultRequest): Promise<QuizResult> {
  // Validate and sanitize the request
  const validateQuizResultRequest = (req: CreateQuizResultRequest) => {
    // Check required fields
    if (!req.quiz_id || typeof req.quiz_id !== 'string') {
      throw new Error('quiz_id is required and must be a string')
    }
    
    if (typeof req.score !== 'number' || req.score < 0) {
      throw new Error('score is required and must be a non-negative number')
    }
    
    if (typeof req.total_points !== 'number' || req.total_points <= 0) {
      throw new Error('total_points is required and must be a positive number')
    }
    
    if (typeof req.attempt_number !== 'number' || req.attempt_number < 1) {
      throw new Error('attempt_number is required and must be a positive integer')
    }
    
    // Validate answers object
    if (!req.answers || typeof req.answers !== 'object' || Array.isArray(req.answers)) {
      throw new Error('answers is required and must be an object')
    }
    
    // Sanitize answers to prevent injection and ensure it's a clean object
    const sanitizedAnswers: Record<string, any> = {}
    for (const [key, value] of Object.entries(req.answers)) {
      // Only allow string keys that look like question IDs (alphanumeric, hyphens, underscores)
      if (typeof key === 'string' && /^[a-zA-Z0-9_-]+$/.test(key)) {
        // Allow basic answer types: strings, numbers, arrays of strings/numbers, booleans
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          (Array.isArray(value) && value.every(v => typeof v === 'string' || typeof v === 'number'))
        ) {
          sanitizedAnswers[key] = value
        }
      }
    }
    
    // Validate optional time_taken_minutes
    let timeSpent: number | undefined
    if (req.time_taken_minutes !== undefined) {
      if (typeof req.time_taken_minutes !== 'number' || req.time_taken_minutes < 0) {
        throw new Error('time_taken_minutes must be a non-negative number')
      }
      timeSpent = Math.floor(req.time_taken_minutes) // Ensure integer
    }
    
    // Return only whitelisted and validated fields
    return {
      quiz_id: req.quiz_id.trim(),
      score: Math.floor(req.score), // Ensure integer
      total_points: Math.floor(req.total_points), // Ensure integer
      answers: sanitizedAnswers,
      time_taken_minutes: timeSpent,
      attempt_number: Math.floor(req.attempt_number) // Ensure integer
    }
  }

  // Call the validator and insert the result
  const validated = validateQuizResultRequest(request)
  const { data, error } = await supabase
    .from('quiz_results')
    .insert({
      user_id: userId,
      quiz_id: validated.quiz_id,
      score: validated.score,
      total_points: validated.total_points,
      answers: validated.answers,
      time_taken_minutes: validated.time_taken_minutes,
      attempt_number: validated.attempt_number
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function searchContent(query: string): Promise<{
  courses: Course[]
  roadmaps: Roadmap[]
  topics: Topic[]
}> {
  // Input validation and sanitization
  if (typeof query !== 'string') {
    throw new Error('Search query must be a string')
  }
  
  // Limit query length to prevent DoS attacks
  if (query.length > 100) {
    throw new Error('Search query is too long (max 100 characters)')
  }
  
  // Remove dangerous characters and trim whitespace
  const sanitizedQuery = query
    .replace(/[%_\\]/g, '\\$&') // Escape SQL LIKE pattern characters
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .trim()
  
  // Minimum query length check
  if (sanitizedQuery.length < 2) {
    return {
      courses: [],
      roadmaps: [],
      topics: []
    }
  }

  const [coursesResponse, roadmapsResponse, topicsResponse] = await Promise.all([
    supabase
      .from('courses')
      .select('*')
      .or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
      .eq('is_published', true)
      .limit(5),
    
    supabase
      .from('roadmaps')
      .select('*, course:courses(*)')
      .or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
      .eq('is_published', true)
      .limit(5),
    
    supabase
      .from('topics')
      .select('*, roadmap:roadmaps(*, course:courses(*))')
      .or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%,content.ilike.%${sanitizedQuery}%`)
      .eq('is_published', true)
      .limit(10)
  ])

  if (coursesResponse.error) throw coursesResponse.error
  if (roadmapsResponse.error) throw roadmapsResponse.error
  if (topicsResponse.error) throw topicsResponse.error

  return {
    courses: coursesResponse.data || [],
    roadmaps: roadmapsResponse.data || [],
    topics: topicsResponse.data || []
  }
}

export async function getCertificatesByUser(userId: string): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select(`
      *,
      roadmap:roadmaps(*)
    `)
    .eq('user_id', userId)
    .order('issued_date', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createCertificate(userId: string, request: CreateCertificateRequest): Promise<Certificate> {
  // Destructure and validate only allowed fields from the request
  const {
    roadmap_id,
    certificate_type,
    title,
    description,
    metadata
  } = request;

  // Validate required fields
  if (!roadmap_id || typeof roadmap_id !== 'string') {
    throw new Error('roadmap_id is required and must be a string');
  }

  if (!certificate_type || !['completion', 'achievement', 'badge'].includes(certificate_type)) {
    throw new Error('certificate_type is required and must be one of: completion, achievement, badge');
  }

  if (!title || typeof title !== 'string') {
    throw new Error('title is required and must be a string');
  }

  // Validate optional fields
  if (description !== undefined && typeof description !== 'string') {
    throw new Error('description must be a string if provided');
  }

  if (metadata !== undefined && (typeof metadata !== 'object' || metadata === null || Array.isArray(metadata))) {
    throw new Error('metadata must be an object if provided');
  }

  // Insert only the explicitly allowed and validated fields
  const { data, error } = await supabase
    .from('certificates')
    .insert({
      user_id: userId,
      roadmap_id: roadmap_id.trim(),
      certificate_type,
      title: title.trim(),
      description: description?.trim(),
      metadata: metadata || {}
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function verifyCertificate(verificationCode: string): Promise<Certificate | null> {
  const { data, error } = await supabase
    .from('certificates')
    .select(`
      *,
      roadmap:roadmaps(*),
      profile:profiles(full_name, email)
    `)
    .eq('verification_code', verificationCode)
    .eq('is_public', true)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Dashboard data
export async function getUserDashboard(userId: string): Promise<UserDashboard | null> {
  const [profileResponse, progressResponse, certificatesResponse] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('user_progress').select('*, topic:topics(*, roadmap:roadmaps(*))').eq('user_id', userId).order('updated_at', { ascending: false }).limit(10),
    supabase.from('certificates').select('*, roadmap:roadmaps(*)').eq('user_id', userId).order('issued_date', { ascending: false })
  ])

  if (profileResponse.error) throw profileResponse.error

  const profile = profileResponse.data
  const recentProgress = progressResponse.data || []
  const certificates = certificatesResponse.data || []

  // Calculate stats
  const enrolledRoadmaps = [...new Set(recentProgress.map(p => p.roadmap_id))]
  const completedRoadmaps = new Set()

  // Check which roadmaps are completed using batch query to avoid N+1 problem
  try {
    const completionStatuses = await batchCheckRoadmapCompletion(userId, enrolledRoadmaps)
    
    // Populate completedRoadmaps set based on batch results
    for (const [roadmapId, isCompleted] of Object.entries(completionStatuses)) {
      if (isCompleted) {
        completedRoadmaps.add(roadmapId)
      }
    }
  } catch (error) {
    console.error('Failed to check roadmap completion status:', error)
    // Continue with empty completedRoadmaps set rather than failing entirely
    // This provides graceful degradation if the batch query fails
  }

  // Get quiz stats
  const { data: quizResults } = await supabase
    .from('quiz_results')
    .select('passed')
    .eq('user_id', userId)

  const totalQuizzesPassed = quizResults?.filter(r => r.passed).length || 0

  return {
    user: profile,
    enrolledRoadmaps: [], // You might want to populate this with actual progress data
    recentProgress,
    certificates,
    achievements: [], // Implement if you're using the achievements table
    totalCoursesStarted: enrolledRoadmaps.length,
    totalCoursesCompleted: completedRoadmaps.size,
    totalQuizzesPassed
  }
}

// (Duplicate searchContent function removed to avoid redeclaration error)
