import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lupa Password',
  description: 'Atur ulang password akun SAKU Anda dengan cepat dan aman.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
