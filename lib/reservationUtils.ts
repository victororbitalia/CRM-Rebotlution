import { DateTime } from 'luxon';
import { Reservation } from '@/types';

type GroupedReservations = {
  key: string; // day key
  reservations: Reservation[];
};

export function classifyAndGroupReservations(
  reservations: Reservation[],
  timezone: string = 'Europe/Madrid',
  now?: Date
) {
  const reference = now ? DateTime.fromJSDate(now).setZone(timezone) : DateTime.now().setZone(timezone);

  const upcoming: Reservation[] = [];
  const past: Reservation[] = [];

  for (const r of reservations) {
    if (!r.time) {
      past.push(r);
      continue;
    }
    // Extraer componentes de fecha de forma estable (usar UTC para no desplazar día)
    const d = new Date(r.date);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1; // 1-12
    const day = d.getUTCDate();
    const [hourStr, minuteStr] = r.time.split(':');
    const hour = parseInt(hourStr, 10) || 0;
    const minute = parseInt(minuteStr, 10) || 0;

    // Construir DateTime exacto en la zona horaria indicada
    const dt = DateTime.fromObject({ year, month, day, hour, minute }, { zone: timezone });

    if (dt >= reference) upcoming.push(r);
    else past.push(r);
  }

  // Sort upcoming asc by datetime, past desc
  upcoming.sort((a, b) => {
    const ad = new Date(a.date); const bd = new Date(b.date);
    const aDt = DateTime.fromObject({ year: ad.getUTCFullYear(), month: ad.getUTCMonth() + 1, day: ad.getUTCDate(), hour: parseInt(a.time.split(':')[0], 10) || 0, minute: parseInt(a.time.split(':')[1], 10) || 0 }, { zone: timezone });
    const bDt = DateTime.fromObject({ year: bd.getUTCFullYear(), month: bd.getUTCMonth() + 1, day: bd.getUTCDate(), hour: parseInt(b.time.split(':')[0], 10) || 0, minute: parseInt(b.time.split(':')[1], 10) || 0 }, { zone: timezone });
    return aDt.toMillis() - bDt.toMillis();
  });

  past.sort((a, b) => {
    const ad = new Date(a.date); const bd = new Date(b.date);
    const aDt = DateTime.fromObject({ year: ad.getUTCFullYear(), month: ad.getUTCMonth() + 1, day: ad.getUTCDate(), hour: parseInt(a.time?.split(':')[0] || '0', 10), minute: parseInt(a.time?.split(':')[1] || '0', 10) }, { zone: timezone });
    const bDt = DateTime.fromObject({ year: bd.getUTCFullYear(), month: bd.getUTCMonth() + 1, day: bd.getUTCDate(), hour: parseInt(b.time?.split(':')[0] || '0', 10), minute: parseInt(b.time?.split(':')[1] || '0', 10) }, { zone: timezone });
    return bDt.toMillis() - aDt.toMillis();
  });

  const groupByDay = (arr: Reservation[]) => {
    const map = new Map<string, Reservation[]>();
    for (const r of arr) {
      const d = new Date(r.date);
      const dt = DateTime.fromObject({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }, { zone: timezone });
      const key = dt.toISODate();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }

    // Ordenar reservas dentro de cada grupo por hora ascendente
    const groups: GroupedReservations[] = Array.from(map.entries()).map(([key, reservations]) => {
      reservations.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
      return { key, reservations };
    });
    return groups;
  };

  const upcomingGroups = groupByDay(upcoming).sort((a, b) => a.key.localeCompare(b.key));
  const pastGroups = groupByDay(past)
    .map(g => ({ ...g, reservations: [...g.reservations].sort((a, b) => (b.time || '').localeCompare(a.time || '')) }))
    .sort((a, b) => b.key.localeCompare(a.key));

  return { upcomingGroups, pastGroups };
}

export default {};


