const start_asset_tag = performance.now();

window.addEventListener("load", () => {
  const end_asset_tag = performance.now();
  console.log(
    `[asset_url and script_tag] JS file loaded in ${(
      end_asset_tag - start_asset_tag
    ).toFixed(2)} ms`
  );
});

const t0 = performance.now();

// Code block to measure
for (let i = 0; i < 1000000; i++) {
  // Perform some operation
  Math.sqrt(i);
}

const t1 = performance.now();

console.log(
  `[asset_url and script_tag] Execution took ${t1 - t0} milliseconds.`
);
