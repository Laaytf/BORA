-- Script SQL para configuração do webhook da Ticto
-- Execute este script no Supabase se a tabela profiles ainda não existir

-- Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índice no email para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Política: Permitir inserção via service role (webhook)
CREATE POLICY "Service role can insert profiles"
  ON profiles
  FOR INSERT
  WITH CHECK (true);

-- Comentário explicativo
COMMENT ON TABLE profiles IS 'Perfis de usuários criados automaticamente pelo webhook da Ticto';
