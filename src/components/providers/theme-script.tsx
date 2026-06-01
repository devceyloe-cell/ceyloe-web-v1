export function ThemeScript() {
  const script = `
    (function () {
      var key = 'ceyloe-theme';
      var stored = localStorage.getItem(key);
      var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
      var root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
