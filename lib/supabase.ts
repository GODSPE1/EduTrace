import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables')
}

// Client-side Supabase client
export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for API routes)
export const createServerSupabaseClient = (req: any, res: any) =>
  createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies?.[name]
      },
      set(name: string, value: string, options: any) {
        const existingCookies = res.getHeader('Set-Cookie') || []
        const cookieString = `${name}=${encodeURIComponent(value)}; ${Object.entries(options)
          .map(([k, v]) => typeof v === 'boolean' ? (v ? k : '') : `${k}=${v}`)
          .filter(Boolean)
          .join('; ')}`
        
        const updatedCookies = Array.isArray(existingCookies) 
          ? [...existingCookies, cookieString]
          : existingCookies 
            ? [existingCookies, cookieString]
            : [cookieString]
            
        res.setHeader('Set-Cookie', updatedCookies)
      },
      remove(name: string) {
        const existingCookies = res.getHeader('Set-Cookie') || []
        const removeString = `${name}=; Max-Age=0; Path=/`
        
        const updatedCookies = Array.isArray(existingCookies)
          ? [...existingCookies, removeString]
          : existingCookies
            ? [existingCookies, removeString]
            : [removeString]
            
        res.setHeader('Set-Cookie', updatedCookies)
      },
    },
  })
