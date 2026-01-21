-- ========================================
-- CORREÇÃO: Adicionar coluna icon
-- ========================================
-- Tabela: categories
-- Ação: Adicionar coluna TEXT para emoji
-- ========================================

ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '📁';

COMMENT ON COLUMN public.categories.icon 
IS 'Emoji representativo da categoria';

-- ========================================
-- Fim da migration
-- ========================================
