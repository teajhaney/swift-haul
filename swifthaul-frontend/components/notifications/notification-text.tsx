'use client';

import React from 'react';

interface NotificationTextProps {
  text: string;
}

/**
 * Renders notification body text with basic formatting support.
 * Correctly handles nested patterns using a recursive-like approach.
 */
export function NotificationText({ text }: NotificationTextProps) {
  // Step 1: Split by bold pattern **...**
  const boldParts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <span className="leading-relaxed">
      {boldParts.map((boldPart, i) => {
        const isBold = boldPart.startsWith('**') && boldPart.endsWith('**');
        const content = isBold ? boldPart.substring(2, boldPart.length - 2) : boldPart;

        // Step 2: For each part (bold or normal), split by reference pattern {ref}
        const refParts = content.split(/(\{.*?\})/g);

        const renderedContent = refParts.map((refPart, j) => {
          if (refPart.startsWith('{') && refPart.endsWith('}')) {
            const refContent = refPart.substring(1, refPart.length - 1);
            return (
              <code
                key={`${i}-${j}`}
                className="mx-0.5 px-1 rounded bg-surface-elevated font-mono text-primary-light font-semibold text-[13px]"
              >
                {refContent}
              </code>
            );
          }
          return <React.Fragment key={`${i}-${j}`}>{refPart}</React.Fragment>;
        });

        if (isBold) {
          return (
            <strong key={i} className="font-bold text-text-primary">
              {renderedContent}
            </strong>
          );
        }

        return <React.Fragment key={i}>{renderedContent}</React.Fragment>;
      })}
    </span>
  );
}
