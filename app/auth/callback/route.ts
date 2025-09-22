import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next') ?? '/dashboard'
  
  // Validate the next parameter to prevent open redirect attacks
  const validateRedirectPath = (path: string): string => {
    // Default safe path
    const defaultPath = '/dashboard'
    
    // Must be a string and not empty
    if (!path || typeof path !== 'string') {
      return defaultPath
    }
    
    // Must start with a single '/' (relative path)
    if (!path.startsWith('/')) {
      return defaultPath
    }
    
    // Reject paths starting with '//' (protocol-relative URLs)
    if (path.startsWith('//')) {
      return defaultPath
    }
    
    // Reject paths containing URL schemes
    if (path.includes('://')) {
      return defaultPath
    }
    
    // Additional validation: try parsing as URL to catch edge cases
    try {
      const testUrl = new URL(path, origin)
      // Ensure the parsed URL has the same origin as our app
      if (testUrl.origin !== origin) {
        return defaultPath
      }
      // Return the pathname part only (no query params or fragments)
      return testUrl.pathname
    } catch {
      // If URL parsing fails, it's likely a relative path - validate it's safe
      // Only allow paths that look like internal routes (alphanumeric, hyphens, underscores, forward slashes)
      if (!/^\/[\w\-\/]*$/.test(path)) {
        return defaultPath
      }
      return path
    }
  }
  
  const next = validateRedirectPath(nextParam)

  if (code) {
    // Arrays to collect cookie operations
    const cookiesToSet: Array<{name: string, value: string, options: any}> = []
    const cookiesToRemove: Array<{name: string, options?: any}> = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // Collect cookie set operations to apply later
            cookiesToSet.push({ name, value, options })
          },
          remove(name: string, options?: any) {
            // Collect cookie removal operations to apply later
            cookiesToRemove.push({ name, options })
          },
        },
      }
    )
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`)
      
      // Apply all collected cookie set operations
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options)
      })
      
      // Apply all collected cookie removal operations
      cookiesToRemove.forEach(({ name }) => {
        response.cookies.delete(name)
      })
      
      return response
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
