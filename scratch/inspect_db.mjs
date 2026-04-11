
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://fcumwatjgcuvhuwtxtye.supabase.co'
const supabaseAnonKey = 'sb_publishable_OZ5D8xEzn044ozlnLOEfKQ_r1ISx-ow'

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
