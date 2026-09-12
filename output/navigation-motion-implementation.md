# Native navigation / Browse motion implementation

Owned files changed: `app/motion.css`, `components/demo-provider.tsx` loading fallback only, `app/browse/page.tsx` result keys/classes only. No navigation initializer or NativeLink changes needed.

Native same-origin cross-document transitions opt in with `@view-transition { navigation: auto }` only when reduced motion is not requested. Old root fades out110ms; new root fades/slides4px in180ms after80ms. White transition background supports the Home→Chat transition. Root Home link should remain a normal anchor to `/chat?start=1`; no special classes or click handler required. Unsupported browsers follow ordinary visible navigation. No persistent opacity class, timers, cancelled-click risk or BFCache reset handler.

Native browser document focus/history restoration is left intact; no global heading autofocus stealing focus on back/forward. Modifier/middle clicks, external links and fragment navigation are not intercepted. If Home already has its own departure animation, avoid stacking a second JavaScript delay over this transition.

Browse result grids/empty results/quote results are keyed by actual search parameters, so query rerenders receive one180ms opacity/8px entrance while filter controls remain outside the keyed subtree. Native details animate only opening opacity160ms; no height calculations. Hydration fallback is a static structural title/text/3card skeleton with one screen-reader status; no shimmer, fake progress or minimum loading timer.

Reduced motion: cross-document navigation:none, no local entrance animations (no-preference rules not applied). No permanent will-change, blur or animation loop. Existing prior reduced-motion overrides retained.

Primary reference checked12Sep2026: [MDN Using View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using), [MDN pagereveal](https://developer.mozilla.org/en-US/docs/Web/API/Window/pagereveal_event), [MDN content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility). Native transition support requires both documents opt in and same origin; fallback makes no support promise.

Scoped ESLint passed0errors/1existing native-image warning. Source frozen for root build/browser. This implementation note does not claim fresh runtime transition/focus/BFCache tests passed.
