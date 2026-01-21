-- ==========================================
-- SETUP COMPLETO DO BANCO DE DADOS - FinanceApp
-- ==========================================
-- Este script recria TODAS as tabelas necessárias
-- Pode ser executado múltiplas vezes com segurança
-- Data: 2025-01-21
-- ==========================================

-- 1. TABELA: profiles
-- Armazena informações de perfil dos usuários
-- ==========================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comentários da tabela profiles
COMMENT ON TABLE public.profiles IS 'Perfis dos usuários do sistema';
COMMENT ON COLUMN public.profiles.id IS 'ID do usuário (referencia auth.users)';
COMMENT ON COLUMN public.profiles.name IS 'Nome completo do usuário';
COMMENT ON COLUMN public.profiles.email IS 'Email do usuário';

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- 2. TABELA: categories
-- Armazena categorias de transações dos usuários
-- ==========================================

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6' NOT NULL,
  budget NUMERIC DEFAULT 0 NOT NULL,
  icon TEXT DEFAULT '📁' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comentários da tabela categories
COMMENT ON TABLE public.categories IS 'Categorias de gastos e receitas dos usuários';
COMMENT ON COLUMN public.categories.user_id IS 'ID do usuário proprietário';
COMMENT ON COLUMN public.categories.name IS 'Nome da categoria';
COMMENT ON COLUMN public.categories.color IS 'Cor em hexadecimal da categoria';
COMMENT ON COLUMN public.categories.budget IS 'Orçamento mensal da categoria';
COMMENT ON COLUMN public.categories.icon IS 'Emoji representativo da categoria';

-- Índice para melhorar performance de queries por user_id
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);

-- RLS para categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own categories" ON public.categories;
CREATE POLICY "Users can view own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own categories" ON public.categories;
CREATE POLICY "Users can create own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own categories" ON public.categories;
CREATE POLICY "Users can update own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own categories" ON public.categories;
CREATE POLICY "Users can delete own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- 3. TABELA: transactions
-- Armazena transações financeiras dos usuários
-- ==========================================

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comentários da tabela transactions
COMMENT ON TABLE public.transactions IS 'Transações financeiras (receitas e despesas)';
COMMENT ON COLUMN public.transactions.user_id IS 'ID do usuário proprietário';
COMMENT ON COLUMN public.transactions.category_id IS 'ID da categoria (pode ser NULL)';
COMMENT ON COLUMN public.transactions.type IS 'Tipo: income (receita) ou expense (despesa)';
COMMENT ON COLUMN public.transactions.description IS 'Descrição da transação';
COMMENT ON COLUMN public.transactions.amount IS 'Valor da transação';
COMMENT ON COLUMN public.transactions.date IS 'Data da transação';

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);

-- RLS para transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own transactions" ON public.transactions;
CREATE POLICY "Users can create own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;
CREATE POLICY "Users can delete own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- 4. TRIGGER: Criar profile automaticamente
-- ==========================================
-- Quando um novo usuário se registra, cria automaticamente
-- um registro na tabela profiles

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Cria novo trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 5. CRIAR PERFIL PARA USUÁRIOS EXISTENTES
-- ==========================================
-- Este bloco cria perfis para usuários que já existem
-- mas não têm registro na tabela profiles

INSERT INTO public.profiles (id, email, name)
SELECT 
  id, 
  email,
  COALESCE(raw_user_meta_data->>'name', email)
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 6. PERMISSÕES
-- ==========================================
-- Garante que usuários autenticados possam acessar as tabelas

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.transactions TO authenticated;

-- ==========================================
-- SETUP COMPLETO - SUCESSO!
-- ==========================================
-- ✅ Todas as tabelas foram criadas
-- ✅ RLS configurado para segurança
-- ✅ Trigger automático de perfis ativo
-- ✅ Perfis criados para usuários existentes
-- O aplicativo está pronto para uso!
