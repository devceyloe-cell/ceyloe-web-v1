export function ThemeScript() {
  const script = `
    (function () {
      var key = 'ceyloe-theme';
      var stored = localStorage.getItem(key);
      var theme = 'light';
      var root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
