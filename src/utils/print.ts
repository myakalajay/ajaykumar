/**
 * "Print CV" — prints the typeset resume sheet on its own instead of the whole
 * portfolio. The class only has any effect inside `@media print`, so if a browser
 * never fires `afterprint` the on-screen page is unaffected either way.
 */
export function printCv() {
  const root = document.documentElement;
  root.classList.add('print-cv');
  const done = () => {
    root.classList.remove('print-cv');
    window.removeEventListener('afterprint', done);
  };
  window.addEventListener('afterprint', done);
  window.print();
}
