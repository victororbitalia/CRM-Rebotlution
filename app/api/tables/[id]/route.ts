import { NextRequest, NextResponse } from 'next/server';
import { Table } from '@/types';
import { mockTables } from '@/lib/mockData';

// Simulación de base de datos
let tables: Table[] = mockTables;

// GET /api/tables/:id - Obtener una mesa específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const table = tables.find(t => t.id === params.id);

    if (!table) {
      return NextResponse.json(
        { success: false, error: 'Mesa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: table,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener la mesa' },
      { status: 500 }
    );
  }
}

// PUT /api/tables/:id - Actualizar estado de mesa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const index = tables.findIndex(t => t.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Mesa no encontrada' },
        { status: 404 }
      );
    }

    // Validar disponibilidad
    if (body.isAvailable !== undefined && typeof body.isAvailable !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isAvailable debe ser true o false' },
        { status: 400 }
      );
    }

    // Actualizar mesa (solo permitimos cambiar isAvailable)
    tables[index] = {
      ...tables[index],
      isAvailable: body.isAvailable !== undefined ? body.isAvailable : tables[index].isAvailable,
    };

    return NextResponse.json({
      success: true,
      data: tables[index],
      message: 'Mesa actualizada exitosamente',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la mesa' },
      { status: 500 }
    );
  }
}



