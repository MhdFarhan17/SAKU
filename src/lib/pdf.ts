import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface PDFTransactionData {
  date: string
  note: string | null
  kind: 'income' | 'expense' | 'transfer'
  amount_minor: number
  categoryName: string
  accountName: string
}

export function generateMonthlyReport(
  period: string, // e.g. "Agustus 2026"
  transactions: PDFTransactionData[],
  totalIncome: number,
  totalExpense: number,
  userName: string,
  printTime: string
) {
  // Create a new jsPDF instance (A4 size, portrait)
  const doc = new jsPDF()
  
  // Saku Brand Color: #9fff24 (RGB: 159, 255, 36) -> which is light green.
  // We'll use a slightly darker green for the PDF to ensure good contrast on white paper.
  const brandR = 60
  const brandG = 179
  const brandB = 113

  // ==============================
  // HEADER
  // ==============================
  // Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(30, 30, 30)
  doc.text('SAKU', 14, 22)

  doc.setFontSize(14)
  doc.setTextColor(100, 100, 100)
  doc.text('LAPORAN KEUANGAN BULANAN', 14, 30)

  // Period
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Periode: ${period}`, 14, 37)

  // Print Time & User
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text(`Dicetak pada: ${printTime}`, 14, 43)
  doc.text(`Oleh: ${userName}`, 14, 48)

  // Line separator
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.5)
  doc.line(14, 52, 196, 52)

  // ==============================
  // SUMMARY SECTION
  // ==============================
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(30, 30, 30)
  doc.text('RINGKASAN KEUANGAN', 14, 62)

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`

  const netTotal = totalIncome - totalExpense

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  
  // Income
  doc.setTextColor(40, 167, 69) // Green
  doc.text('Total Pemasukan', 14, 72)
  doc.text(`: ${formatCurrency(totalIncome)}`, 60, 72)

  // Expense
  doc.setTextColor(220, 53, 69) // Red
  doc.text('Total Pengeluaran', 14, 79)
  doc.text(`: ${formatCurrency(totalExpense)}`, 60, 79)

  // Net Balance
  doc.setTextColor(30, 30, 30)
  doc.setFont('helvetica', 'bold')
  doc.text('Saldo Bersih', 14, 86)
  doc.text(`: ${formatCurrency(netTotal)}`, 60, 86)

  // ==============================
  // TRANSACTIONS TABLE
  // ==============================
  const tableData = transactions.map(t => {
    const formattedDate = new Date(t.date).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
    const amountStr = formatCurrency(t.amount_minor)
    const kindLabel = t.kind === 'income' ? 'Pemasukan' : t.kind === 'expense' ? 'Pengeluaran' : 'Transfer'
    
    return [
      formattedDate,
      t.categoryName || '-',
      t.note || '-',
      t.accountName || '-',
      kindLabel,
      amountStr
    ]
  })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('RINCIAN TRANSAKSI', 14, 100)

  autoTable(doc, {
    startY: 105,
    head: [['Tanggal', 'Kategori', 'Catatan', 'Akun', 'Jenis', 'Nominal']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [brandR, brandG, brandB], // Custom brand color header
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 26 }, // Tanggal
      1: { cellWidth: 32 }, // Kategori
      2: { cellWidth: 'auto' }, // Catatan
      3: { cellWidth: 30 }, // Akun
      4: { cellWidth: 26 }, // Jenis
      5: { halign: 'right', cellWidth: 35 } // Nominal
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      valign: 'middle'
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    margin: { left: 14, right: 14 },
    didParseCell: function(data) {
      // Colorize the Nominal column based on transaction type
      if (data.section === 'body' && data.column.index === 5) {
        const kind = transactions[data.row.index].kind
        if (kind === 'income') {
          data.cell.styles.textColor = [40, 167, 69] // Green
        } else if (kind === 'expense') {
          data.cell.styles.textColor = [220, 53, 69] // Red
        } else {
          data.cell.styles.textColor = [100, 100, 100] // Gray for transfer
        }
      }
    }
  })

  // Footer / Page numbers
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Digenerate oleh Aplikasi Saku - Halaman ${i} dari ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  // Save the PDF
  const filename = `Laporan_Saku_${period.replace(/\s+/g, '_')}.pdf`
  doc.save(filename)
}
