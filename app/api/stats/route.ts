import { NextRequest, NextResponse } from 'next/server';
import { mockReservations, mockTables } from '@/lib/mockData';

// Simulación de base de datos
let reservations = mockReservations;
let tables = mockTables;

// GET /api/stats - Obtener estadísticas del dashboard
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    const today = date ? new Date(date) : new Date();
    today.setHours(0, 0, 0, 0);

    // Reservas de hoy
    const todayReservations = reservations.filter(r => {
      const resDate = new Date(r.date);
      resDate.setHours(0, 0, 0, 0);
      return resDate.getTime() === today.getTime();
    });

    // Reservas de la semana
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekReservations = reservations.filter(r => {
      const resDate = new Date(r.date);
      return resDate >= weekStart && resDate < weekEnd;
    });

    // Promedio de comensales
    const totalGuests = todayReservations.reduce((sum, r) => sum + r.guests, 0);
    const averageGuests = todayReservations.length > 0 
      ? (totalGuests / todayReservations.length).toFixed(1) 
      : '0';

    // Ocupación de mesas
    const occupiedTables = tables.filter(t => !t.isAvailable).length;
    const occupancyRate = ((occupiedTables / tables.length) * 100).toFixed(0);

    // Estadísticas por estado
    const statusBreakdown = {
      pending: todayReservations.filter(r => r.status === 'pending').length,
      confirmed: todayReservations.filter(r => r.status === 'confirmed').length,
      seated: todayReservations.filter(r => r.status === 'seated').length,
      completed: todayReservations.filter(r => r.status === 'completed').length,
      cancelled: todayReservations.filter(r => r.status === 'cancelled').length,
    };

    // Capacidad total
    const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
    const availableCapacity = tables
      .filter(t => t.isAvailable)
      .reduce((sum, t) => sum + t.capacity, 0);

    return NextResponse.json({
      success: true,
      data: {
        date: today.toISOString().split('T')[0],
        reservations: {
          today: todayReservations.length,
          week: weekReservations.length,
          statusBreakdown,
        },
        guests: {
          average: parseFloat(averageGuests),
          total: totalGuests,
        },
        tables: {
          total: tables.length,
          available: tables.filter(t => t.isAvailable).length,
          occupied: occupiedTables,
          occupancyRate: parseFloat(occupancyRate),
        },
        capacity: {
          total: totalCapacity,
          available: availableCapacity,
          occupied: totalCapacity - availableCapacity,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}


