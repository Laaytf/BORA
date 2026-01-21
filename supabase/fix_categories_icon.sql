-- Fix: Adicionar coluna icon faltante na tabela categories
-- Resolve o problema de categorias sem emojis

ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '📁';

-- Comentário
COMMENT ON COLUMN public.categories.icon IS 'Emoji da categoria';
