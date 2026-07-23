import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bantuan',
  description: 'Temukan jawaban untuk pertanyaan Anda, pelajari panduan penggunaan SAKU, atau hubungi tim dukungan kami.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
