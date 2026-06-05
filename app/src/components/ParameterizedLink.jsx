'use client';

import { useQueryParams } from '@/lib/useQueryParams';

/**
 * ParameterizedLink Component
 * Automatically appends captured query parameters to any link
 * 
 * Usage:
 * <ParameterizedLink href="https://external-service.com/page">
 *   Open Service
 * </ParameterizedLink>
 */
export default function ParameterizedLink({ 
  href, 
  children, 
  onClick,
  target = '_blank',
  rel = 'noopener noreferrer',
  className,
  ...props 
}) {
  const { buildUrl } = useQueryParams();
  const urlWithParams = buildUrl(href);

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={urlWithParams}
      target={target}
      rel={rel}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
