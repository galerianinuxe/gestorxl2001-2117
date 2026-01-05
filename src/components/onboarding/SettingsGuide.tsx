import React, { useState, useEffect, useMemo } from 'react';
import { useOnboarding, STEP_SUB_STEPS } from '@/contexts/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OnboardingPulse } from './OnboardingPulse';
import { OnboardingHint } from './OnboardingHint';

interface SettingsGuideProps {
  settings: {
    logo: string | null;
    whatsapp1: string;
    address: string;
  };
  onStepComplete?: () => void;
}

export function SettingsGuide({ settings, onStepComplete }: SettingsGuideProps) {
  const { 
    progress, 
    isOnboardingActive, 
    completeSubStep, 
    isSubStepCompleted, 
    completeStep,
    getSubStepProgress
  } = useOnboarding();
  const navigate = useNavigate();
  
  const [activeSubStep, setActiveSubStep] = useState<string | null>(null);

  const subSteps = STEP_SUB_STEPS[1] || [];

  // Determinar qual sub-passo deve estar ativo
  const currentActiveSubStep = useMemo(() => {
    if (!isOnboardingActive || progress.currentStep !== 1) return null;

    for (const subStep of subSteps) {
      if (!isSubStepCompleted(1, subStep.id)) {
        return subStep;
      }
    }
    return null;
  }, [isOnboardingActive, progress.currentStep, subSteps, isSubStepCompleted]);

  useEffect(() => {
    if (currentActiveSubStep) {
      setActiveSubStep(currentActiveSubStep.id);
    } else {
      setActiveSubStep(null);
    }
  }, [currentActiveSubStep]);

  // Detectar preenchimento automático dos campos
  useEffect(() => {
    if (!isOnboardingActive || progress.currentStep !== 1) return;

    // Logo preenchido
    if (settings.logo && !isSubStepCompleted(1, 'logo')) {
      completeSubStep(1, 'logo');
    }

    // WhatsApp preenchido (pelo menos 10 caracteres)
    if (settings.whatsapp1 && settings.whatsapp1.length >= 10 && !isSubStepCompleted(1, 'whatsapp1')) {
      completeSubStep(1, 'whatsapp1');
    }

    // Endereço preenchido (pelo menos 10 caracteres)
    if (settings.address && settings.address.length >= 10 && !isSubStepCompleted(1, 'address')) {
      completeSubStep(1, 'address');
    }
  }, [settings, isOnboardingActive, progress.currentStep, completeSubStep, isSubStepCompleted]);

  // Verificar se todos os sub-passos obrigatórios foram completados
  useEffect(() => {
    if (!isOnboardingActive || progress.currentStep !== 1) return;

    const requiredSubSteps = ['logo', 'whatsapp1', 'address'];
    const allCompleted = requiredSubSteps.every(id => isSubStepCompleted(1, id));

    if (allCompleted && !isSubStepCompleted(1, 'receipt')) {
      // Marcar receipt como opcional completado
      completeSubStep(1, 'receipt');
    }
  }, [isOnboardingActive, progress.currentStep, isSubStepCompleted, completeSubStep]);

  // Handler para quando salvar é clicado
  const handleSaveComplete = async () => {
    if (!isOnboardingActive || progress.currentStep !== 1) return;

    // Marcar save como completado
    await completeSubStep(1, 'save');
    
    // Completar o passo 1
    await completeStep(1);

    toast.success('Configurações salvas!', {
      description: 'Agora vamos cadastrar seus materiais.'
    });

    onStepComplete?.();
  };

  if (!isOnboardingActive || progress.currentStep !== 1) return null;

  const activeSubStepData = subSteps.find(s => s.id === activeSubStep);

  return (
    <>
      {/* Pulse effect no elemento ativo */}
      {activeSubStepData && (
        <>
          <OnboardingPulse
            targetSelector={activeSubStepData.selector}
            isActive={true}
            intensity="subtle"
          />
          <OnboardingHint
            targetSelector={activeSubStepData.selector}
            message={activeSubStepData.hint}
            isActive={true}
            position={
              activeSubStepData.id === 'save' ? 'top' : 
              activeSubStepData.id === 'receipt' ? 'left' : 'right'
            }
          />
        </>
      )}
    </>
  );
}

// Export a hook for Settings page to use
export function useSettingsGuide() {
  const { isOnboardingActive, progress, completeSubStep, completeStep, isSubStepCompleted } = useOnboarding();

  const handleSaveWithOnboarding = async (saveFunction: () => Promise<void>) => {
    await saveFunction();

    if (isOnboardingActive && progress.currentStep === 1) {
      await completeSubStep(1, 'save');
      await completeStep(1);
    }
  };

  return {
    handleSaveWithOnboarding,
    isOnboardingActive,
    currentStep: progress.currentStep
  };
}
