/**
 * Check if the user is scrolled to the bottom of a container
 * @param container The container element to check
 * @param threshold The threshold in pixels to consider as "bottom"
 * @returns True if the user is at the bottom, false otherwise
 */
export function isUserAtBottom(container: HTMLElement, threshold = 50) {
  return container.scrollHeight - container.scrollTop <= container.offsetHeight + threshold;
}