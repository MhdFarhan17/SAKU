import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const iconsMap: Record<string, string> = {
  'Makanan & Minuman': '🍔',
  'Transportasi': '🚗',
  'Belanja': '🛍️',
  'Tagihan': '🧾',
  'Hiburan': '🎮',
  'Gaji': '💰',
  'Investasi': '📈',
  'Bonus': '🎁'
}

async function run() {
  const { data: categories, error } = await supabase.from('categories').select('*')
  if (error) {
    console.error(error)
    process.exit(1)
  }

  for (const cat of categories) {
    const icon = iconsMap[cat.name]
    if (icon && !cat.icon) {
      console.log(`Updating ${cat.name} with icon ${icon}...`)
      await supabase.from('categories').update({ icon }).eq('id', cat.id)
    }
  }

  console.log('Migration completed.')
}

run()
