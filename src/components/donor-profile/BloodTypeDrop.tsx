/**
 * Gota grande con el grupo sanguíneo y el factor Rh adentro. Es el elemento
 * visual principal del encabezado del portal del donante, por eso usa el
 * degradado de marca y un tamaño mucho mayor que el chip `BloodTypeBadge`.
 *
 * El texto va dentro del SVG para que escale junto con la gota: el tamaño
 * real se controla solo con las clases de alto/ancho del contenedor.
 */

const RH_LABEL: Record<string, string> = {
  "+": "positivo",
  "−": "negativo",
};

// Acepta el guion ASCII, el signo menos tipográfico (U+2212) y el en dash, y
// los muestra siempre como U+2212, que tiene el mismo ancho visual que "+".
const RH_SUFFIX = /[+\-−–]$/;

export function BloodTypeDrop({
  bloodType,
  className,
}: {
  bloodType: string;
  className?: string;
}) {
  const rhMatch = RH_SUFFIX.exec(bloodType.trim());
  const rh = rhMatch ? (rhMatch[0] === "+" ? "+" : "−") : "";
  const group = rhMatch ? bloodType.trim().slice(0, -1) : bloodType.trim();

  // "AB" necesita más ancho que "O", "A" o "B" dentro del bulbo de la gota.
  const groupSize = group.length > 1 ? 6 : 8;
  const rhSize = group.length > 1 ? 3.4 : 4.4;

  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={`Grupo sanguíneo ${group}${rh ? ` ${RH_LABEL[rh]}` : ""}`}
      className={`drop-shadow-md ${className ?? "h-32 w-32"}`}
    >
      <defs>
        <linearGradient id="pluvie-blood-drop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6C5CE7" />
          <stop offset="100%" stopColor="#FF7675" />
        </linearGradient>
      </defs>

      <path
        d="M12 2.2C12 2.2 5.25 10.9 5.25 15.25a6.75 6.75 0 1 0 13.5 0C18.75 10.9 12 2.2 12 2.2Z"
        fill="url(#pluvie-blood-drop)"
      />

      {/* El bulbo está centrado en (12, 15.25): el texto se apoya ahí. */}
      <text
        x="12"
        y="15.6"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize={groupSize}
        fontWeight="700"
      >
        {group}
        {rh && (
          <tspan fontSize={rhSize} dy={-groupSize * 0.32}>
            {rh}
          </tspan>
        )}
      </text>
    </svg>
  );
}
