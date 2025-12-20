import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, ShoppingCart, Car, Home, Utensils, Film, Briefcase, Heart, TrendingUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Category {
  id: number
  name: string
  icon: typeof ShoppingCart
  color: string
  bgColor: string
  budget: number
  spent: number
  transactions: number
}

export default function Categories() {
  const [categories] = useState<Category[]>([
    {
      id: 1,
      name: 'Alimentação',
      icon: Utensils,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-600',
      budget: 1500,
      spent: 1200,
      transactions: 28,
    },
    {
      id: 2,
      name: 'Transporte',
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600',
      budget: 1000,
      spent: 800,
      transactions: 15,
    },
    {
      id: 3,
      name: 'Lazer',
      icon: Film,
      color: 'text-purple-600',
      bgColor: 'bg-purple-600',
      budget: 800,
      spent: 600,
      transactions: 12,
    },
    {
      id: 4,
      name: 'Contas',
      icon: Home,
      color: 'text-orange-600',
      bgColor: 'bg-orange-600',
      budget: 600,
      spent: 450,
      transactions: 8,
    },
    {
      id: 5,
      name: 'Compras',
      icon: ShoppingCart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-600',
      budget: 500,
      spent: 350,
      transactions: 10,
    },
    {
      id: 6,
      name: 'Trabalho',
      icon: Briefcase,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-600',
      budget: 300,
      spent: 180,
      transactions: 5,
    },
    {
      id: 7,
      name: 'Saúde',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-600',
      budget: 400,
      spent: 250,
      transactions: 6,
    },
    {
      id: 8,
      name: 'Investimentos',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-600',
      budget: 1000,
      spent: 800,
      transactions: 4,
    },
  ])

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const percentageUsed = (totalSpent / totalBudget) * 100

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground mt-1">Organize e controle seus gastos por categoria</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="font-heading">Criar Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input id="name" placeholder="Ex: Educação" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento Mensal</Label>
                <Input id="budget" type="number" placeholder="0,00" />
              </div>
              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex gap-2 flex-wrap">
                  {['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-500'].map((color) => (
                    <button
                      key={color}
                      className={`h-10 w-10 rounded-lg ${color} hover:scale-110 transition-transform`}
                    />
                  ))}
                </div>
              </div>
              <Button className="w-full">Criar Categoria</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Overview */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="font-heading">Resumo do Orçamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Gasto Total</p>
              <p className="text-2xl font-bold">R$ {totalSpent.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Orçamento Total</p>
              <p className="text-2xl font-bold text-muted-foreground">R$ {totalBudget.toFixed(2)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Utilizado</span>
              <span className="font-medium">{percentageUsed.toFixed(1)}%</span>
            </div>
            <Progress value={percentageUsed} className="h-3" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center p-3 bg-emerald-500/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Disponível</p>
              <p className="text-lg font-bold text-emerald-600">
                R$ {(totalBudget - totalSpent).toFixed(2)}
              </p>
            </div>
            <div className="text-center p-3 bg-blue-500/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Economia</p>
              <p className="text-lg font-bold text-blue-600">
                {((1 - percentageUsed / 100) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category, index) => {
          const percentage = (category.spent / category.budget) * 100
          const isOverBudget = percentage > 100

          return (
            <Card
              key={category.id}
              className="animate-scale-in hover:shadow-lg transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: `${index * 50 + 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${category.bgColor}/10 group-hover:scale-110 transition-transform`}>
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Transações</p>
                    <p className="text-sm font-semibold">{category.transactions}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Orçamento: R$ {category.budget.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isOverBudget ? 'text-red-600 font-semibold' : 'text-foreground'}>
                      R$ {category.spent.toFixed(2)}
                    </span>
                    <span className={`font-medium ${
                      percentage > 80 ? 'text-red-600' :
                      percentage > 60 ? 'text-orange-600' :
                      'text-muted-foreground'
                    }`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className={`h-2 ${isOverBudget ? '[&>div]:bg-red-600' : ''}`}
                  />
                </div>

                {isOverBudget && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-xs text-red-600 font-medium">
                      Orçamento excedido em R$ {(category.spent - category.budget).toFixed(2)}
                    </p>
                  </div>
                )}

                {!isOverBudget && (
                  <div className="bg-secondary rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">
                      Restam R$ {(category.budget - category.spent).toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
