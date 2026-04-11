
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testWrite() {
  console.log('Testing write to configuracoes_loja...')
  const testData = {
    id: 1,
    nome: "Teste de Persistência " + new Date().toISOString(),
    horarios_bloqueados: ["Segunda-08:00", "Segunda-08:30"]
  }

  const { data, error } = await supabase
    .from('configuracoes_loja')
    .upsert(testData)
    .select()

  if (error) {
    console.error('Write Error:', error)
  } else {
    console.log('Write Success:', data)
  }

  const { data: readData, error: readError } = await supabase
    .from('configuracoes_loja')
    .select('*')
    .eq('id', 1)
    .single()

  if (readError) {
    console.error('Read Error:', readError)
  } else {
    console.log('Read Data:', readData)
  }
}

testWrite()
