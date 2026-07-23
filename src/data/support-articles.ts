export type Article = {
  id: string;
  category: 'memulai' | 'transaksi' | 'target' | 'akun';
  title: string;
  content: string[];
};

export const supportArticlesID: Article[] = [
  // KATEGORI: MEMULAI SAKU
  {
    id: 'memulai-1',
    category: 'memulai',
    title: 'Bagaimana cara terbaik untuk mulai menggunakan Saku?',
    content: [
      'Selamat datang di Saku! Langkah pertama untuk mengelola keuangan Anda adalah dengan menyiapkan "Akun" (Dompet/Rekening).',
      'Masuk ke menu **Akun** melalui navigasi di bawah, lalu klik tombol **+ Akun**. Tambahkan dompet tunai atau rekening bank yang sering Anda gunakan beserta saldo awalnya.',
      'Setelah dompet siap, Anda bisa langsung mulai mencatat setiap pemasukan dan pengeluaran harian Anda di halaman **Dasbor** secara rutin. Semakin sering Anda mencatat, semakin akurat laporan keuangan Anda!'
    ]
  },
  {
    id: 'memulai-2',
    category: 'memulai',
    title: 'Apakah Saku terhubung langsung dengan rekening bank saya?',
    content: [
      'Tidak. Saku dirancang secara khusus sebagai aplikasi pencatatan keuangan mandiri (manual).',
      'Kami **tidak pernah menghubungkan, membaca, atau menarik uang** langsung dari rekening bank asli Anda. Hal ini sengaja kami rancang demi menjaga 100% privasi, kerahasiaan data, dan keamanan uang Anda dari risiko peretasan pihak ketiga.',
      'Selain itu, mencatat secara manual terbukti secara psikologis mampu meningkatkan kesadaran finansial Anda setiap kali Anda membelanjakan uang.'
    ]
  },
  {
    id: 'memulai-3',
    category: 'memulai',
    title: 'Apakah fitur di Saku 100% gratis selamanya?',
    content: [
      'Ya! Saku dibangun dengan misi membantu semua orang mencapai kebebasan finansial tanpa dibebani biaya langganan aplikasi.',
      'Fitur inti Saku seperti pencatatan transaksi tanpa batas, pembuatan akun, target tabungan, hingga ekspor laporan PDF **selamanya gratis** tanpa adanya paywall atau iklan yang mengganggu.'
    ]
  },

  // KATEGORI: TRANSAKSI & ANGGARAN
  {
    id: 'transaksi-1',
    category: 'transaksi',
    title: 'Cara menghapus atau mengubah transaksi yang salah catat',
    content: [
      'Pernah salah ketik nominal saat mencatat pengeluaran? Jangan panik, Anda bisa mengedit atau menghapusnya kapan saja.',
      'Caranya sangat mudah: Cukup klik transaksi yang salah tersebut di halaman **Dasbor** atau **Semua Transaksi**.',
      'Sebuah formulir (pop-up) akan muncul dari bawah layar. Di sana Anda bisa mengganti nominal, kategori, atau catatannya. Jika ingin menghapus transaksi secara permanen, cukup tekan tombol **Hapus** (ikon tempat sampah) di formulir tersebut.'
    ]
  },
  {
    id: 'transaksi-2',
    category: 'transaksi',
    title: 'Rahasia menggunakan fitur Transaksi Berulang (Recurring)',
    content: [
      'Jika Anda memiliki tagihan tetap yang harus dibayar setiap bulan (seperti langganan Netflix, WiFi, kosan, atau asuransi), Anda tidak perlu repot mencatatnya secara manual berulang kali.',
      'Gunakan fitur **Transaksi Berulang**! Cukup buat satu kali, atur jadwalnya (misal: setiap tanggal 1), dan Saku akan otomatis mencatat pengeluaran tersebut ke dalam arus kas Anda setiap bulannya.',
      'Anda bisa mematikan atau mengedit transaksi berulang ini kapan saja melalui menu Pengaturan > Transaksi Berulang.'
    ]
  },
  {
    id: 'transaksi-3',
    category: 'transaksi',
    title: 'Apa arti warna merah pada bar Anggaran (Budget)?',
    content: [
      'Saku dilengkapi dengan sistem pengingat anggaran untuk membantu Anda agar tidak boros di kategori tertentu (misalnya: Belanja atau Makanan).',
      'Jika Anda mencatat pengeluaran yang nominalnya melebihi batas anggaran yang telah Anda tetapkan, bar indikator pada halaman Anggaran akan berubah warna menjadi **merah bata**.',
      'Jangan khawatir, **tidak ada uang yang ditahan atau diblokir**. Warna merah ini hanya berfungsi sebagai peringatan visual agar Anda lebih berhati-hati dalam membelanjakan sisa uang Anda di bulan tersebut.'
    ]
  },
  {
    id: 'transaksi-4',
    category: 'transaksi',
    title: 'Cara Ekspor Laporan Transaksi ke format PDF',
    content: [
      'Saku memudahkan Anda untuk membuat rekapitulasi keuangan bulanan untuk keperluan laporan, bisnis, atau sekadar arsip pribadi.',
      'Untuk melakukannya, pergi ke halaman **Transaksi**. Di bagian atas, Anda akan menemukan tombol **Ekspor PDF**.',
      'Sistem Saku akan secara otomatis menghasilkan dokumen rapi berisi rincian seluruh pemasukan dan pengeluaran Anda di bulan yang sedang dipilih. File PDF ini bisa langsung Anda bagikan atau simpan di perangkat.'
    ]
  },

  // KATEGORI: TARGET & HUTANG
  {
    id: 'target-1',
    category: 'target',
    title: 'Memahami cara kerja fitur Target Tabungan (Goals)',
    content: [
      'Sering merasa tabungan Anda tidak pernah terkumpul? Fitur **Target Tabungan** hadir sebagai "Celengan Digital" untuk memotivasi Anda.',
      'PENTING: Fitur ini hanya berfungsi sebagai visualisasi progres. Karena Saku tidak terhubung ke bank, **uang Anda tidak dipotong secara otomatis**. Anda tetap harus menyisihkan uang aslinya secara fisik atau mentransfernya ke rekening tabungan nyata Anda.',
      'Setiap kali Anda menabung di dunia nyata, catat progresnya di fitur ini dengan menekan tombol **Tambah Uang**. Saksikan bar persentase Anda terus naik hingga mencapai 100% dan impian Anda terwujud!'
    ]
  },
  {
    id: 'target-2',
    category: 'target',
    title: 'Cara mencatat teman yang berhutang kepada Anda',
    content: [
      'Tidak perlu lagi merasa canggung menagih hutang ke teman. Anda bisa mencatat riwayat hutang piutang dengan rapi di Saku.',
      'Masuk ke menu **Lainnya > Hutang / Piutang**, lalu klik **Tambah Hutang**.',
      'Jika teman meminjam uang Anda, pilih tipe **"Uang Dipinjamkan"** (Piutang). Nanti ketika teman Anda mulai membayar (mencicil), Anda bisa memasukkan nominal cicilannya di Saku. Sistem akan otomatis menghitung sisa hutangnya hingga lunas 100%.'
    ]
  },
  {
    id: 'target-3',
    category: 'target',
    title: 'Apakah mencatat tabungan/hutang mengurangi saldo dompet?',
    content: [
      'Tergantung! Saat Anda menambahkan progres menabung atau memberikan hutang, Saku akan memunculkan opsi konfirmasi: *Apakah Anda ingin transaksi ini juga dicatat sebagai pengeluaran dari dompet Anda?*',
      'Jika Anda mencentangnya, saldo dompet (misalnya BCA atau Uang Tunai) Anda akan otomatis berkurang sesuai nominal yang Anda tabung/pinjamkan.',
      'Hal ini sangat membantu agar pencatatan arus kas Anda tetap seimbang dan akurat (balance).'
    ]
  },

  // KATEGORI: AKUN & KEAMANAN
  {
    id: 'akun-1',
    category: 'akun',
    title: 'Penyebab saldo dompet atau rekening Anda bernilai minus (-)',
    content: [
      'Melihat angka minus merah di halaman Akun? Jangan panik.',
      'Saldo minus hanya terjadi jika Anda mencatat **Pengeluaran** yang nominalnya lebih besar dari total saldo yang ada di Akun tersebut.',
      'Saku sengaja tidak membatasi pencatatan Anda. Angka minus ini dibiarkan terjadi sebagai **pengingat** bahwa Anda mungkin lupa mencatat sumber "Pemasukan" sebelumnya. Cukup tambahkan pemasukan baru ke dompet tersebut, dan saldonya akan kembali normal.'
    ]
  },
  {
    id: 'akun-2',
    category: 'akun',
    title: 'Fungsi tombol konfirmasi saat ingin Keluar (Logout)',
    content: [
      'Kami merancang antarmuka Saku sangat ramah untuk pengguna perangkat seluler (Mobile/HP).',
      'Karena layar HP rentan terhadap sentuhan yang tidak disengaja, kami menambahkan fitur **Keamanan Ganda (Anti-Accidental Logout)**. Setiap kali tombol Keluar ditekan, Saku akan memunculkan pop-up konfirmasi terlebih dahulu.',
      'Hal ini mencegah Anda terkeluar dari aplikasi secara tidak sengaja saat sedang sibuk mencatat transaksi, yang mana bisa sangat merepotkan karena Anda harus masuk (login) kembali menggunakan email dan password.'
    ]
  },
  {
    id: 'akun-3',
    category: 'akun',
    title: 'Bagaimana cara mengganti email atau menghapus akun secara permanen?',
    content: [
      'Seluruh pengaturan data diri, profil, dan preferensi akun Saku Anda bisa diakses melalui menu **Pengaturan** di halaman Dasbor (ikon roda gigi di pojok kiri atas).',
      'Di sana Anda bisa memperbarui foto profil, nama pengguna, alamat email, hingga pilihan untuk menghapus seluruh data Saku Anda secara permanen jika suatu saat Anda tidak lagi menggunakannya.'
    ]
  }
];

