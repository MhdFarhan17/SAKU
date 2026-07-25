'use client'

import { useState } from 'react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useSeedCategories } from '@/features/categories/hooks'
import { Card, CardContent } from '@/components/ui/card'
import { CategoryToken } from '@/components/category-token'
import { normalizeIcon } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Sparkles } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useTranslation } from 'react-i18next'
import { getTranslatedCategoryName } from '@/features/categories/utils'

export default function CategoriesPage() {
  const { t } = useTranslation()
  const { data: categories, isLoading, error } = useCategories()
  const { mutateAsync: createCategory } = useCreateCategory()
  const { mutateAsync: updateCategory } = useUpdateCategory()
  const { mutateAsync: deleteCategory } = useDeleteCategory()
  const { mutateAsync: seedCategories, isPending: isSeeding } = useSeedCategories()

  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [kind, setKind] = useState<'income' | 'expense'>('expense')
  const [icon, setIcon] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) return <div className="p-4 md:p-6 font-medium">{t('categories.loading', 'Memuat kategori...')}</div>
  if (error) return <div className="p-4 md:p-6 text-expense font-medium">{t('categories.error_load', 'Gagal memuat kategori.')}</div>

  const incomeCategories = categories?.filter(c => c.kind === 'income') || []
  const expenseCategories = categories?.filter(c => c.kind === 'expense') || []
  const isEmpty = incomeCategories.length === 0 && expenseCategories.length === 0

  const openAdd = () => {
    setEditId(null)
    setName('')
    setKind('expense')
    setIcon('')
    setIsOpen(true)
  }

  const openEdit = (cat: { id: string, name: string, kind: 'income' | 'expense', icon?: string | null }) => {
    setEditId(cat.id)
    setName(cat.name)
    setKind(cat.kind)
    setIcon(normalizeIcon(cat.icon))
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    setIsSubmitting(true)
    try {
      if (editId) {
        await updateCategory({
          id: editId,
          category: {
            name,
            kind,
            icon,
          }
        })
        toast.info("Kategori Diperbarui", { description: `Kategori '${name}' telah disimpan.` })
      } else {
        await createCategory({
          name,
          kind,
          icon,
          color: kind === 'expense' ? '#ea384c' : '#9fe870' // Default fallback colors
        })
        toast.success(t('categories.toast_add_title', 'Kategori Ditambahkan'), { description: t('categories.toast_add_desc', "Kategori '{{name}}' berhasil dibuat.", { name }) })
      }
      setIsOpen(false)
    } catch (err) {
      console.error(err)
      toast.error(t('categories.toast_error_title', 'Gagal Menyimpan'), { description: t('categories.toast_error_desc', 'Terjadi kesalahan saat menyimpan kategori.') })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!editId) return
    setIsSubmitting(true)
    try {
      await deleteCategory(editId)
      toast.success("Kategori Dihapus", { description: "Kategori berhasil dihapus dari sistem." })
      setIsOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Gagal Menghapus", { description: "Terjadi kesalahan saat menghapus kategori." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSeed = async () => {
    try {
      await seedCategories()
      toast.success("Kategori Default Dibuat", { description: "Kategori bawaan telah dipulihkan." })
    } catch (err) {
      toast.error("Gagal Membuat Kategori", { description: "Terjadi kesalahan sistem." })
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 md:space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text-main">{t('settings.categories', 'Kategori')}</h1>
          <p className="text-text-muted mt-1 font-medium">{t('settings.categories_desc', 'Kelola kategori pemasukan dan pengeluaran.')}</p>
        </div>
        <div className="flex gap-2">
          {isEmpty && (
            <Button 
              variant="outline"
              className="rounded-[16px] font-bold"
              onClick={handleSeed}
              disabled={isSeeding}
            >
              {isSeeding ? t('categories.creating', 'Membuat...') : t('categories.create_default', 'Buat Default')}
            </Button>
          )}
          <Button 
            className="rounded-[16px] bg-brand text-[#0e0f0c] hover:bg-brand/90 font-bold hidden md:flex"
            onClick={openAdd}
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('categories.add_category', 'Tambah Kategori')}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text-main">{t('categories.expense', 'Pengeluaran')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {expenseCategories.map(cat => (
            <Card key={cat.id} onClick={() => openEdit(cat as any)} className="rounded-[16px] hover:border-brand cursor-pointer transition-all duration-200 active:scale-[0.98] hover:shadow-md border-border shadow-sm">
              <CardContent className="p-3 md:p-4 flex items-center justify-center">
                <CategoryToken name={getTranslatedCategoryName(cat.name, t)} kind={cat.kind} icon={cat.icon} />
              </CardContent>
            </Card>
          ))}
          {expenseCategories.length === 0 && (
            <p className="text-text-muted text-sm col-span-full font-medium">{t('categories.empty_expense', 'Belum ada kategori pengeluaran.')}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text-main">{t('categories.income', 'Pemasukan')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {incomeCategories.map(cat => (
            <Card key={cat.id} onClick={() => openEdit(cat as any)} className="rounded-[16px] hover:border-brand cursor-pointer transition-all duration-200 active:scale-[0.98] hover:shadow-md border-border shadow-sm">
              <CardContent className="p-3 md:p-4 flex items-center justify-center">
                <CategoryToken name={getTranslatedCategoryName(cat.name, t)} kind={cat.kind} icon={cat.icon} />
              </CardContent>
            </Card>
          ))}
          {incomeCategories.length === 0 && (
            <p className="text-text-muted text-sm col-span-full font-medium">{t('categories.empty_income', 'Belum ada kategori pemasukan.')}</p>
          )}
        </div>
      </div>

      {/* Mobile FAB */}
      <Button 
        onClick={openAdd}
        size="icon" 
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg md:hidden bg-brand text-[#0e0f0c] hover:bg-brand/90 z-50"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add/Edit Category Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="max-h-[96vh] h-auto sm:max-w-md mx-auto rounded-t-[24px] sm:rounded-[24px] sm:mb-8 z-[100] flex flex-col">
          <SheetHeader className="mb-6 pt-2 sm:pt-0">
            <div className="mx-auto w-12 h-1.5 rounded-full bg-border/80 mb-4 sm:hidden" />
            <SheetTitle className="text-2xl font-black">{editId ? t('categories.edit_title', 'Edit Kategori') : t('categories.add_title', 'Kategori Baru')}</SheetTitle>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full flex-1">
            <div className="flex bg-surface-subtle p-1 rounded-[12px] border border-border mx-1">
              {(['expense', 'income'] as const).map(tItem => (
                <button
                  key={tItem}
                  type="button"
                  onClick={() => setKind(tItem)}
                  className={`flex-1 py-2 text-sm font-bold rounded-[8px] capitalize transition-all duration-200 cursor-pointer active:scale-95 ${
                    kind === tItem 
                      ? (tItem === 'expense' ? 'bg-expense text-white shadow-md' : 'bg-income text-white shadow-md') 
                      : 'text-text-secondary hover:text-text-main hover:bg-black/5 hover:shadow-sm'
                  }`}
                >
                  {tItem === 'expense' ? t('categories.expense', 'Pengeluaran') : t('categories.income', 'Pemasukan')}
                </button>
              ))}
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pb-6 px-1">
              <div className="flex gap-4">
                <div className="space-y-2 w-20 shrink-0">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('categories.icon_label', 'Ikon')}</label>
                  <Input 
                    type="text" 
                    placeholder="🍔" 
                    value={icon}
                    onChange={e => setIcon(e.target.value.trim().substring(0, 2))}
                    className="rounded-[12px] h-12 text-center text-xl"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('categories.name_label', 'Nama Kategori')}</label>
                  <Input 
                    type="text" 
                    placeholder={t('categories.name_placeholder', 'Contoh: Makanan, Gaji')} 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="rounded-[12px] h-12"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-auto shrink-0 flex gap-3">
              {editId && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      type="button"
                      variant="outline"
                      size="lg"
                      className="rounded-[12px] border-expense text-expense hover:bg-expense hover:text-white font-bold bg-transparent"
                    >
                      {t('categories.delete', 'Hapus')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="z-[110] rounded-[24px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-expense">{t('categories.delete_confirm_title', 'Hapus kategori ini?')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('categories.delete_confirm_desc', 'Tindakan ini tidak dapat dibatalkan. Kategori ini akan dihapus dari daftar.')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-[12px]">{t('categories.cancel', 'Batal')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-expense text-white hover:bg-red-600 rounded-[12px]">{t('categories.delete_btn', 'Hapus Kategori')}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button type="submit" size="lg" className="flex-1 rounded-[12px] bg-brand text-[#0e0f0c] hover:bg-brand/90 font-black" disabled={isSubmitting}>
                {isSubmitting ? t('categories.saving', 'Menyimpan...') : t('categories.save_btn', 'Simpan Kategori')}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
