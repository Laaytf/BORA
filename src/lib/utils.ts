import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata valores monetários para o padrão brasileiro (pt-BR)
 * @param value - Valor numérico a ser formatado
 * @param showDecimals - Se deve forçar exibição de casas decimais (padrão: auto)
 * @returns String formatada (ex: "3.355,67" ou "14.000")
 */
export function formatCurrency(value: number, showDecimals: 'auto' | 'always' | 'never' = 'auto'): string {
  const hasDecimals = value % 1 !== 0

  if (showDecimals === 'always' || (showDecimals === 'auto' && hasDecimals)) {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

/**
 * Formata números inteiros para o padrão brasileiro (pt-BR)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada (ex: "1.234")
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR')
}
