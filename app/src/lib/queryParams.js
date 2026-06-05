/**
 * Query Parameters Manager
 * Manages capturing and passing query parameters from APECSPACE webview
 */

// Store query params in localStorage
export const saveQueryParams = () => {
  if (typeof window === 'undefined') return;
  
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const phone = params.get('phone');
  const zalo_id = params.get('zalo_id');
  
  if (code || phone || zalo_id) {
    const savedParams = {
      code: code || '',
      phone: phone || '',
      zalo_id: zalo_id || '',
      timestamp: new Date().getTime()
    };
    
    try {
      localStorage.setItem('apecspaceParams', JSON.stringify(savedParams));
      console.log('Query params saved:', savedParams);
    } catch (error) {
      console.error('Error saving query params:', error);
    }
  }
};

// Get saved query params
export const getQueryParams = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const params = localStorage.getItem('apecspaceParams');
    return params ? JSON.parse(params) : null;
  } catch (error) {
    console.error('Error getting query params:', error);
    return null;
  }
};

// Build URL with query parameters
export const buildUrlWithParams = (baseUrl) => {
  const params = getQueryParams();
  if (!params) return baseUrl;
  
  const url = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  
  if (params.code) url.searchParams.append('code', params.code);
  if (params.phone) url.searchParams.append('phone', params.phone);
  if (params.zalo_id) url.searchParams.append('zalo_id', params.zalo_id);
  
  return url.toString();
};

// Get query string only
export const getQueryString = () => {
  const params = getQueryParams();
  if (!params) return '';
  
  const parts = [];
  if (params.code) parts.push(`code=${encodeURIComponent(params.code)}`);
  if (params.phone) parts.push(`phone=${encodeURIComponent(params.phone)}`);
  if (params.zalo_id) parts.push(`zalo_id=${encodeURIComponent(params.zalo_id)}`);
  
  return parts.length > 0 ? '?' + parts.join('&') : '';
};

// Clear saved params
export const clearQueryParams = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('apecspaceParams');
  } catch (error) {
    console.error('Error clearing query params:', error);
  }
};
