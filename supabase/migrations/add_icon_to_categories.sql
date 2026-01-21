-- Migration: Adicionar coluna icon na tabela categories
-- Esta coluna armazena o emoji representativo de cada categoria
-- Data: 2025-01-21

ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '📁';

-- Adicionar comentário descritivo na coluna
COMMENT ON COLUMN public.categories.icon IS 'Emoji representativo da categoria';
