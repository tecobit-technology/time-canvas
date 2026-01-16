import { useState, useCallback } from 'react';
import type { ViewType } from '@/types/calendar';

export interface NavigationState {
  view: ViewType;
  date?: Date;
}

/**
 * Hook to manage hierarchical navigation history for mobile.
 * Tracks the path: Year → Month → Week → Day
 * Allows contextual back navigation to previous hierarchy level.
 */
export function useNavigationHistory(initialView: ViewType = 'month') {
  const [history, setHistory] = useState<NavigationState[]>([{ view: initialView }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get the current navigation state
  const current = history[currentIndex];

  // Check if we can go back (have history to pop)
  const canGoBack = currentIndex > 0;

  // Get the parent view in the hierarchy
  const getParentView = useCallback((view: ViewType): ViewType | null => {
    switch (view) {
      case 'day':
        return 'month'; // Day goes back to Month (or Week if came from Week)
      case 'week':
        return 'month';
      case 'month':
        return null; // Month is a root view unless came from Year
      case 'year':
        return null; // Year is a root view
      default:
        return null;
    }
  }, []);

  // Push a new view onto the stack
  const pushView = useCallback((view: ViewType, date?: Date) => {
    setHistory(prev => {
      // Trim any forward history and add new state
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ view, date });
      return newHistory;
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  // Navigate to a view, tracking if it's a hierarchical navigation
  const navigateTo = useCallback((
    newView: ViewType, 
    fromView: ViewType,
    date?: Date
  ) => {
    // Define hierarchy: year > month > week > day
    const hierarchy: Record<ViewType, number> = {
      'year': 0,
      'month': 1,
      'week': 2,
      'day': 3,
    };

    // If going deeper in hierarchy, push to stack
    if (hierarchy[newView] > hierarchy[fromView]) {
      pushView(newView, date);
    } else {
      // If going lateral (e.g., via bottom nav) or up, reset stack
      setHistory([{ view: newView, date }]);
      setCurrentIndex(0);
    }
  }, [pushView]);

  // Go back one level in the hierarchy
  const goBack = useCallback((): NavigationState | null => {
    if (!canGoBack) return null;

    const previousState = history[currentIndex - 1];
    setCurrentIndex(prev => prev - 1);
    return previousState;
  }, [canGoBack, currentIndex, history]);

  // Reset the navigation stack (e.g., when using bottom navigation)
  const resetStack = useCallback((view: ViewType, date?: Date) => {
    setHistory([{ view, date }]);
    setCurrentIndex(0);
  }, []);

  // Get the previous view for back button labeling
  const getPreviousView = useCallback((): ViewType | null => {
    if (!canGoBack) return null;
    return history[currentIndex - 1].view;
  }, [canGoBack, currentIndex, history]);

  return {
    current,
    canGoBack,
    pushView,
    navigateTo,
    goBack,
    resetStack,
    getParentView,
    getPreviousView,
  };
}
