-- Adicionar coluna icon na tabela categories
-- Esta coluna armazena o emoji representativo de cada categoria

ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '📁';

-- Adicionar comentário na coluna
COMMENT ON COLUMN public.categories.icon IS 'Emoji representativo da categoria';
