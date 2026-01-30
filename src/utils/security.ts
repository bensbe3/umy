/**
 * Security Protection Module
 * Protects against common inspection and debugging attempts
 */

// Detect if dev tools are open (less aggressive detection)
let devToolsOpen = false;
let detectionCount = 0;

const detectDevTools = () => {
  // Only check if window dimensions are significantly different
  // Increased threshold to reduce false positives
  const widthThreshold = window.outerWidth - window.innerWidth > 200;
  const heightThreshold = window.outerHeight - window.innerHeight > 200;
  
  if (widthThreshold || heightThreshold) {
    detectionCount++;
    // Only trigger after multiple detections to avoid false positives
    if (!devToolsOpen && detectionCount > 3) {
      devToolsOpen = true;
      handleDevToolsDetected();
    }
  } else {
    devToolsOpen = false;
    detectionCount = 0;
  }
};

const handleDevToolsDetected = () => {
  // Clear console (only if console is available)
  try {
    if (typeof console !== 'undefined' && console.clear) {
      console.clear();
    }
  } catch (e) {
    // Ignore errors
  }
  
  // Don't hide the body - just log a warning
  // The aggressive hiding was causing issues with the gallery
  // If you want to redirect, uncomment below:
  // window.location.href = 'about:blank';
};

// Console protection
const protectConsole = () => {
  const noop = () => {};
  const methods = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
  
  methods.forEach(method => {
    (console as any)[method] = noop;
  });
  
  // Protect console object
  Object.defineProperty(window, 'console', {
    get: () => ({
      log: noop,
      debug: noop,
      info: noop,
      warn: noop,
      error: noop,
      assert: noop,
      dir: noop,
      dirxml: noop,
      group: noop,
      groupEnd: noop,
      time: noop,
      timeEnd: noop,
      count: noop,
      trace: noop,
      profile: noop,
      profileEnd: noop,
    }),
    set: () => {}
  });
};

// Disable right-click context menu
const disableContextMenu = (e: MouseEvent) => {
  // Allow on admin page
  if (window.location.pathname === '/a8f4e2c9d7b1') return true;
  
  e.preventDefault();
  e.stopPropagation();
  return false;
};

// Disable text selection - DISABLED (user requirement: allow copying)
const disableSelection = (e: Event) => {
  // Allow text selection everywhere - user requirement
  return true;
};

// Disable drag and drop
const disableDragDrop = (e: DragEvent) => {
  e.preventDefault();
  return false;
};

// Disable keyboard shortcuts
const disableKeyboardShortcuts = (e: KeyboardEvent) => {
  // Allow all shortcuts on admin page
  if (window.location.pathname === '/a8f4e2c9d7b1') return true;
  
  // F12
  if (e.keyCode === 123) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  // Ctrl+Shift+I (DevTools)
  if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  // Ctrl+Shift+J (Console)
  if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  // Ctrl+Shift+C (Inspect Element)
  if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  // Ctrl+U (View Source)
  if (e.ctrlKey && e.keyCode === 85) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  // Ctrl+S (Save Page)
  if (e.ctrlKey && e.keyCode === 83) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  // Ctrl+P (Print)
  if (e.ctrlKey && e.keyCode === 80) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  // Ctrl+Shift+P (Command Palette in DevTools)
  if (e.ctrlKey && e.shiftKey && e.keyCode === 80) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  return true;
};

// Disable image dragging
const disableImageDrag = () => {
  document.addEventListener('dragstart', (e) => {
    if ((e.target as HTMLElement).tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  }, { passive: false });
  
  // Also disable via CSS attribute
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.setAttribute('draggable', 'false');
    img.style.userSelect = 'none';
    (img.style as any).webkitUserDrag = 'none';
  });
};

// Obfuscate source code visibility
const obfuscateSource = () => {
  // Disable view source
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      return false;
    }
  });
  
  // Disable save
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.keyCode === 83) {
      e.preventDefault();
      return false;
    }
  });
};

// Disable print screen (partial protection)
const disablePrintScreen = () => {
  document.addEventListener('keydown', (e) => {
    // Print Screen key
    if (e.keyCode === 44) {
      e.preventDefault();
      return false;
    }
  });
};

// Anti-debugging techniques (optional - can be aggressive)
const antiDebug = () => {
  // Breakpoint detection
  const detectDebugger = () => {
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    const end = performance.now();
    if (end - start > 100) {
      // Debugger detected
      handleDevToolsDetected();
    }
  };
  
  // Run periodically (commented out by default as it can be too aggressive)
  // setInterval(detectDebugger, 1000);
};

// Initialize all security protections
export const initSecurity = () => {
  // Protect console
  protectConsole();
  
  // Disable context menu
  document.addEventListener('contextmenu', disableContextMenu, { passive: false });
  
  // Text selection is now allowed (user requirement)
  // document.addEventListener('selectstart', disableSelection, { passive: false });
  // document.addEventListener('dragstart', disableSelection, { passive: false });
  
  // Disable drag and drop
  document.addEventListener('dragstart', disableDragDrop, { passive: false });
  document.addEventListener('drop', disableDragDrop, { passive: false });
  
  // Disable keyboard shortcuts
  document.addEventListener('keydown', disableKeyboardShortcuts, { passive: false });
  
  // Disable image dragging
  disableImageDrag();
  
  // Obfuscate source
  obfuscateSource();
  
  // Disable print screen
  disablePrintScreen();
  
  // DevTools detection (less frequent to reduce performance impact)
  setInterval(detectDevTools, 2000);
  
  // Anti-debugging (optional - can be aggressive)
  // antiDebug();
  
  // CSS-based protections (less aggressive to allow gallery functionality)
  const style = document.createElement('style');
  style.id = 'security-styles';
  style.textContent = `
    /* Gallery-specific: Allow interactions */
    .sphere-root,
    .sphere-root *,
    .dome-main,
    .dome-main *,
    .item__image,
    .item__image * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    
    /* Gallery images - prevent drag but allow container interactions */
    .dome-image {
      -webkit-user-drag: none !important;
      -khtml-user-drag: none !important;
      -moz-user-drag: none !important;
      -o-user-drag: none !important;
      user-drag: none !important;
      pointer-events: none !important;
    }
    
    /* Gallery image containers need pointer events */
    .item__image {
      pointer-events: auto !important;
      cursor: pointer !important;
    }
    
    /* Prevent dragging on other images (not gallery) */
    img:not(.dome-image) {
      -webkit-user-drag: none !important;
      -khtml-user-drag: none !important;
      -moz-user-drag: none !important;
      -o-user-drag: none !important;
      user-drag: none !important;
    }
    
    /* Allow text selection in input fields */
    input, textarea {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
    }
    
    /* Allow everything on admin page */
    body[data-admin-page="true"],
    body[data-admin-page="true"] * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
      pointer-events: auto !important;
    }
  `;
  document.head.appendChild(style);
};

// Cleanup function (if needed)
export const cleanupSecurity = () => {
  // Remove event listeners if needed
  // This is a basic implementation
};
