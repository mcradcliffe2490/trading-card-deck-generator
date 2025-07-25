import { useState, useCallback } from 'react'
import { ToastMessage } from '../components/Toast'

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration || 5000
    }
    
    setToasts(prev => [...prev, newToast])
    
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods for different toast types
  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ type: 'success', title, message, duration })
  }, [addToast])

  const showError = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ type: 'error', title, message, duration: duration || 8000 }) // Errors stay longer
  }, [addToast])

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ type: 'warning', title, message, duration })
  }, [addToast])

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ type: 'info', title, message, duration })
  }, [addToast])

  // Special method for API credit errors
  const showCreditError = useCallback(() => {
    return addToast({
      type: 'error',
      title: 'API Credits Exhausted',
      message: 'The Claude API has run out of credits. Please check your Anthropic account and add more credits to continue generating decks.',
      duration: 10000 // Show for 10 seconds
    })
  }, [addToast])

  // Helper to parse API errors and show appropriate toasts
  const handleApiError = useCallback((error: any, defaultTitle: string = 'Request Failed') => {
    console.error('API Error:', error)
    
    // Check for specific error patterns
    if (error.message?.includes('credits') || error.message?.includes('quota') || error.message?.includes('limit')) {
      return showCreditError()
    }
    
    if (error.message?.includes('rate limit') || error.status === 429) {
      return showError(
        'Rate Limited', 
        'Too many requests. Please wait a moment before trying again.',
        6000
      )
    }
    
    if (error.status === 401 || error.message?.includes('unauthorized')) {
      return showError(
        'Authentication Error',
        'Invalid API key. Please check your configuration.',
        8000
      )
    }
    
    if (error.status === 500 || error.message?.includes('server error')) {
      return showError(
        'Server Error',
        'The API server encountered an error. Please try again in a few minutes.',
        6000
      )
    }
    
    // Generic error
    const message = error.message || error.details || 'An unexpected error occurred. Please try again.'
    return showError(defaultTitle, message)
  }, [showError, showCreditError])

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCreditError,
    handleApiError
  }
}