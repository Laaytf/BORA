-- Adicionar coluna icon para armazenar emojis nas categorias
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '📁';

-- Atualizar categorias existentes com emojis padrão
UPDATE categories SET icon = '📁' WHERE icon IS NULL;
