# Nagori

An interactive website built with Vite, React, TypeScript, and Tailwind CSS.

The page shows a faded object by default. When the pointer moves across the image, a soft circular reveal brings back the "alive" version beneath the cursor. Scrolling adjusts the reveal radius.

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Asset Structure

Each object lives in its own folder under `assets/`:

```text
assets/
  apple/
    alive.png
    dead.png
```

On each page load, the app randomly selects one folder that contains both `alive.png` and `dead.png`.

## Notes

- The interaction logic is implemented in `src/App.tsx`.
- The reveal masks and visual treatment live in `src/styles.css`.
- Open Graph and Twitter metadata are defined in `index.html`.
- The social preview image is served from `public/og-image.svg`.
