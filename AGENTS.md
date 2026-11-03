<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep reusable admin list ordering and CSV escaping in browser-safe utilities so their behavior can be tested without authentication.
- Keep admin photo upload rules (accepted formats, size cap, downscaling, keeping PNG transparency) in a browser-safe utility so they can be tested without authentication.
- Password recovery must handle the auth recovery event and show a new-password form before the editor.
- Scroll animations use the single reusable `Reveal` component (IntersectionObserver, animates once, opacity/transform only); hero uses the `fade-up` CSS utility with inline `animationDelay` for staggering; hover effects live in the `card-lift` utility gated behind `@media (hover: hover)` so they never stick on touch; all motion is disabled under `prefers-reduced-motion` in src/styles.css.
