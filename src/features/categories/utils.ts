export function getTranslatedCategoryName(name: string, t: any): string {
  const map: Record<string, string> = {
    'Makanan & Minuman': t('categories_default.food', 'Food & Beverage'),
    'Transportasi': t('categories_default.transport', 'Transportation'),
    'Belanja': t('categories_default.shopping', 'Shopping'),
    'Tagihan': t('categories_default.bills', 'Bills'),
    'Hiburan': t('categories_default.entertainment', 'Entertainment'),
    'Gaji': t('categories_default.salary', 'Salary'),
    'Investasi': t('categories_default.investment', 'Investment'),
    'Bonus': t('categories_default.bonus', 'Bonus'),
  }
  
  // Return the translated name if it exists in the map, otherwise return the original name
  return map[name] || name
}
