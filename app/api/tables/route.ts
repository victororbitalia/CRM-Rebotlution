import { NextRequest, NextResponse } from 'next/server';
import { Table } from '@/types';
import { mockTables } from '@/lib/mockData';

// Simulación de base de datos
let tables: Table[] = mockTables;

// GET /api/tables - Listar todas las mesas con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const available = searchParams.get('available');
    const minCapacity = searchParams.get('minCapacity');

    let filtered = [...tables];

    // Filtrar por ubicación
    if (location) {
      filtered = filtered.filter(t => t.location === location);
    }

    // Filtrar por disponibilidad
    if (available !== null) {
      const isAvailable = available === 'true';
      filtered = filtered.filter(t => t.isAvailable === isAvailable);
    }

    // Filtrar por capacidad mínima
    if (minCapacity) {
      const capacity = parseInt(minCapacity);
      filtered = filtered.filter(t => t.capacity >= capacity);
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      count: filtered.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener mesas' },
      { status: 500 }
    );
  }
}