export const supportArticlesEN: Article[] = [
  // CATEGORY: GETTING STARTED
  {
    id: 'memulai-1',
    category: 'memulai',
    title: 'What is the best way to start using Saku?',
    content: [
      'Welcome to Saku! The first step to managing your finances is to set up an "Account" (Wallet/Bank).',
      'Go to the **Accounts** menu via the bottom navigation, then click the **+ Account** button. Add the cash wallet or bank account you use most often along with its initial balance.',
      'Once your wallet is ready, you can immediately start recording your daily income and expenses on the **Dashboard** regularly. The more often you record, the more accurate your financial reports will be!'
    ]
  },
  {
    id: 'memulai-2',
    category: 'memulai',
    title: 'Does Saku connect directly to my bank account?',
    content: [
      'No. Saku is specifically designed as a standalone (manual) financial tracking app.',
      'We **never connect, read, or withdraw money** directly from your real bank account. We deliberately designed this to maintain 100% privacy, data confidentiality, and the security of your money from the risk of third-party hacking.',
      'Furthermore, recording manually has been proven psychologically to increase your financial awareness every time you spend money.'
    ]
  },
  {
    id: 'memulai-3',
    category: 'memulai',
    title: 'Are the features in Saku 100% free forever?',
    content: [
      'Yes! Saku was built with the mission of helping everyone achieve financial freedom without being burdened by app subscription fees.',
      'Saku\'s core features such as unlimited transaction tracking, account creation, savings goals, and PDF report exports are **forever free** without any paywalls or intrusive ads.'
    ]
  },

  // CATEGORY: TRANSACTIONS & BUDGET
  {
    id: 'transaksi-1',
    category: 'transaksi',
    title: 'How to delete or change an incorrectly recorded transaction',
    content: [
      'Ever typed the wrong amount when recording an expense? Don\'t panic, you can edit or delete it at any time.',
      'It\'s very easy: Just click the incorrect transaction on the **Dashboard** or **All Transactions** page.',
      'A form (pop-up) will appear from the bottom of the screen. There you can change the amount, category, or note. If you want to delete the transaction permanently, simply press the **Delete** button (trash can icon) on the form.'
    ]
  },
  {
    id: 'transaksi-2',
    category: 'transaksi',
    title: 'The secret to using the Recurring Transaction feature',
    content: [
      'If you have fixed bills that must be paid every month (such as Netflix, WiFi, rent, or insurance subscriptions), you don\'t need to bother recording them manually over and over again.',
      'Use the **Recurring Transaction** feature! Just create it once, set the schedule (e.g., every 1st of the month), and Saku will automatically record the expense into your cash flow every month.',
      'You can turn off or edit these recurring transactions at any time via Settings > Recurring Transactions.'
    ]
  },
  {
    id: 'transaksi-3',
    category: 'transaksi',
    title: 'What does the red color on the Budget bar mean?',
    content: [
      'Saku is equipped with a budget reminder system to help you avoid overspending in certain categories (for example: Shopping or Food).',
      'If you record an expense whose nominal value exceeds the budget limit you have set, the indicator bar on the Budget page will turn **brick red**.',
      'Don\'t worry, **no money is held or blocked**. This red color only serves as a visual warning so you are more careful in spending the rest of your money that month.'
    ]
  },
  {
    id: 'transaksi-4',
    category: 'transaksi',
    title: 'How to Export Transaction Reports to PDF format',
    content: [
      'Saku makes it easy for you to create monthly financial recaps for reporting, business, or simply personal archives.',
      'To do so, go to the **Transactions** page. At the top, you will find the **Export PDF** button.',
      'The Saku system will automatically generate a neat document detailing all your income and expenses for the currently selected month. You can immediately share this PDF file or save it to your device.'
    ]
  },

  // CATEGORY: GOALS & DEBT
  {
    id: 'target-1',
    category: 'target',
    title: 'Understanding how the Savings Goals feature works',
    content: [
      'Often feel like your savings are never accumulating? The **Savings Goals** feature is here as a "Digital Piggy Bank" to motivate you.',
      'IMPORTANT: This feature only serves as a progress visualization. Because Saku is not connected to a bank, **your money is not deducted automatically**. You still have to physically set aside the real money or transfer it to your real savings account.',
      'Every time you save in the real world, record the progress in this feature by pressing the **Add Money** button. Watch your percentage bar keep rising until it reaches 100% and your dream comes true!'
    ]
  },
  {
    id: 'target-2',
    category: 'target',
    title: 'How to record friends who owe you money',
    content: [
      'No more feeling awkward asking friends for debt. You can neatly record debt history in Saku.',
      'Go to the **More > Debts / Receivables** menu, then click **Add Debt**.',
      'If a friend borrows your money, select the **"Money Lent"** (Receivable) type. Later when your friend starts paying (in installments), you can enter the installment amount in Saku. The system will automatically calculate the remaining debt until it is 100% paid off.'
    ]
  },
  {
    id: 'target-3',
    category: 'target',
    title: 'Does recording a goal/debt reduce wallet balance?',
    content: [
      'It depends! When you add savings progress or lend money, Saku will show a confirmation option: *Do you want this transaction to also be recorded as an expense from your wallet?*',
      'If you check it, your wallet balance (e.g. BCA or Cash) will automatically decrease according to the amount you saved/lent.',
      'This is very helpful so that your cash flow recording remains balanced and accurate.'
    ]
  },

  // CATEGORY: ACCOUNT & SECURITY
  {
    id: 'akun-1',
    category: 'akun',
    title: 'Causes of your wallet or account balance being negative (-)',
    content: [
      'Seeing a red minus number on the Account page? Don\'t panic.',
      'A negative balance only occurs if you record an **Expense** whose nominal value is greater than the total balance available in that Account.',
      'Saku deliberately does not limit your recording. This minus number is allowed to occur as a **reminder** that you might have forgotten to record a previous "Income" source. Simply add a new income to the wallet, and the balance will return to normal.'
    ]
  },
  {
    id: 'akun-2',
    category: 'akun',
    title: 'Function of the confirmation button when you want to Logout',
    content: [
      'We designed the Saku interface to be very friendly for mobile device users (Mobile/HP).',
      'Because HP screens are prone to accidental touches, we added a **Double Security (Anti-Accidental Logout)** feature. Every time the Logout button is pressed, Saku will pop up a confirmation first.',
      'This prevents you from accidentally logging out of the app while busy recording transactions, which can be very inconvenient because you have to log back in using your email and password.'
    ]
  },
  {
    id: 'akun-3',
    category: 'akun',
    title: 'How to change email or delete account permanently?',
    content: [
      'All of your personal data, profile, and Saku account preference settings can be accessed via the **Settings** menu on the Dashboard page (gear icon in the top left corner).',
      'There you can update your profile photo, username, email address, up to the option to permanently delete all your Saku data if one day you no longer use it.'
    ]
  }
];

export const getSupportArticles = (language: string): Article[] => {
  return language === 'en' ? supportArticlesEN : supportArticlesID;
};
