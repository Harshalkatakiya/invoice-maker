import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Helper: Check if the value is strictly a number
const isStrictlyNumber = (input: string | number): boolean =>
  typeof input === 'number' || /^-?\d+(\.\d+)?$/.test(input);

// Extend Tailwind Merge for Custom Rules
const customTwMerge = extendTailwindMerge({
  cacheSize: 1000, // Increase cache size for better performance in large apps
  extend: {
    classGroups: {
      // Add support for font sizes
      'font-size': [
        { text: [(value: string | number) => isStrictlyNumber(value)] }
      ]
    }
  }
});

// Enhanced Utility Function for Class Merging
const cn = (...inputs: ClassValue[]) => {
  // Merge classes with clsx and customTailwindMerge
  return customTwMerge(clsx(inputs));
};

// Additional Helper Functions
/**
 * Dynamically apply responsive or variant classes
 * @param baseClass - The base class to apply
 * @param variants - An object where keys are variants (e.g., "hover", "sm") and values are classes
 */
const withVariants = (
  baseClass: string,
  variants: Record<string, ClassValue>
) => {
  const variantClasses = Object.entries(variants)
    .map(([key, value]) => `${key}:${value}`)
    .join(' ');
  return cn(baseClass, variantClasses);
};

/**
 * Dynamically apply classes based on conditions
 * @param classes - An object where keys are classes and values are booleans
 */
const conditionalClasses = (classes: Record<string, boolean>) => {
  return cn(
    ...Object.entries(classes)
      .filter(([, condition]) => condition)
      .map(([className]) => className)
  );
};

export { cn, conditionalClasses, withVariants };
