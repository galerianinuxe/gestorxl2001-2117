import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  pageVisits: Record<string, boolean>;
  featureUnlocks: string[];
  startedAt: string | null;
  completedAt: string | null;
}

interface OnboardingContextType {
  // Estado
  progress: OnboardingProgress;
  isOnboardingActive: boolean;
  isLoading: boolean;
  
  // Ações
  startOnboarding: () => Promise<void>;
  completeStep: (step: number) => Promise<void>;
  skipOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  markPageVisited: (page: string) => Promise<void>;
  unlockFeature: (feature: string) => Promise<void>;
  
  // Helpers
  isStepCompleted: (step: number) => boolean;
  isFeatureUnlocked: (feature: string) => boolean;
  hasVisitedPage: (page: string) => boolean;
  getUnlockedFeatures: () => string[];
}

const defaultProgress: OnboardingProgress = {
  currentStep: 0,
  completedSteps: [],
  pageVisits: {},
  featureUnlocks: [],
  startedAt: null,
  completedAt: null
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Mapeamento de etapas para features desbloqueadas
export const STEP_FEATURE_MAP: Record<number, string[]> = {
  0: ['home', 'settings', 'guia-completo'],
  1: ['materials'], // Após configurar empresa
  2: ['dashboard', 'estoque'], // Após cadastrar materiais
  3: ['transacoes', 'pedidos-compra', 'pedidos-venda', 'fluxo-diario'], // Após primeira operação
};

// Nomes das etapas
export const ONBOARDING_STEPS = [
  { id: 0, name: 'Início', description: 'Bem-vindo ao XLata' },
  { id: 1, name: 'Configurar Empresa', description: 'Logo, WhatsApp e endereço' },
  { id: 2, name: 'Cadastrar Materiais', description: 'Preços de compra e venda' },
  { id: 3, name: 'Abrir Caixa', description: 'Primeira operação' },
];

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress>(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // Carregar progresso do banco
  useEffect(() => {
    if (user) {
      loadProgress();
    } else {
      setProgress(defaultProgress);
      setIsLoading(false);
    }
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_progress, onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        const progressData = data.onboarding_progress as unknown as OnboardingProgress | null;
        setProgress(progressData || defaultProgress);
        setOnboardingCompleted(data.onboarding_completed || false);
      }
    } catch (error) {
      console.error('Erro ao carregar progresso do onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (newProgress: OnboardingProgress, completed?: boolean) => {
    if (!user) return;

    try {
      const updateData: Record<string, unknown> = {
        onboarding_progress: newProgress
      };
      
      if (completed !== undefined) {
        updateData.onboarding_completed = completed;
      }

      await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      setProgress(newProgress);
      if (completed !== undefined) {
        setOnboardingCompleted(completed);
      }
    } catch (error) {
      console.error('Erro ao salvar progresso do onboarding:', error);
    }
  };

  const startOnboarding = useCallback(async () => {
    const newProgress: OnboardingProgress = {
      ...defaultProgress,
      currentStep: 1,
      startedAt: new Date().toISOString(),
      featureUnlocks: STEP_FEATURE_MAP[0] || []
    };
    await saveProgress(newProgress);
  }, [user]);

  const completeStep = useCallback(async (step: number) => {
    const newCompletedSteps = [...progress.completedSteps];
    if (!newCompletedSteps.includes(step)) {
      newCompletedSteps.push(step);
    }

    // Desbloquear features da próxima etapa
    const newUnlocks = [...progress.featureUnlocks];
    const stepFeatures = STEP_FEATURE_MAP[step] || [];
    stepFeatures.forEach(feature => {
      if (!newUnlocks.includes(feature)) {
        newUnlocks.push(feature);
      }
    });

    const nextStep = step + 1;
    const isComplete = nextStep > 3;

    const newProgress: OnboardingProgress = {
      ...progress,
      currentStep: isComplete ? 3 : nextStep,
      completedSteps: newCompletedSteps,
      featureUnlocks: newUnlocks,
      completedAt: isComplete ? new Date().toISOString() : null
    };

    await saveProgress(newProgress, isComplete);
  }, [progress, user]);

  const skipOnboarding = useCallback(async () => {
    // Desbloquear todas as features
    const allFeatures = Object.values(STEP_FEATURE_MAP).flat();
    
    const newProgress: OnboardingProgress = {
      ...progress,
      currentStep: 3,
      completedSteps: [1, 2, 3],
      featureUnlocks: allFeatures,
      completedAt: new Date().toISOString()
    };

    await saveProgress(newProgress, true);
  }, [progress, user]);

  const resetOnboarding = useCallback(async () => {
    await saveProgress(defaultProgress, false);
  }, [user]);

  const markPageVisited = useCallback(async (page: string) => {
    if (progress.pageVisits[page]) return;

    const newProgress: OnboardingProgress = {
      ...progress,
      pageVisits: {
        ...progress.pageVisits,
        [page]: true
      }
    };

    await saveProgress(newProgress);
  }, [progress, user]);

  const unlockFeature = useCallback(async (feature: string) => {
    if (progress.featureUnlocks.includes(feature)) return;

    const newProgress: OnboardingProgress = {
      ...progress,
      featureUnlocks: [...progress.featureUnlocks, feature]
    };

    await saveProgress(newProgress);
  }, [progress, user]);

  const isStepCompleted = useCallback((step: number) => {
    return progress.completedSteps.includes(step);
  }, [progress.completedSteps]);

  const isFeatureUnlocked = useCallback((feature: string) => {
    // Se onboarding completo, todas as features estão desbloqueadas
    if (onboardingCompleted) return true;
    // Se ainda não iniciou onboarding, apenas features iniciais
    if (progress.currentStep === 0) {
      return STEP_FEATURE_MAP[0]?.includes(feature) || false;
    }
    return progress.featureUnlocks.includes(feature);
  }, [progress.featureUnlocks, progress.currentStep, onboardingCompleted]);

  const hasVisitedPage = useCallback((page: string) => {
    return progress.pageVisits[page] || false;
  }, [progress.pageVisits]);

  const getUnlockedFeatures = useCallback(() => {
    if (onboardingCompleted) {
      return Object.values(STEP_FEATURE_MAP).flat();
    }
    return progress.featureUnlocks;
  }, [progress.featureUnlocks, onboardingCompleted]);

  const isOnboardingActive = useMemo(() => {
    return !onboardingCompleted && progress.currentStep > 0;
  }, [onboardingCompleted, progress.currentStep]);

  const value = useMemo(() => ({
    progress,
    isOnboardingActive,
    isLoading,
    startOnboarding,
    completeStep,
    skipOnboarding,
    resetOnboarding,
    markPageVisited,
    unlockFeature,
    isStepCompleted,
    isFeatureUnlocked,
    hasVisitedPage,
    getUnlockedFeatures
  }), [
    progress,
    isOnboardingActive,
    isLoading,
    startOnboarding,
    completeStep,
    skipOnboarding,
    resetOnboarding,
    markPageVisited,
    unlockFeature,
    isStepCompleted,
    isFeatureUnlocked,
    hasVisitedPage,
    getUnlockedFeatures
  ]);

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
