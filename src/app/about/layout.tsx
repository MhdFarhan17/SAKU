import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Kisah di balik SAKU, visi kami, dan komitmen untuk membangun pencatat keuangan pribadi yang cepat dan aman.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
