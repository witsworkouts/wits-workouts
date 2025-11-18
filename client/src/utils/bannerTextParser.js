import React from 'react';

/**
 * Parses banner text with markdown-like syntax for formatting individual words
 * Syntax:
 * - **text** for bold
 * - *text* for italic  
 * - __text__ for underline
 * 
 * You can combine formats: **bold *italic* text** or __underline *italic* text__
 */
export const parseBannerText = (text, baseStyle = {}) => {
  if (!text) return null;

  let keyCounter = 0;
  const getKey = () => `banner-text-${keyCounter++}`;

  // Process text and convert formatting markers to React elements
  const processText = (str, inheritedStyle = {}) => {
    const style = { ...baseStyle, ...inheritedStyle };
    const results = [];
    let i = 0;
    let lastPlainTextStart = 0;

    while (i < str.length) {
      let foundFormatting = false;

      // Check for **bold** (must check before single *)
      if (i + 1 < str.length && str[i] === '*' && str[i + 1] === '*') {
        const endIndex = str.indexOf('**', i + 2);
        if (endIndex !== -1) {
          foundFormatting = true;
          // Add plain text before bold
          if (i > lastPlainTextStart) {
            results.push(
              <span key={getKey()} style={style}>
                {str.substring(lastPlainTextStart, i)}
              </span>
            );
          }
          // Process bold content (may contain nested formatting)
          const boldContent = str.substring(i + 2, endIndex);
          const boldStyle = { ...style, fontWeight: '700' };
          const nestedResults = processText(boldContent, boldStyle);
          results.push(
            <span key={getKey()} style={boldStyle}>
              {nestedResults}
            </span>
          );
          // Move past the bold formatting
          i = endIndex + 2;
          lastPlainTextStart = i;
          continue;
        }
      }

      // Check for __underline__
      if (i + 1 < str.length && str[i] === '_' && str[i + 1] === '_') {
        const endIndex = str.indexOf('__', i + 2);
        if (endIndex !== -1) {
          foundFormatting = true;
          // Add plain text before underline
          if (i > lastPlainTextStart) {
            results.push(
              <span key={getKey()} style={style}>
                {str.substring(lastPlainTextStart, i)}
              </span>
            );
          }
          // Process underline content
          const underlineContent = str.substring(i + 2, endIndex);
          const underlineStyle = { ...style, textDecoration: 'underline' };
          const nestedResults = processText(underlineContent, underlineStyle);
          results.push(
            <span key={getKey()} style={underlineStyle}>
              {nestedResults}
            </span>
          );
          // Move past the underline formatting
          i = endIndex + 2;
          lastPlainTextStart = i;
          continue;
        }
      }

      // Check for *italic* (only if not part of **)
      if (str[i] === '*' && (i + 1 >= str.length || str[i + 1] !== '*')) {
        const endIndex = str.indexOf('*', i + 1);
        if (endIndex !== -1) {
          foundFormatting = true;
          // Add plain text before italic
          if (i > lastPlainTextStart) {
            results.push(
              <span key={getKey()} style={style}>
                {str.substring(lastPlainTextStart, i)}
              </span>
            );
          }
          // Process italic content
          const italicContent = str.substring(i + 1, endIndex);
          const italicStyle = { ...style, fontStyle: 'italic' };
          const nestedResults = processText(italicContent, italicStyle);
          results.push(
            <span key={getKey()} style={italicStyle}>
              {nestedResults}
            </span>
          );
          // Move past the italic formatting
          i = endIndex + 1;
          lastPlainTextStart = i;
          continue;
        }
      }

      i++;
    }

    // Add any remaining plain text
    if (lastPlainTextStart < str.length) {
      results.push(
        <span key={getKey()} style={style}>
          {str.substring(lastPlainTextStart)}
        </span>
      );
    }

    // If no formatting was found, return plain text
    if (results.length === 0) {
      return <span key={getKey()} style={style}>{str}</span>;
    }

    return results;
  };

  const parsed = processText(text);
  return Array.isArray(parsed) ? parsed : [parsed];
};
