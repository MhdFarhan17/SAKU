import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fitur',
  description: 'Pelajari semua fitur SAKU yang dirancang untuk memudahkan Anda mengontrol pengeluaran dan pemasukan harian.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
