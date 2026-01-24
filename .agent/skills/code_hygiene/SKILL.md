---
name: Code Hygiene
description: A protocol for reviewing and cleaning up the codebase to ensure best engineering practices.
---

# Code Hygiene Protocol

Use this skill to periodically review the codebase for cleanliness, architectural integrity, and adherance to best practices.

## 1. Dead Code Elimination
- **Unused Files:** Identify files in `src/` that are not imported by any other file.
- **Unused Exports:** check for exported functions or constants that are never imported.
- **Commented Code:** aggressive removal of commented-out blocks of code.

## 2. "Dirt" Detection
- **Console Logs:** Remove `console.log` statements used for debugging. Allow `console.error` or `console.warn` if legitimate.
- **Temporary Comments:** Locate `// TODO`, `// FIXME`, or `// TEMP`.
  - If trivial, fix immediately.
  - If complex, ensure they are tracked in the project management system or `task.md`.

## 3. Architectural Integrity checks
- **Database Access:**
  - `src/database` code should ONLY be accessed by `src/services` or initialization scripts.
  - UI Components (`src/features`, `src/components`) should NEVER import directly from `src/database`. They must use `src/services`.
- **Business Logic Separation:**
  - Complex logic should reside in `services/` or `hooks/`, not inside UI component bodies.

## 4. Naming & Structure Conventions
- **Folders:** camelCase or kebab-case (be consistent).
- **React Components:** PascalCase (e.g., `ExerciseDetailScreen.js`).
- **Non-Component Files:** camelCase (e.g., `apiClient.js`).

## Usage
When asked to "clean up" or "review" the code, run through these 4 checks sequentially. Report findings before deleting anything critical.
