---
name: styles-conventions
description: Use when adding global styles, font setup, or CSS imports under src/styles.
---

# Styles Conventions

## Scope

Applies to `src/styles/**`.

## Hard Rules

1. Do not manually modify `src/styles/shadcn.css`.
2. Configure fonts through `src/styles/fonts.ts`.
3. For custom CSS, create a new `.css` file in `src/styles`.
4. Import custom style files from `src/styles/index.css`.

Example:

```css
@import "./scrollbar.css";
```

## Workflow

1. Add dedicated style file for new global behavior.
2. Keep style concerns separated by file purpose.
3. Wire file through `index.css` import list.
4. Avoid mixing framework base styles and custom app styles.

## Review Checklist

- `shadcn.css` is unchanged.
- Font changes are in `fonts.ts`.
- New CSS is added in a dedicated file.
- New CSS file is imported by `index.css`.

## References

- `src/styles/README.md`
