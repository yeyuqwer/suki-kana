# Styles Guide

This directory manages global style entry, base theme styles, and font setup.

## Directory Layout

```text
src/styles/
  index.css               # Global style entry and imports
  shadcn.css              # shadcn base styles (do not edit manually)
  fonts.ts                # Font configuration
```

## Rules

1. Do not manually modify `shadcn.css`.
2. Use `fonts.ts` to configure and export project font setup.
3. If CSS customization is needed, create a new `.css` file in this directory.
4. Import new style files from `index.css` to make them effective globally.
