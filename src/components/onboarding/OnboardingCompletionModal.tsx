import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle2, 
  PartyPopper, 
  LayoutDashboard, 
  Package, 
  Receipt, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingCompletionModalProps {
  open: boolean;
  onClose: () => void;
  userName?: string;
}

const unlockedFeatures = [
  { icon: LayoutDashboard, name: 'Dashboard', description: 'Visão geral do seu negócio' },
  { icon: Package, name: 'Estoque', description: 'Controle de materiais' },
  { icon: Receipt, name: 'Transações', description: 'Histórico completo' },
  { icon: TrendingUp, name: 'Fluxo Diário', description: 'Análise financeira' },
];

export function OnboardingCompletionModal({ open, onClose, userName }: OnboardingCompletionModalProps) {
  const navigate = useNavigate();

  const handleExplore = () => {
    onClose();
    navigate('/dashboard');
  };

  const handleContinue = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-800 text-white p-0 overflow-hidden">
        {/* Header com celebração */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 p-8 text-center relative overflow-hidden">
          {/* Confetes animados */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#fbbf24', '#f472b6', '#60a5fa', '#34d399'][i % 4],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <PartyPopper className="w-10 h-10 text-white" />
              </div>
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-white">
                Parabéns{userName ? `, ${userName.split(' ')[0]}` : ''}! 🎉
              </DialogTitle>
            </DialogHeader>
            <p className="text-green-100 mt-2 text-lg">
              Você configurou tudo com sucesso!
            </p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Checklist de conquistas */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Configurações Completas
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {['Empresa configurada', 'Materiais cadastrados', 'Primeiro caixa aberto'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features desbloqueadas */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Funcionalidades Desbloqueadas
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {unlockedFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={feature.name}
                    className="bg-gray-800/50 border-gray-700 p-3 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{feature.name}</p>
                      <p className="text-xs text-gray-500">{feature.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Dica */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              💡 <strong>Dica:</strong> Acesse o <strong>Guia Completo</strong> no menu para aprender mais sobre cada funcionalidade.
            </p>
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleExplore}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-6 text-lg"
            >
              EXPLORAR DASHBOARD
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              onClick={handleContinue}
              variant="ghost" 
              className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
            >
              Continuar operando
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
