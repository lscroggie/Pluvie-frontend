export function DashboardFooter({ lastSyncedLabel }: { lastSyncedLabel: string }) {
  return <footer className="text-xs text-zinc-400">Datos actualizados al {lastSyncedLabel}</footer>;
}
