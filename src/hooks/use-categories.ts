import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from './use-toast'

export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  budget: number
  icon: string
  created_at: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  // Buscar categorias
  const fetchCategories = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      // Garantir que icon existe, usando valor padrão se necessário
      const categoriesWithIcon = (data || []).map(cat => ({
        ...cat,
        icon: (cat as any).icon || '📁'
      })) as Category[]
      setCategories(categoriesWithIcon)
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar categorias',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Criar categoria
  const createCategory = async (name: string, color: string, budget: number = 0, icon: string = '📁') => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          user_id: user.id,
          name,
          color,
          budget,
          icon,
        })
        .select()
        .single()

      if (error) throw error

      // Garantir que icon existe
      const categoryWithIcon: Category = {
        ...data,
        icon: (data as any).icon || '📁'
      }
      setCategories([...categories, categoryWithIcon])
      toast({
        title: 'Categoria criada!',
        description: `A categoria "${name}" foi criada com sucesso.`,
      })
      return data
    } catch (error: any) {
      toast({
        title: 'Erro ao criar categoria',
        description: error.message,
        variant: 'destructive',
      })
      return null
    }
  }

  // Atualizar categoria
  const updateCategory = async (id: string, updates: Partial<Category>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      // Garantir que icon existe
      const updatedCategoryWithIcon: Category = {
        ...data,
        icon: (data as any).icon || '📁'
      }
      setCategories(categories.map((cat) => (cat.id === id ? updatedCategoryWithIcon : cat)))
      toast({
        title: 'Categoria atualizada!',
        description: 'As alterações foram salvas.',
      })
      return data
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar categoria',
        description: error.message,
        variant: 'destructive',
      })
      return null
    }
  }

  // Deletar categoria
  const deleteCategory = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setCategories(categories.filter((cat) => cat.id !== id))
      toast({
        title: 'Categoria excluída!',
        description: 'A categoria foi removida.',
      })
      return true
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir categoria',
        description: error.message,
        variant: 'destructive',
      })
      return false
    }
  }

  useEffect(() => {
    fetchCategories()

    // Inscrever-se em mudanças em tempo real
    const channel = supabase
      .channel('categories_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchCategories()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  }
}
