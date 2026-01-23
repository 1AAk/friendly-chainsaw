# UI/UX Learning - Project Roadmap

## 1. Vision
- Learn UI/UX through practice and visual examples.
- Build a shared component library.
- Create a portfolio of interface patterns.

## 2. Current State
- Base project scaffold (Vite + React + Tailwind + Docker).
- Starter UI screen and structure.

## 3. Stages and Goals
| Stage | Goal | Status |
| --- | --- | --- |
| E1. Design Tokens | Colors, type scale, spacing, radii | [ ] |
| E2. Shared Components | Button, Input, Card, Section | [ ] |
| E3. UI Examples | 2-3 screens with distinct patterns | [ ] |
| E4. Interactions | Animations and state polish | [ ] |
| E5. Accessibility & Responsive | Contrast, focus, breakpoints | [ ] |
| E6. Documentation | Component notes and usage guide | [ ] |
| E7. Localization | RU/EN i18n baseline | [ ] |

## 4. Detailed Plan

### E1. Design Tokens
- Define palette, typography scale, spacing system.
- Encode tokens in `tailwind.config.cjs`.

### E2. Shared Components
- Build core components with variants and sizes.
- Define naming and usage rules.

### E3. UI Examples
- Create a landing page, card grid, and form example.
- Ensure examples use shared components.

### E4. Interactions
- Add entrance animations and hover states.
- Keep motion subtle and readable.

### E5. Accessibility & Responsive
- Visible focus states and sufficient contrast.
- Test on mobile and desktop.

### E6. Documentation
- Update `README.md` with usage notes.
- Capture decisions in `.memory_bank/`.

### E7. Localization
- Add an i18n layer (i18next/react-i18next or equivalent).
- Provide RU/EN locale files and wiring.

## 5. Next Steps
1. Define design tokens (E1).
2. Build shared components (E2).
3. Ship the first UI example (E3).
4. Plan RU/EN localization (E7).

## Dependency versions
- You can use context7 to check the latest versions of libraries and required dependencies before updates.
