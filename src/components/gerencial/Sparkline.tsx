const STROKE_COLOR: Record<string, string> = {
  violet: "#6C5CE7",
  green: "#00BB94",
  coral: "#FF7675",
  charcoal: "#2D3436",
};

const WIDTH = 64;
const HEIGHT = 22;
const PADDING = 2;

// Mini línea de tendencia sin ejes/etiquetas — solo la forma de los últimos
// períodos, sin agregar colores fuera de la paleta de marca.
export function Sparkline({
  points,
  color = "violet",
}: {
  points: number[];
  color?: "violet" | "green" | "coral" | "charcoal";
}) {
  if (points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = (WIDTH - PADDING * 2) / (points.length - 1);

  const coords = points.map((value, index) => {
    const x = PADDING + index * step;
    const y = PADDING + (1 - (value - min) / range) * (HEIGHT - PADDING * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      className="overflow-visible"
      aria-hidden="true"
    >
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={STROKE_COLOR[color]}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
