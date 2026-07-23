import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke akun SAKU Anda untuk mengelola keuangan dengan mudah dan aman.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
