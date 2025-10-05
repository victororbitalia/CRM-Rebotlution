import { NextRequest, NextResponse } from 'next/server';
import { RestaurantSettings } from '@/types/settings';
import { defaultSettings } from '@/lib/defaultSettings';

// Simulación de base de datos
let settings: RestaurantSettings = defaultSettings;

// GET /api/settings - Obtener configuración actual
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener la configuración' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Actualizar configuración completa
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validaciones básicas
    if (body.reservations) {
      if (body.reservations.maxAdvanceDays < 1 || body.reservations.maxAdvanceDays > 365) {
        return NextResponse.json(
          { success: false, error: 'Los días máximos de anticipación deben estar entre 1 y 365' },
          { status: 400 }
        );
      }

      if (body.reservations.maxGuestsPerReservation < 1 || body.reservations.maxGuestsPerReservation > 50) {
        return NextResponse.json(
          { success: false, error: 'El máximo de comensales debe estar entre 1 y 50' },
          { status: 400 }
        );
      }
    }

    if (body.tables) {
      if (body.tables.totalTables < 1) {
        return NextResponse.json(
          { success: false, error: 'Debe haber al menos 1 mesa' },
          { status: 400 }
        );
      }

      if (body.tables.reservedTablesAlways >= body.tables.totalTables) {
        return NextResponse.json(
          { success: false, error: 'Las mesas reservadas no pueden ser igual o mayor al total' },
          { status: 400 }
        );
      }
    }

    // Actualizar configuración
    settings = {
      ...settings,
      ...body,
      id: settings.id, // Mantener el ID original
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Configuración actualizada exitosamente',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la configuración' },
      { status: 500 }
    );
  }
}

// PATCH /api/settings - Actualizar configuración parcial
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // Actualizar solo los campos proporcionados
    settings = {
      ...settings,
      ...body,
      id: settings.id,
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Configuración actualizada exitosamente',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la configuración' },
      { status: 500 }
    );
  }
}
