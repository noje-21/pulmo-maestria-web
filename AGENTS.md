# Architecture rules

- Keep the campaign gallery isolated in its own component, with photo data supplied by the campaign section; this limits visual changes to the campaign without altering the main gallery.
- Use the existing Embla carousel and Radix dialog for campaign photo navigation and enlargement; they provide touch navigation and accessible focus management without new dependencies.
- Do not edit generated authentication storage files; platform-generated type errors must be resolved through the generator rather than application changes.