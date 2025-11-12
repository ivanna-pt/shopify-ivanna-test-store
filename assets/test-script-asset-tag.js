const start_asset_tag = performance.now();

window.addEventListener("load", () => {
  const end_asset_tag = performance.now();
  console.log(
    `[asset_url and script_tag] JS file loaded in ${(
      end_asset_tag - start_asset_tag
    ).toFixed(2)} ms`
  );
});
