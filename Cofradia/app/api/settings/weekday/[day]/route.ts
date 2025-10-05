import { NextRequest, NextResponse } from 'next/server';
import { RestaurantSettings, DayRules } from '@/types/settings';
import { defaultSettings } from '@/lib/defaultSettings';

// Simulación de base de datos
let settings: RestaurantSettings = defaultSettings;

// GET /api/settings/weekday/:day - Obtener configuración de un día específico
export async function GET(
  request: NextRequest,
  { params }: { params: { day: string } }
) {
  try {
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    if (!validDays.includes(params.day)) {
      return NextResponse.json(
        { success: false, error: 'Día inválido. Debe ser: monday, tuesday, wednesday, thursday, friday, saturday, sunday' },
        { status: 400 }
      );
    }

    const dayRules = settings.weekdayRules[params.day];

    if (!dayRules) {
      return NextResponse.json(
        { success: false, error: 'Configuración no encontrada para este día' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: dayRules,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener la configuración del día' },
      { status: 500 }
    );
  }
}

// PUT /api/settings/weekday/:day - Actualizar configuración de un día
export async function PUT(
  request: NextRequest,
  { params }: { params: { day: string } }
) {
  try {
    const body = await request.json();
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    if (!validDays.includes(params.day)) {
      return NextResponse.json(
        { success: false, error: 'Día inválido' },
        { status: 400 }
      );
    }

    // Validaciones
    if (body.maxReservations !== undefined && body.maxReservations < 0) {
      return NextResponse.json(
        { success: false, error: 'El máximo de reservas no puede ser negativo' },
        { status: 400 }
      );
    }

    if (body.tablesAvailable !== undefined && body.tablesAvailable > settings.tables.totalTables) {
      return NextResponse.json(
        { success: false, error: 'Las mesas disponibles no pueden exceder el total de mesas' },
        { status: 400 }
      );
    }

    // Actualizar reglas del día
    settings.weekdayRules[params.day] = {
      ...settings.weekdayRules[params.day],
      ...body,
      day: params.day as any,
    };

    settings.updatedAt = new Date();

    return NextResponse.json({
      success: true,
      data: settings.weekdayRules[params.day],
      message: `Configuración de ${params.day} actualizada exitosamente`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la configuración del día' },
      { status: 500 }
    );
  }
}
