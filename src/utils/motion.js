// Motion wrapper to handle Framer Motion compatibility issues
import React, { lazy, Suspense } from 'react';

// Lazy load motion components to avoid SSR/hydration issues
const motion = {
  div: React.forwardRef((props, ref) => {
    const [MotionDiv, setMotionDiv] = React.useState(null);
    
    React.useEffect(() => {
      import('framer-motion').then(({ motion }) => {
        setMotionDiv(() => motion.div);
      });
    }, []);

    if (!MotionDiv) {
      // Fallback to regular div while loading
      return <div {...props} ref={ref} />;
    }

    return <MotionDiv {...props} ref={ref} />;
  }),

  section: React.forwardRef((props, ref) => {
    const [MotionSection, setMotionSection] = React.useState(null);
    
    React.useEffect(() => {
      import('framer-motion').then(({ motion }) => {
        setMotionSection(() => motion.section);
      });
    }, []);

    if (!MotionSection) {
      return <section {...props} ref={ref} />;
    }

    return <MotionSection {...props} ref={ref} />;
  }),

  h1: React.forwardRef((props, ref) => {
    const [MotionH1, setMotionH1] = React.useState(null);
    
    React.useEffect(() => {
      import('framer-motion').then(({ motion }) => {
        setMotionH1(() => motion.h1);
      });
    }, []);

    if (!MotionH1) {
      return <h1 {...props} ref={ref} />;
    }

    return <MotionH1 {...props} ref={ref} />;
  }),

  p: React.forwardRef((props, ref) => {
    const [MotionP, setMotionP] = React.useState(null);
    
    React.useEffect(() => {
      import('framer-motion').then(({ motion }) => {
        setMotionP(() => motion.p);
      });
    }, []);

    if (!MotionP) {
      return <p {...props} ref={ref} />;
    }

    return <MotionP {...props} ref={ref} />;
  })
};

// Export motion components
export { motion };

// Export other framer-motion utilities with lazy loading
export const useMotionValue = (...args) => {
  const [hook, setHook] = React.useState(() => () => null);
  
  React.useEffect(() => {
    import('framer-motion').then(({ useMotionValue }) => {
      setHook(() => useMotionValue);
    });
  }, []);

  return hook(...args);
};

export const useScroll = (...args) => {
  const [hook, setHook] = React.useState(() => () => ({}));
  
  React.useEffect(() => {
    import('framer-motion').then(({ useScroll }) => {
      setHook(() => useScroll);
    });
  }, []);

  return hook(...args);
};

export const useTransform = (...args) => {
  const [hook, setHook] = React.useState(() => () => null);
  
  React.useEffect(() => {
    import('framer-motion').then(({ useTransform }) => {
      setHook(() => useTransform);
    });
  }, []);

  return hook(...args);
};