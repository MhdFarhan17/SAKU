export function getTranslatedCategoryName(name: string, t: any): string {
  const map: Record<string, string> = {
    // Expense categories
    'Makanan': t('categories_default.food', 'Makanan'),
    'Makanan & Minuman': t('categories_default.food', 'Makanan'),
    'Transportasi': t('categories_default.transport', 'Transportasi'),
    'Tagihan': t('categories_default.bills', 'Tagihan'),
    'Hiburan': t('categories_default.entertainment', 'Hiburan'),
    'Belanja': t('categories_default.shopping', 'Belanja'),
    'Kesehatan': t('categories_default.health', 'Kesehatan'),
    // Income categories
    'Gaji': t('categories_default.salary', 'Gaji'),
    'Investasi': t('categories_default.investment', 'Investasi'),
    'Pemberian': t('categories_default.gift', 'Pemberian'),
    'Bonus': t('categories_default.bonus', 'Bonus'),
  }
  
  // Return the translated name if it exists in the map, otherwise return the original name (user-created)
  return map[name] || name
}
