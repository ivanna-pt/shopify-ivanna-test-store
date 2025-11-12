const start_defer = performance.now();

window.addEventListener("load", () => {
  const end_defer = performance.now();
  console.log(
    `[Defer] JS file loaded in ${(end_defer - start_defer).toFixed(2)} ms`
  );
});

const defer_t0 = performance.now();

// Code block to measure
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}

const defer_t1 = performance.now();

console.log(`[Defer] Execution took ${defer_t1 - defer_t0} milliseconds.`);
