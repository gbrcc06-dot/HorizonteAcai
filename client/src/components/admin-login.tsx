import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (onLogin(password)) {
      setPassword("");
    } else {
      setError("Senha incorreta");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <Card className="bg-white/10 border-white/20 backdrop-blur-md p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 p-3 rounded-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center mb-2">Painel Admin</h1>
        <p className="text-white/60 text-center mb-6 text-sm">Digite a senha para acessar</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
              autoFocus
              data-testid="input-admin-password"
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-white text-black hover:bg-white/90 font-semibold"
            data-testid="button-admin-login"
          >
            {isLoading ? "Verificando..." : "Entrar"}
          </Button>
        </form>

        <p className="text-white/40 text-xs text-center mt-6">
          Acesso restrito ao administrador
        </p>
      </Card>
    </div>
  );
}
