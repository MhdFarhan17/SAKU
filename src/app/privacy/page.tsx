import { MarketingNavbar } from '@/components/marketing-navbar'
import { MarketingFooter } from '@/components/marketing-footer'
import { ScrollToTop } from '@/components/scroll-to-top'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas text-text-main flex flex-col font-sans">
      <MarketingNavbar />
      
      <main className="flex-grow pt-32 pb-20 px-6 max-w-3xl mx-auto w-full space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-main">
            Kebijakan Privasi Saku
          </h1>
          <div className="text-sm text-text-muted space-y-1">
            <p><strong>Berlaku sejak:</strong> 1 Agustus 2026</p>
            <p><strong>Terakhir diperbarui:</strong> 1 Agustus 2026</p>
          </div>
        </header>

        <article className="prose prose-invert prose-p:text-text-secondary prose-headings:text-text-main prose-strong:text-text-main prose-li:text-text-secondary max-w-none space-y-8">
          
          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">Ringkasan singkat</h2>
            <p className="leading-relaxed">
              Saku adalah aplikasi pencatatan keuangan pribadi yang gratis. Kami menyimpan email kamu dan catatan keuangan yang kamu masukkan sendiri, hanya untuk menjalankan aplikasi ini. Kami tidak menjual datamu, tidak memasang iklan, dan tidak membagikan catatan keuanganmu kepada siapa pun untuk tujuan pemasaran. Datamu tersimpan di server penyedia kami dan hanya bisa diakses oleh akunmu. Kamu bisa mengekspor atau menghapus seluruh datamu kapan saja. Bagian di bawah menjelaskan semuanya secara rinci.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">1. Siapa kami (Pengendali Data Pribadi)</h2>
            <p className="leading-relaxed">
              Layanan Saku dikelola oleh Saku Inc., berkedudukan di Jakarta, Indonesia, selanjutnya disebut &quot;kami&quot;. Dalam Kebijakan ini, kami bertindak sebagai Pengendali Data Pribadi atas data yang kamu berikan.
            </p>
            <p className="leading-relaxed">
              Untuk pertanyaan atau permintaan terkait data pribadi, hubungi kami kapan saja di <strong>support@saku.id</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">2. Data pribadi yang kami kumpulkan</h2>
            <p className="leading-relaxed">Kami hanya mengumpulkan yang diperlukan agar aplikasi berfungsi:</p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li><strong>Data akun:</strong> alamat email dan kata sandi. Kata sandi disimpan dalam bentuk ter-hash oleh penyedia autentikasi kami, dan kami tidak dapat melihat kata sandi asli kamu.</li>
              <li><strong>Catatan keuangan yang kamu masukkan sendiri:</strong> transaksi (nominal, tanggal, catatan, tag), akun/dompet, kategori, dan anggaran. Ini adalah data yang paling sensitif dan kami memperlakukannya demikian.</li>
              <li><strong>Preferensi aplikasi:</strong> bahasa, tema, dan pengaturan tampilan.</li>
              <li><strong>Data teknis terbatas:</strong> alamat IP, jenis perangkat, dan peramban, yang tercatat secara otomatis oleh penyedia hosting dan basis data kami untuk keamanan dan menjaga layanan tetap berjalan. Kami tidak menggunakan data teknis ini untuk melacak perilakumu untuk tujuan iklan.</li>
            </ul>
            <p className="leading-relaxed">
              Kami tidak meminta dan tidak memerlukan data identitas resmi seperti NIK, nomor kartu, atau data rekening bank asli. <strong>Jangan memasukkan nomor kartu atau kredensial perbankan asli ke dalam catatan.</strong>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">3. Bagaimana dan mengapa kami memakai datamu</h2>
            <p className="leading-relaxed">Kami memproses data pribadimu untuk:</p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>menyediakan dan menjalankan fitur aplikasi (menyimpan dan menampilkan catatan keuanganmu, menghitung saldo dan laporan);</li>
              <li>mengautentikasi kamu saat masuk dan menjaga keamanan akun;</li>
              <li>menanggapi permintaan bantuan yang kamu kirim;</li>
              <li>memenuhi kewajiban hukum yang berlaku.</li>
            </ul>
            <p className="leading-relaxed">
              <strong>Dasar pemrosesan.</strong> Pemrosesan didasarkan pada persetujuanmu saat mendaftar dan pada pelaksanaan layanan yang kamu minta (perjanjian), sebagaimana diatur dalam Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (&quot;UU PDP&quot;). Kamu dapat menarik persetujuanmu kapan saja dengan menghapus akunmu.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">4. Kami tidak menjual atau mengiklankan datamu</h2>
            <p className="leading-relaxed">
              Kami tidak menjual, menyewakan, atau memperdagangkan data pribadimu. Kami tidak menampilkan iklan pihak ketiga. Kami tidak menggunakan isi catatan keuanganmu untuk profil pemasaran. Saku gratis dan tetap gratis; model kami bukan monetisasi data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">5. Pihak ketiga yang memproses data (Prosesor)</h2>
            <p className="leading-relaxed">
              Kami menggunakan penyedia layanan tepercaya untuk menjalankan aplikasi. Mereka bertindak sebagai Prosesor Data Pribadi atas instruksi kami:
            </p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li><strong>Supabase</strong> menyediakan basis data dan autentikasi. Di sinilah email dan catatan keuanganmu tersimpan.</li>
              <li><strong>Vercel</strong> menyediakan hosting aplikasi web.</li>
            </ul>
            <p className="leading-relaxed">
              Kami tidak membagikan datamu kepada pihak lain kecuali diwajibkan oleh hukum atau proses hukum yang sah.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">6. Transfer data ke luar wilayah Indonesia</h2>
            <p className="leading-relaxed">
              Penyedia di atas menyimpan dan memproses data pada server yang berlokasi di luar wilayah Indonesia, yaitu di Singapura. Dengan menggunakan Saku, kamu memahami dan menyetujui bahwa data pribadimu ditransfer dan disimpan di luar wilayah Indonesia. Transfer ini dilakukan dengan tetap memperhatikan pelindungan yang setara sebagaimana diatur dalam UU PDP mengenai transfer data pribadi ke luar wilayah Indonesia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">7. Berapa lama data disimpan</h2>
            <p className="leading-relaxed">
              Kami menyimpan datamu selama akunmu aktif. Saat kamu menghapus akun melalui menu Pengaturan, seluruh data pribadimu (akun autentikasi beserta catatan keuangan, akun, kategori, dan anggaran) dihapus secara permanen dari basis data melalui penghapusan berantai. Salinan pada cadangan sistem penyedia dapat bertahan untuk periode teknis yang terbatas sebelum ikut terhapus.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">8. Keamanan data</h2>
            <p className="leading-relaxed">Kami menerapkan langkah keamanan yang wajar, antara lain:</p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>transmisi data terenkripsi melalui HTTPS/TLS;</li>
              <li>isolasi data antar-pengguna di tingkat basis data, sehingga satu pengguna tidak dapat mengakses data pengguna lain;</li>
              <li>penyimpanan kata sandi dalam bentuk ter-hash.</li>
            </ul>
            <p className="leading-relaxed">
              Tidak ada sistem yang sepenuhnya bebas risiko. Jaga kerahasiaan kata sandimu dan gunakan kata sandi yang kuat.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">9. Hak kamu sebagai pemilik data pribadi</h2>
            <p className="leading-relaxed">Sesuai UU PDP, kamu memiliki hak antara lain untuk:</p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>mendapatkan informasi tentang data yang kami proses;</li>
              <li>mengakses dan memperoleh salinan datamu;</li>
              <li>memperbaiki atau memperbarui datamu;</li>
              <li>menghapus datamu;</li>
              <li>menarik persetujuan pemrosesan;</li>
              <li>mengajukan keberatan atas pemrosesan tertentu;</li>
              <li>mengajukan pengaduan.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">10. Cara menggunakan hakmu</h2>
            <p className="leading-relaxed">Sebagian besar hak dapat kamu jalankan langsung di dalam aplikasi:</p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li><strong>Akses dan portabilitas:</strong> ekspor seluruh datamu (JSON/CSV) melalui Pengaturan.</li>
              <li><strong>Perbaikan:</strong> ubah atau perbarui transaksi, akun, dan kategori kapan saja di dalam aplikasi.</li>
              <li><strong>Penghapusan dan penarikan persetujuan:</strong> hapus akun beserta seluruh data melalui Pengaturan.</li>
            </ul>
            <p className="leading-relaxed">
              Untuk permintaan lain, hubungi kami di <strong>support@saku.id</strong>. Kami akan menanggapi dalam jangka waktu yang wajar.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">11. Data anak</h2>
            <p className="leading-relaxed">
              Saku ditujukan untuk pengguna berusia 18 tahun ke atas. Kami tidak dengan sengaja mengumpulkan data anak. Jika kamu mengetahui bahwa seorang anak telah memberikan data kepada kami tanpa persetujuan yang sah, hubungi kami agar data tersebut dapat dihapus.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">12. Cookie dan teknologi serupa</h2>
            <p className="leading-relaxed">
              Kami menggunakan cookie atau penyimpanan lokal peramban seperlunya untuk menjaga sesi masuk dan mengingat preferensimu (bahasa dan tema). Kami tidak menggunakan cookie pelacak iklan pihak ketiga.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">13. Pemberitahuan jika terjadi pelanggaran data</h2>
            <p className="leading-relaxed">
              Jika terjadi kegagalan pelindungan data pribadi yang berdampak pada kamu, kami akan memberitahukannya kepada kamu dan kepada lembaga yang berwenang sesuai kewajiban dan tenggat yang diatur dalam UU PDP (termasuk tenggat waktu 3x24 jam).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">14. Perubahan kebijakan</h2>
            <p className="leading-relaxed">
              Kami dapat memperbarui Kebijakan Privasi ini. Jika ada perubahan penting, kami akan memberitahukannya di dalam aplikasi atau melalui email. Tanggal &quot;terakhir diperbarui&quot; di atas menunjukkan versi terbaru.
            </p>
          </section>

          <section className="space-y-4 pb-12">
            <h2 className="text-2xl font-bold tracking-tight">15. Kontak dan pengaduan</h2>
            <p className="leading-relaxed">
              Pertanyaan, permintaan hak, atau pengaduan terkait privasi data dapat disampaikan langsung kepada tim kami. Kamu juga berhak menyampaikan pengaduan kepada lembaga yang berwenang di bidang pelindungan data pribadi di Indonesia.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 bg-brand hover:bg-brand-hover text-on-brand shadow-sm font-semibold mt-4">
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
