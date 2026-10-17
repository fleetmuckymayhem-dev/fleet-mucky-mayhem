// Preserve the existing theme behavior; countdown ownership lives in TypeScript.
document.addEventListener('DOMContentLoaded', () => {
  const htmlElement = document.documentElement;
  const switchElement = document.getElementById('darkModeSwitch');
  const currentTheme = localStorage.getItem('bsTheme') || 'dark';
  htmlElement.setAttribute('data-bs-theme', currentTheme);
  if (switchElement) {
    switchElement.checked = currentTheme === 'dark';
    switchElement.addEventListener('change', function () {
      const theme = this.checked ? 'dark' : 'light';
      htmlElement.setAttribute('data-bs-theme', theme);
      localStorage.setItem('bsTheme', theme);
    });
  }
});
