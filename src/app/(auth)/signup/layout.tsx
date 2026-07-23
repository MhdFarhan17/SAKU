import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buat Akun Baru',
  description: 'Daftar ke SAKU sekarang dan mulai pantau pemasukan dan pengeluaran Anda dengan lebih mudah.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
