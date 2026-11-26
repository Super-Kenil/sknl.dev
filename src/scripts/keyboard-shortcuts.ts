function triggerThemeAction(action: 'randomize' | 'save') {
  document.dispatchEvent(new Event(`site:${action === 'randomize' ? 'randomize-theme' : 'save-theme'}`));
}

type SiteWindow = Window & {siteKeyboardShortcutsBound?: boolean};

if (!(window as SiteWindow).siteKeyboardShortcutsBound) {
  (window as SiteWindow).siteKeyboardShortcutsBound = true;

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;

    const actionButton = event.target.closest<HTMLButtonElement>('[data-theme-action]');
    const action = actionButton?.dataset.themeAction;

    if (action === 'randomize' || action === 'save') {
      triggerThemeAction(action);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.isComposing || event.repeat) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    const searchModal = document.getElementById('ai-search-modal') as
      | (HTMLElement & { isModalOpen?: () => boolean })
      | null;
    if (searchModal?.isModalOpen?.()) {
      return;
    }

    const composedEditable = event.composedPath().some(
      node =>
        node instanceof HTMLElement &&
        (node.isContentEditable ||
          node.matches('input, textarea, select, [contenteditable=""], [contenteditable="true"]'))
    );
    if (composedEditable) {
      return;
    }

    const target = event.target;
    if (target instanceof HTMLElement && (
      target.isContentEditable ||
      target.closest('input, textarea, select, search-modal-snippet, [contenteditable=""], [contenteditable="true"]')
    )) {
      return;
    }

    const shortcutTarget = Array.from(
      document.querySelectorAll<HTMLElement>('[data-keyboard-shortcut]')
    ).find(element => element.dataset.keyboardShortcut?.toLowerCase() === event.key.toLowerCase());

    if (shortcutTarget) {
      event.preventDefault();
      shortcutTarget.click();
      return;
    }

    if (event.key.toLowerCase() === 'd') {
      event.preventDefault();
      triggerThemeAction('randomize');
      return;
    }

    if (event.key.toLowerCase() === 's') {
      event.preventDefault();
      triggerThemeAction('save');
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();

      if (window.history.length > 1) {
        window.history.back();
      }
    }
  });
}
