'use client';

import { useState, useCallback } from 'react';

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export interface PaymentError {
  code: string;
  message: string;
  timestamp: number;
  retryable: boolean;
}

export interface PaymentState {
  status: PaymentStatus;
  error: PaymentError | null;
  retryCount: number;
  lastAttempt: number | null;
}

interface UsePaymentStateReturn extends PaymentState {
  setProcessing: () => void;
  setSuccess: () => void;
  setError: (code: string, message: string, retryable?: boolean) => void;
  clearError: () => void;
  reset: () => void;
  canRetry: () => boolean;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

export function usePaymentState(): UsePaymentStateReturn {
  const [state, setState] = useState<PaymentState>({
    status: 'idle',
    error: null,
    retryCount: 0,
    lastAttempt: null,
  });

  const setProcessing = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'processing',
      lastAttempt: Date.now(),
    }));
  }, []);

  const setSuccess = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'success',
      error: null,
      retryCount: 0,
    }));
  }, []);

  const setError = useCallback(
    (code: string, message: string, retryable = true) => {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: {
          code,
          message,
          timestamp: Date.now(),
          retryable,
        },
        retryCount: prev.retryCount + 1,
      }));
    },
    [],
  );

  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      status: 'idle',
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      error: null,
      retryCount: 0,
      lastAttempt: null,
    });
  }, []);

  const canRetry = useCallback(() => {
    return state.error?.retryable && state.retryCount < MAX_RETRIES;
  }, [state.error?.retryable, state.retryCount]);

  return {
    ...state,
    setProcessing,
    setSuccess,
    setError,
    clearError,
    reset,
    canRetry,
  };
}
