import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OnboardingPulseProps {
  targetSelector: string;
  isActive: boolean;
  intensity?: 'subtle' | 'normal' | 'strong';
}

export function OnboardingPulse({ 
  targetSelector, 
  isActive, 
  intensity = 'subtle' 
}: OnboardingPulseProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      const element = document.querySelector(targetSelector);
      if (element) {
        setRect(element.getBoundingClientRect());
      }
    };

    // Delay inicial para garantir que o elemento está renderizado
    const timer = setTimeout(updateRect, 100);

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    // Observer para mudanças no DOM
    const observer = new MutationObserver(updateRect);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
      observer.disconnect();
    };
  }, [targetSelector, isActive]);

  if (!isActive || !rect) return null;

  const intensityClasses = {
    subtle: 'animate-pulse-subtle',
    normal: 'animate-pulse-normal',
    strong: 'animate-pulse-strong'
  };

  return (
    <div
      className={cn(
        "fixed pointer-events-none z-40 rounded-lg border-2 border-green-500",
        intensityClasses[intensity]
      )}
      style={{
        top: rect.top - 4,
        left: rect.left - 4,
        width: rect.width + 8,
        height: rect.height + 8,
      }}
    />
  );
}
