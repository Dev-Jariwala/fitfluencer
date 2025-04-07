/**
 * Shortens a link for display by showing only the domain and path with ellipsis
 * @param {string} link - The full link to shorten
 * @returns {string} Shortened link for display
 */
export const shortenLink = (link) => {
  if (!link) return '';
  try {
    // Get the part after the domain
    const url = new URL(link);
    return `${url.origin}/register?...`;
  } catch {
    return link.substring(0, 30) + '...';
  }
};

/**
 * Copies a link to the clipboard
 * @param {string} link - The link to copy
 * @param {function} setAnimation - Function to set animation state
 * @param {function} showToast - Function to show toast notification
 * @param {string} type - The type of link being copied
 */
export const copyToClipboard = (link, type, setAnimation, showToast) => {
  navigator.clipboard.writeText(link)
    .then(() => {
      showToast('Link copied to clipboard!', 'success');
      setAnimation(type);
      setTimeout(() => setAnimation(null), 1500);
    })
    .catch(() => showToast('Failed to copy link', 'error'));
};

/**
 * Opens a link in a new tab
 * @param {string} link - The link to open
 */
export const openLink = (link) => {
  window.open(link, '_blank');
};

/**
 * Shares a link using the Web Share API or falls back to clipboard
 * @param {string} link - The link to share
 * @param {string} title - The title of what's being shared
 * @param {string} userName - The name of the user sharing
 * @param {function} showToast - Function to show toast notification
 * @param {function} copyFallback - Function to fall back to copying
 */
export const shareLink = async (link, title, userName, showToast, copyFallback) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Join ${userName || 'FitFluencer'} Platform`,
        text: `You are invited to join as a ${title}`,
        url: link,
      });
      showToast('Link shared successfully!', 'success');
    } catch {
      showToast('Failed to share link', 'error');
    }
  } else {
    copyFallback();
  }
}; 