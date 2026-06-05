'use client';

import { useEffect } from 'react';
import { saveQueryParams } from '@/lib/queryParams';

/**
 * Client component to capture query parameters from APECSPACE webview
 * This component should be used in the main layout
 */
export default function QueryParamsCapture() {
  useEffect(() => {
    // Capture and save query params on client side
    saveQueryParams();
  }, []);

  return null; // This component doesn't render anything
}
