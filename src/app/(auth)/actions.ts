'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  
  // 1. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Format email tidak valid.' }
  }

  const supabase = await createClient()
  const adminAuthClient = createAdminClient()

  // 2. Verify if email already exists
  const { data: { users }, error: listError } = await adminAuthClient.auth.admin.listUsers()
  
  if (!listError) {
    const emailExists = users.some(u => u.email === email)
    if (emailExists) {
      return { error: 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.' }
    }
  }

  // Auto-generate display name from first word of full name
  const displayName = fullName ? fullName.split(' ')[0] : ''

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        display_name: displayName,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // Next.js Server Actions don't support simple redirect with success message easily 
  // without search params or cookies, so we return a success flag and let the client redirect.
  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Use the admin client to delete the user
  const adminAuthClient = createAdminClient()
  const { error } = await adminAuthClient.auth.admin.deleteUser(user.id)

  if (error) {
    return { error: error.message }
  }

  // Sign out locally to clear cookies
  await supabase.auth.signOut()
  return { success: true }
}

export async function updateProfile(formData: FormData) {
  const fullName = formData.get('full_name') as string
  const displayName = formData.get('display_name') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      display_name: displayName,
    }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/app')
  return { success: true }
}

export async function resetPassword(formData: FormData, origin: string) {
  const email = formData.get('email') as string
  const supabase = await createClient()
  const adminAuthClient = createAdminClient()

  // Verify if email exists
  const { data: { users }, error: listError } = await adminAuthClient.auth.admin.listUsers()
  
  if (listError) {
    return { error: 'Terjadi kesalahan saat memverifikasi email.' }
  }

  const userExists = users.some(u => u.email === email)
  
  if (!userExists) {
    return { error: 'Email belum terdaftar di sistem kami.' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
