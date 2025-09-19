// Image optimization utilities

export const IMAGE_DEFAULTS = {
  quality: 85,
  format: 'webp',
  sizes: {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200,
    xlarge: 1920
  }
};

// Generate responsive image srcSet
export const generateSrcSet = (baseUrl, sizes = ['small', 'medium', 'large']) => {
  return sizes
    .map(size => `${baseUrl}?w=${IMAGE_DEFAULTS.sizes[size]}&q=${IMAGE_DEFAULTS.quality} ${IMAGE_DEFAULTS.sizes[size]}w`)
    .join(', ');
};

// Generate sizes attribute for responsive images
export const generateSizes = (breakpoints = {
  mobile: '100vw',
  tablet: '50vw',
  desktop: '33vw'
}) => {
  return `(max-width: 768px) ${breakpoints.mobile}, (max-width: 1024px) ${breakpoints.tablet}, ${breakpoints.desktop}`;
};

// Lazy loading image component with SEO optimization
import React, { useState, useRef, useEffect } from 'react';

export const SEOImage = ({ 
  src, 
  alt, 
  title, 
  width, 
  height, 
  className = '',
  lazy = true,
  priority = false,
  sizes,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef();

  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [lazy]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          title={title}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes={sizes}
          {...props}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

// Generate optimized image URLs (for services like Cloudinary, ImageKit, etc.)
export const getOptimizedImageUrl = (baseUrl, options = {}) => {
  const {
    width,
    height,
    quality = IMAGE_DEFAULTS.quality,
    format = IMAGE_DEFAULTS.format,
    fit = 'cover'
  } = options;

  // This is a generic implementation - adapt for your image service
  const params = new URLSearchParams();
  
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (quality) params.append('q', quality);
  if (format) params.append('f', format);
  if (fit) params.append('fit', fit);

  return `${baseUrl}?${params.toString()}`;
};

// Preload critical images
export const preloadImage = (src) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

// Generate WebP fallback for older browsers
export const generateWebPFallback = (src) => {
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  return {
    webp: webpSrc,
    fallback: src
  };
};