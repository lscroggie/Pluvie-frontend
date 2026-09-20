import type { CSSProperties } from "react";

/**
 * Gota reutilizable para las tarjetas de tipo de donación. El color llega por
 * prop y se expone como `--drop-color`.
 *
 * En reposo es solo contorno en gris secundario (`text-zinc-500`, el mismo de
 * la descripción de la tarjeta). Se rellena con `color` si `filled` es true o
 * cuando el ancestro con clase `group` recibe hover.
 */
export function DonationDropIcon({
  color,
  filled = false,
  className,
}: {
  color: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="4.4 1.4 15.2 21.4"
      aria-hidden="true"
      style={{ "--drop-color": color } as CSSProperties}
      className={[
        "h-10 w-auto text-zinc-500 transition-[fill,stroke] duration-200 motion-reduce:transition-none",
        filled
          ? "fill-[var(--drop-color)] stroke-[var(--drop-color)]"
          : "fill-transparent stroke-current group-hover:fill-[var(--drop-color)] group-hover:stroke-[var(--drop-color)]",
        className ?? "",
      ].join(" ")}
    >
      <path
        d="M12 2.2C12 2.2 5.25 10.9 5.25 15.25a6.75 6.75 0 1 0 13.5 0C18.75 10.9 12 2.2 12 2.2Z"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
