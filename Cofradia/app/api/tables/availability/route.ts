import { NextRequest, NextResponse } from 'next/server';
import { mockTables } from '@/lib/mockData';

// Simulación de base de datos
let tables = mockTables;

// GET /api/tables/availability - Verificar disponibilidad de mesas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const guests = searchParams.get('guests');
    const location = searchParams.get('location');

    if (!date || !time || !guests) {
      return NextResponse.json(
        { success: false, error: 'Se requieren los parámetros: date, time, guests' },
        { status: 400 }
      );
    }

    const guestsNum = parseInt(guests);
    if (isNaN(guestsNum) || guestsNum < 1) {
      return NextResponse.json(
        { success: false, error: 'El número de comensales debe ser mayor a 0' },
        { status: 400 }
      );
    }

    // Filtrar mesas disponibles con capacidad suficiente
    let availableTables = tables.filter(t => 
      t.isAvailable && t.capacity >= guestsNum
    );

    // Filtrar por ubicación si se especifica
    if (location) {
      availableTables = availableTables.filter(t => t.location === location);
    }

    // Ordenar por capacidad (las más pequeñas primero para optimizar)
    availableTables.sort((a, b) => a.capacity - b.capacity);

    return NextResponse.json({
      success: true,
      data: {
        available: availableTables.length > 0,
        tables: availableTables,
        count: availableTables.length,
        requestedFor: {
          date,
          time,
          guests: guestsNum,
          location: location || 'any',
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al verificar disponibilidad' },
      { status: 500 }
    );
  }
}
