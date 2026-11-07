# Architecture rules

- Keep the campaign gallery isolated in its own component, with photo data supplied by the campaign section; this limits visual changes to the campaign without altering the main gallery.
- Use the existing Embla carousel and Radix dialog for campaign photo navigation and enlargement; they provide touch navigation and accessible focus management without new dependencies.
- Do not edit generated authentication storage files; platform-generated type errors must be resolved through the generator rather than application changes.- Popup announcements live in src/features/announcements (shared card for public popup and admin preview); visibility rules are enforced by RLS on the announcements table and frequency is tracked per announcement in browser storage, so admins control them without code changes.
