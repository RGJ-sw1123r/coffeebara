# Archive Notes

This folder keeps repository-internal archive notes for earlier Coffeebara directions.

The goal is not to delete v1 history or hide it in Git alone.
The goal is to preserve what was built, explain why it mattered, and make later cleanup or reuse easier.

## Current archive policy

- Keep v1 as a documented milestone inside the same repository
- Do not keep obsolete product assumptions mixed into the active product surface forever
- Do not delete working implementation blindly just because the product direction changed
- Separate archive work into:
  - documented reference assets
  - candidates for later code extraction
  - active assets that still support the new product direction

## What belongs here

- product-direction transition notes
- v1 feature inventories
- legacy flow descriptions
- migration and extraction plans

## Important rule

At the current stage, much of the v1 code is still referenced by the running app.
That means archive work should begin with classification and documentation first, then move into code extraction only after the active path is decoupled safely.
