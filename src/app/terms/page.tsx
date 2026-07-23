import { MarketingNavbar } from '@/components/marketing-navbar'
import { MarketingFooter } from '@/components/marketing-footer'
import { ScrollToTop } from '@/components/scroll-to-top'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas text-text-main flex flex-col font-sans">
      <MarketingNavbar />
      
      <main className="flex-grow pt-32 pb-20 px-6 max-w-3xl mx-auto w-full space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-main">
            Ketentuan Layanan Saku
          </h1>
          <div className="text-sm text-text-muted space-y-1">
            <p><strong>Berlaku sejak:</strong> 1 Agustus 2026</p>
            <p><strong>Terakhir diperbarui:</strong> 1 Agustus 2026</p>
          </div>
        </header>

        <article className="prose prose-invert prose-p:text-text-secondary prose-headings:text-text-main prose-strong:text-text-main prose-li:text-text-secondary max-w-none space-y-8">
          
          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">1. Penerimaan ketentuan</h2>
            <p className="leading-relaxed">
              Dengan mendaftar atau menggunakan Saku (&quot;Layanan&quot;), kamu menyetujui Ketentuan Layanan ini. Jika kamu tidak setuju, jangan menggunakan Layanan. Ketentuan ini merupakan perjanjian antara kamu dan Saku Inc., berkedudukan di Jakarta, Indonesia (&quot;kami&quot;).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">2. Tentang Layanan</h2>
            <p className="leading-relaxed">
              Saku adalah aplikasi pencatatan keuangan pribadi. Layanan membantu kamu mencatat pemasukan dan pengeluaran, mengelola dompet dan kategori, serta melihat ringkasan dan laporan atas data yang kamu masukkan sendiri. Layanan disediakan gratis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">3. Saku bukan layanan keuangan dan bukan nasihat keuangan</h2>
            <p className="leading-relaxed">Poin ini penting. Kamu memahami dan menyetujui bahwa:</p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>Saku hanyalah alat pencatatan pribadi. Saku bukan bank, bukan penyelenggara jasa keuangan, bukan penyelenggara sistem pembayaran, dan tidak menyimpan, memindahkan, atau mengelola uang sungguhan milikmu.</li>
              <li>Angka, saldo, dan laporan di dalam aplikasi didasarkan sepenuhnya pada data yang kamu masukkan. Keakuratannya adalah tanggung jawabmu.</li>
              <li>Isi aplikasi bukan nasihat keuangan, investasi, pajak, atau hukum. Keputusan keuanganmu adalah tanggung jawabmu sendiri.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">4. Kelayakan</h2>
            <p className="leading-relaxed">
              Kamu harus berusia minimal 18 tahun untuk menggunakan Layanan. Dengan menggunakan Saku, kamu menyatakan bahwa kamu memenuhi syarat usia ini dan cakap secara hukum untuk menyetujui Ketentuan ini.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">5. Akun kamu</h2>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>Kamu bertanggung jawab menjaga kerahasiaan kata sandi dan seluruh aktivitas yang terjadi pada akunmu.</li>
              <li>Satu akun ditujukan untuk digunakan oleh satu orang. Kamu bertanggung jawab atas kebenaran informasi yang kamu berikan.</li>
              <li>Beri tahu kami jika kamu menduga ada akses tidak sah ke akunmu.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">6. Penggunaan yang dilarang</h2>
            <p className="leading-relaxed">Kamu setuju untuk tidak:</p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>menggunakan Layanan untuk tujuan melanggar hukum;</li>
              <li>mencoba mengakses data pengguna lain atau menembus keamanan sistem;</li>
              <li>mengganggu, membebani, atau merusak Layanan;</li>
              <li>menyalin, memodifikasi, atau mendistribusikan ulang Layanan tanpa izin, kecuali yang diizinkan lisensi terbuka jika kode sumbernya kami buka.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">7. Layanan gratis</h2>
            <p className="leading-relaxed">
              Layanan disediakan tanpa biaya. Tidak ada fitur berbayar dan tidak ada kewajiban pembayaran. Karena gratis, kami dapat mengubah, membatasi, menangguhkan, atau menghentikan sebagian atau seluruh Layanan kapan saja. Jika kami menghentikan Layanan secara permanen, kami akan berupaya wajar memberi pemberitahuan agar kamu sempat mengekspor datamu.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">8. Datamu, cadangan, dan risiko kehilangan</h2>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>Datamu adalah milikmu. Kamu dapat mengekspornya kapan saja melalui aplikasi.</li>
              <li>Kami menerapkan langkah keamanan yang wajar, tetapi kami tidak menjamin bahwa data tidak akan pernah hilang atau rusak. Kamu bertanggung jawab menyimpan cadangan datamu sendiri dengan fitur ekspor.</li>
              <li>Pengelolaan data pribadimu diatur lebih lanjut dalam Kebijakan Privasi, yang menjadi bagian tak terpisahkan dari Ketentuan ini.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">9. Hak kekayaan intelektual</h2>
            <p className="leading-relaxed">
              Seluruh hak atas Layanan, termasuk nama, logo, tampilan, dan kode (kecuali bagian yang secara tegas kami buka dengan lisensi terbuka), adalah milik kami atau pemberi lisensi kami. Ketentuan ini tidak mengalihkan hak kekayaan intelektual apa pun kepadamu selain hak terbatas untuk menggunakan Layanan.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">10. Layanan disediakan &quot;sebagaimana adanya&quot;</h2>
            <p className="leading-relaxed">
              Sepanjang diizinkan hukum, Layanan disediakan &quot;sebagaimana adanya&quot; dan &quot;sebagaimana tersedia&quot;, tanpa jaminan dalam bentuk apa pun, baik tersurat maupun tersirat, termasuk jaminan ketersediaan tanpa henti, bebas kesalahan, atau kesesuaian untuk tujuan tertentu.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">11. Batasan tanggung jawab</h2>
            <p className="leading-relaxed">
              Sepanjang diizinkan hukum, kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan Layanan, termasuk kehilangan data atau kerugian akibat keputusan keuangan yang kamu ambil berdasarkan catatan di dalam aplikasi. Ketentuan ini tidak menghapus tanggung jawab yang tidak dapat dikecualikan menurut hukum yang berlaku.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">12. Penghentian</h2>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>Kamu dapat berhenti kapan saja dengan menghapus akunmu melalui Pengaturan.</li>
              <li>Kami dapat menangguhkan atau mengakhiri akses jika kamu melanggar Ketentuan ini atau menyalahgunakan Layanan.</li>
              <li>Ketentuan yang menurut sifatnya tetap berlaku setelah penghentian, seperti pembatasan tanggung jawab dan hak kekayaan intelektual, akan tetap berlaku.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">13. Perubahan ketentuan</h2>
            <p className="leading-relaxed">
              Kami dapat memperbarui Ketentuan ini. Jika ada perubahan penting, kami akan memberitahukannya di dalam aplikasi atau melalui email. Dengan tetap menggunakan Layanan setelah perubahan berlaku, kamu dianggap menyetujui Ketentuan yang diperbarui.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">14. Hukum yang mengatur dan penyelesaian sengketa</h2>
            <p className="leading-relaxed">
              Ketentuan ini tunduk pada dan ditafsirkan menurut hukum Republik Indonesia. Setiap sengketa yang timbul akan diupayakan diselesaikan secara musyawarah terlebih dahulu, dan jika tidak tercapai, diselesaikan melalui Pengadilan Negeri Jakarta Selatan.
            </p>
          </section>

          <section className="space-y-4 pb-12">
            <h2 className="text-2xl font-bold tracking-tight">15. Kontak</h2>
            <p className="leading-relaxed">
              Punya pertanyaan mengenai Ketentuan Layanan ini? Kami selalu siap membantu Anda.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 bg-brand hover:bg-brand-hover text-on-brand shadow-sm font-semibold">
              <Link href="/contact">Hubungi Tim Kami</Link>
            </Button>
          </section>
          
        </article>
      </main>

      <ScrollToTop />
      <MarketingFooter />
    </div>
  )
}
