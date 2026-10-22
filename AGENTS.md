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

## Application architecture
- Keep the demo browser-only with a shared tracker provider and validated local-storage assignments; this preserves a zero-backend portfolio experience.
- Use a synchronous AssignmentAgent adapter for rule-based behavior, separate from the chat surface; a future Python integration can replace this boundary without claiming current LLM inference.
- Keep separate home, dashboard, assignment, assistant, and about routes inside one shared shell; each page has independent metadata and navigation.
- Compose chat with AI Elements primitives, and style all visual roles through global semantic tokens; this keeps the interface consistent and reusable.
