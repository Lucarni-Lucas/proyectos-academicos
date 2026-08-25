export function formatShortDate(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return '';
  }
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}
