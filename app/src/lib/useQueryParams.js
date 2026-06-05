'use client';

import { useEffect, useState } from 'react';
import { getQueryParams, buildUrlWithParams, getQueryString } from '@/lib/queryParams';

/**
 * Hook to use captured query parameters in components
 * @returns {object} - { code, phone, zalo_id, queryString, buildUrl }
 */
export function useQueryParams() {
  const [params, setParams] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedParams = getQueryParams();
    setParams(savedParams);
    setIsLoading(false);
  }, []);

  return {
    code: params?.code || '',
    phone: params?.phone || '',
    zalo_id: params?.zalo_id || '',
    params: params,
    queryString: getQueryString(),
    buildUrl: buildUrlWithParams,
    isLoading
  };
}
