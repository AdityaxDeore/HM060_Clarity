"use client";

import { useState, useEffect, useCallback } from 'react';

const ONBOARDING_KEY = 'neuroflow_onboarded';

export function useOnboarding() {
  const [isOnboarded, setIsOnboarded] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(ONBOARDING_KEY);
      setIsOnboarded(item === 'true');
    } catch (error) {
      console.warn('Error reading from localStorage', error);
      setIsOnboarded(false);
    }
  }, []);

  const completeOnboarding = useCallback(() => {
    try {
      window.localStorage.setItem(ONBOARDING_KEY, 'true');
      setIsOnboarded(true);
    } catch (error) {
      console.warn('Error writing to localStorage', error);
    }
  }, []);

  return { isOnboarded, completeOnboarding };
}
