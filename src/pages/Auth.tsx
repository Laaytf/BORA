import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Auth() {
  const { signIn } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Estado para login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(loginEmail, loginPassword)

    if (error) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta!',
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-2xl mb-4 animate-scale-in">
            <Wallet className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold">FinanceControl</h1>
          <p className="text-muted-foreground mt-2">Controle suas finanças de forma simples</p>
        </div>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="font-heading">Bem-vindo!</CardTitle>
            <CardDescription>Entre na sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
