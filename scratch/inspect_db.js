
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspect() {
  console.log('--- Inspecting configuracoes_loja ---')
  const { data: configs, error: configError } = await supabase.from('configuracoes_loja').select('*')
  if (configError) console.error('Config Error:', configError)
  else console.log('Configs:', JSON.stringify(configs, null, 2))

  console.log('\n--- Inspecting barbeiros ---')
  const { data: barbers, error: barberError } = await supabase.from('barbeiros').select('id, nome, horarios_bloqueados')
  if (barberError) console.error('Barber Error:', barberError)
  else console.log('Barbers:', JSON.stringify(barbers, null, 2))
}

inspect()
