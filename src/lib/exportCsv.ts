import type { ActivityEvent } from '@/types/activity';

export function exportCsv(events: ActivityEvent[]) {
  const header = 'Date,Type,Description,Amount (USD)\n';
  const rows = events.map((e) => {
    const date = new Date(e.timestamp).toISOString().split('T')[0];
    const desc = (e.title + (e.subtitle ? ` — ${e.subtitle}` : ''))
      .replace(/"/g, '""')
      .replace(/[\n\r]/g, ' ');
    const amount = e.amount != null ? e.amount.toFixed(2) : '';
    return `${date},"${e.type}","${desc}",${amount}`;
  });
  const csv = header + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ayni-activity-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
