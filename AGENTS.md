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

## BulkBuddy architecture
- Keep prototype data and nutrition calculations in a browser-safe shared React context; local-only state respects the no-backend scope.
- Give each of the six screens a TanStack leaf route within the root provider so navigation preserves prototype changes.
- Isolate visual effects in global semantic CSS and reusable controls so native conversion can replace rendering without changing domain logic.
- Use Radix dialogs for focused food and recipe edits; keyboard focus and dismissal must work consistently.
