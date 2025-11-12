const start_defer = performance.now();

window.addEventListener("load", () => {
  const end_defer = performance.now();
  console.log(
    `[Defer] JS file loaded in ${(end_defer - start_defer).toFixed(2)} ms`
  );
});
