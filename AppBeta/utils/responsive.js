// utils/responsive.js
// Create this file to use across ALL your screens

import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on standard ~5" screen mobile device (iPhone X)
const scale = SCREEN_WIDTH / 375;

/**
 * Normalize font size to prevent system font scaling from breaking layout
 * Use this for ALL text sizes in your app
 * @param {number} size - The font size you want
 * @returns {number} - Normalized font size
 */
export function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

/**
 * Width percentage to pixels
 * @param {number} percentage - Percentage of screen width (0-100)
 * @returns {number} - Pixels
 */
export function wp(percentage) {
  return (SCREEN_WIDTH * percentage) / 100;
}

/**
 * Height percentage to pixels
 * @param {number} percentage - Percentage of screen height (0-100)
 * @returns {number} - Pixels
 */
export function hp(percentage) {
  return (SCREEN_HEIGHT * percentage) / 100;
}

/**
 * Get responsive font size based on screen width
 * Automatically scales between small and large screens
 * @param {number} minSize - Minimum font size (for small screens)
 * @param {number} maxSize - Maximum font size (for large screens)
 * @returns {number} - Responsive font size
 */
export function responsiveFontSize(minSize, maxSize) {
  const scale = SCREEN_WIDTH / 375;
  const fontSize = minSize + (maxSize - minSize) * (scale - 1);
  return Math.round(PixelRatio.roundToNearestPixel(Math.max(minSize, Math.min(maxSize, fontSize))));
}

// Export screen dimensions for convenience
export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;

// Check if device is small (width < 360)
export const isSmallDevice = SCREEN_WIDTH < 360;

// Check if device is large (width > 400)
export const isLargeDevice = SCREEN_WIDTH > 400;