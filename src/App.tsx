import type { CSSProperties } from 'react';
import { useState } from 'react';

type AssetModule = Record<string, string>;

type Scene = {
  id: string;
  title: string;
  aliveSrc: string;
  deadSrc: string;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

const MIN_RADIUS = 8;
const MAX_RADIUS = 28;
const DEFAULT_RADIUS = 14;

const aliveImages = import.meta.glob('../assets/*/alive.png', {
  eager: true,
  import: 'default',
}) as AssetModule;

const deadImages = import.meta.glob('../assets/*/dead.png', {
  eager: true,
  import: 'default',
}) as AssetModule;

const scenes = Object.entries(aliveImages)
  .map(([alivePath, aliveSrc]) => {
    const id = alivePath.split('/').at(-2);
    const deadPath = `../assets/${id}/dead.png`;
    const deadSrc = deadImages[deadPath];

    if (!id || !deadSrc) {
      return null;
    }

    return {
      id,
      title: id.replace(/[-_]/g, ' '),
      aliveSrc,
      deadSrc,
    };
  })
  .filter((scene): scene is Scene => scene !== null);

function pickScene(items: Scene[]) {
  if (items.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

function App() {
  const [scene] = useState<Scene | null>(() => pickScene(scenes));
  const [pointer, setPointer] = useState<PointerState>({
    x: 50,
    y: 50,
    active: false,
  });
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const maskStyle = {
    '--cursor-x': `${pointer.x}%`,
    '--cursor-y': `${pointer.y}%`,
    '--core-opacity': pointer.active ? 1 : 0,
    '--halo-opacity': pointer.active ? 0.95 : 0,
    '--reveal-radius': `${radius}rem`,
    '--halo-radius': `${radius * 1.65}rem`,
  } as CSSProperties;

  if (!scene) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-paper">
        <p className="max-w-md text-center font-body text-lg">
          No paired image set was found under <code>assets/*</code>.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(244,236,223,0.18),_transparent_38%),linear-gradient(180deg,_#efe6d8_0%,_#d8c4ae_42%,_#7e5532_100%)] px-6 py-8 text-ink sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-between gap-8">
        <header className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <p className="font-body text-xs uppercase tracking-[0.4em] text-umber/75">
              Nagori
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none sm:text-6xl lg:text-7xl">
              Longing for what is already leaving
            </h1>
          </div>

          <p className="max-w-sm font-body text-base leading-relaxed text-ink/75">
            Move across the surface. What has faded briefly returns, then slips
            away again at the edge of your touch. Scroll to widen or narrow the
            reach of memory.
          </p>
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div
            className="group relative mx-auto w-fit max-w-[95vw] overflow-hidden rounded-[2rem] border border-paper/40 bg-[#2f2218] shadow-plate"
            onMouseMove={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              const x = ((event.clientX - bounds.left) / bounds.width) * 100;
              const y = ((event.clientY - bounds.top) / bounds.height) * 100;

              setPointer({ x, y, active: true });
            }}
            onMouseEnter={() => setPointer((current) => ({ ...current, active: true }))}
            onMouseLeave={() => setPointer((current) => ({ ...current, active: false }))}
            onWheel={(event) => {
              event.preventDefault();

              setRadius((current) => {
                const next = current + event.deltaY * -0.012;
                return Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, Number(next.toFixed(2))));
              });
            }}
            style={maskStyle}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,248,239,0.22),_transparent_55%)] mix-blend-screen" />

            <img
              src={scene.deadSrc}
              alt={`${scene.title}, withered`}
              className="block max-h-[68vh] w-auto max-w-[95vw] object-contain"
            />

            <img
              src={scene.aliveSrc}
              alt=""
              aria-hidden="true"
              className="alive-halo pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[var(--halo-opacity)]"
            />

            <img
              src={scene.aliveSrc}
              alt=""
              aria-hidden="true"
              className="alive-core pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[var(--core-opacity)]"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
