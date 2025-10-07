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
    // Si falta time, considerar inválida para la clasificación
    if (!r.time) {
      // Colocar en past para no mostrar entre próximas (cliente debe validar en creación)
      past.push(r);
      continue;
    }

    // Construir DateTime en timezone usando date y time
    const dt = DateTime.fromISO(new Date(r.date).toISOString(), { zone: timezone }).set({ hour: parseInt(r.time.split(':')[0], 10), minute: parseInt(r.time.split(':')[1], 10) });

    if (dt >= reference) upcoming.push(r);
    else past.push(r);
  }

  // Sort upcoming asc by datetime, past desc
  upcoming.sort((a, b) => {
    const aDt = DateTime.fromISO(new Date(a.date).toISOString(), { zone: timezone }).set({ hour: parseInt(a.time.split(':')[0], 10), minute: parseInt(a.time.split(':')[1], 10) });
    const bDt = DateTime.fromISO(new Date(b.date).toISOString(), { zone: timezone }).set({ hour: parseInt(b.time.split(':')[0], 10), minute: parseInt(b.time.split(':')[1], 10) });
    return aDt.toMillis() - bDt.toMillis();
  });

  past.sort((a, b) => {
    const aDt = DateTime.fromISO(new Date(a.date).toISOString(), { zone: timezone }).set({ hour: parseInt(a.time?.split(':')[0] || '0', 10), minute: parseInt(a.time?.split(':')[1] || '0', 10) });
    const bDt = DateTime.fromISO(new Date(b.date).toISOString(), { zone: timezone }).set({ hour: parseInt(b.time?.split(':')[0] || '0', 10), minute: parseInt(b.time?.split(':')[1] || '0', 10) });
    return bDt.toMillis() - aDt.toMillis();
  });

  const groupByDay = (arr: Reservation[]) => {
    const map = new Map<string, Reservation[]>();
    for (const r of arr) {
      const dt = DateTime.fromISO(new Date(r.date).toISOString(), { zone: timezone });
      const key = dt.toISODate();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }

    const groups: GroupedReservations[] = Array.from(map.entries()).map(([key, reservations]) => ({ key, reservations }));
    return groups;
  };

  return {
    upcomingGroups: groupByDay(upcoming),
    pastGroups: groupByDay(past),
  };
}

export default {};


