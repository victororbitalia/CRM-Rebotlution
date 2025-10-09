'use client';

import { useRestaurant } from '@/context/RestaurantContext';
import StatCard from '@/components/StatCard';
import ReservationCard from '@/components/ReservationCard';
import { CalendarIcon, UsersIcon, TableIcon, StarIcon } from '@/components/Icons';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

export default function Dashboard() {
  const { reservations, tables, updateReservation } = useRestaurant();
  const [dbStats, setDbStats] = useState<{ today: number; week: number; average: number; occupancyRate: number } | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        const json = await res.json();
        if (json?.success && json.data) {
          setDbStats({
            today: json.data.reservations.today,
            week: json.data.reservations.week,
            average: json.data.guests.average,
            occupancyRate: json.data.tables.occupancyRate,
          });
        }
      } catch {}
    };
    loadStats();
  }, []);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayReservations = reservations.filter(r => {
      const resDate = new Date(r.date);
      resDate.setHours(0, 0, 0, 0);
      return resDate.getTime() === today.getTime();
    });

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekReservations = reservations.filter(r => {
      const resDate = new Date(r.date);
      return resDate >= weekStart && resDate < weekEnd;
    });

    const totalGuests = todayReservations.reduce((sum, r) => sum + r.guests, 0);
    const avgGuests = todayReservations.length > 0 ? totalGuests / todayReservations.length : 0;

    const occupiedTables = tables.filter(t => !t.isAvailable).length;
    const occupancyRate = (occupiedTables / tables.length) * 100;

    return {
      todayReservations: todayReservations.length,
      weekReservations: weekReservations.length,
      averageGuests: avgGuests.toFixed(1),
      occupancyRate: occupancyRate.toFixed(0),
    };
  }, [reservations, tables]);

  // Obtener reservas de hoy
  const todayReservations = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservations
      .filter(r => {
        const resDate = new Date(r.date);
        resDate.setHours(0, 0, 0, 0);
        return resDate.getTime() === today.getTime();
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [reservations]);

  const handleStatusChange = (id: string, status: any) => {
    updateReservation(id, { status });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Resumen de actividad del restaurante
        </p>
      </motion.div>

      {/* Tarjetas de estadísticas con BentoGrid */}
      <BentoGrid className="mb-8">
        <BentoGridItem
          header={
            <StatCard
              title="Reservas Hoy"
              value={dbStats ? dbStats.today : stats.todayReservations}
              icon={<CalendarIcon className="w-5 h-5" />}
              color="blue"
              trend={{ value: 12, isPositive: true }}
            />
          }
          className="md:col-span-2"
        />
        <BentoGridItem
          header={
            <StatCard
              title="Reservas Semana"
              value={dbStats ? dbStats.week : stats.weekReservations}
              icon={<CalendarIcon className="w-5 h-5" />}
              color="green"
            />
          }
          className="md:col-span-1"
        />
        <BentoGridItem
          header={
            <StatCard
              title="Promedio Comensales"
              value={dbStats ? dbStats.average : stats.averageGuests}
              icon={<UsersIcon className="w-5 h-5" />}
              color="purple"
            />
          }
          className="md:col-span-1"
        />
        <BentoGridItem
          header={
            <StatCard
              title="Ocupación Mesas"
              value={`${dbStats ? dbStats.occupancyRate : stats.occupancyRate}%`}
              icon={<TableIcon className="w-5 h-5" />}
              color="orange"
            />
          }
          className="md:col-span-2"
        />
      </BentoGrid>

      {/* Reservas de hoy */}
      <motion.div
        className="card p-6 mb-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Reservas de Hoy
            </h2>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
          <motion.span
            className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {todayReservations.length} {todayReservations.length === 1 ? 'reserva' : 'reservas'}
          </motion.span>
        </div>

        {todayReservations.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-base">
              No hay reservas programadas para hoy
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayReservations.map((reservation, index) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <ReservationCard
                  reservation={reservation}
                  onStatusChange={handleStatusChange}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Actividad reciente */}
      <motion.div
        className="card p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-foreground mb-5">
          Actividad Reciente
        </h2>
        <div className="space-y-3">
          {reservations.slice(0, 5).map((res, index) => {
            const statusConfig = {
              confirmed: { icon: '✓', color: 'text-green-600 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' },
              pending: { icon: '○', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' },
              seated: { icon: '●', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' },
              completed: { icon: '✓', color: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700' },
              cancelled: { icon: '✕', color: 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' },
            };
            const config = statusConfig[res.status];
            
            return (
              <motion.div
                key={res.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md ${config.color}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${config.color}`}>
                    {config.icon}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {res.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {res.guests} {res.guests === 1 ? 'persona' : 'personas'} • {res.time}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {new Date(res.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
