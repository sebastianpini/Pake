// Disclaimer: Dies ist kein offizielles NinjaOne-Feature, sondern ein Workaround.
// Bereitgestellt "as is", ohne Gewährleistung, Haftung oder offiziellen Support.
// Disclaimer: This is not an official NinjaOne feature but a workaround, provided
// "as is" without warranty, liability, or official support.
//
// Pake inject script: hand ninjarmm:// links (NCPlayer) to the OS, because
// WKWebView does not forward custom URL schemes the way Safari/Chrome do.
// NinjaOne starts NCPlayer through a hidden <iframe src="ninjarmm://...">.
(function () {
  const SCHEME = /^ninjarmm:\/\//i;
  const invoke = window.__TAURI__?.core?.invoke;
  if (!invoke) return;

  const seen = new WeakSet();

  function launch(url) {
    invoke("plugin:shell|open", { path: url }).catch((error) => {
      console.error("[ninjarmm-launch] Failed to open", url, error);
    });
  }

  function check(node) {
    if (!(node instanceof Element) || seen.has(node)) return;
    const url = node.getAttribute("src") || node.getAttribute("href");
    if (url && SCHEME.test(url) && /^(IFRAME|A|EMBED)$/.test(node.tagName)) {
      seen.add(node);
      launch(url);
    }
  }

  function scan(root) {
    check(root);
    if (root.querySelectorAll) {
      root.querySelectorAll("iframe[src],a[href],embed[src]").forEach(check);
    }
  }

  new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "attributes") check(m.target);
      m.addedNodes.forEach(scan);
    }
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "href"],
  });

  // Direct clicks on ninjarmm:// anchors.
  document.addEventListener(
    "click",
    (event) => {
      const a = event.target?.closest?.("a[href]");
      if (a && SCHEME.test(a.getAttribute("href") || "")) {
        event.preventDefault();
        launch(a.getAttribute("href"));
      }
    },
    true,
  );
})();
