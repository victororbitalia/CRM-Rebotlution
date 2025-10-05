import { NextRequest, NextResponse } from 'next/server';
import { Reservation, ReservationStatus } from '@/types';

// Simulación de base de datos
let reservations: Reservation[] = [];

// PATCH /api/reservations/:id/status - Cambiar estado de reserva
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const index = reservations.findIndex(r => r.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    // Validar estado
    const validStatuses: ReservationStatus[] = ['pending', 'confirmed', 'seated', 'completed', 'cancelled'];
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Estado inválido. Debe ser: pending, confirmed, seated, completed o cancelled' 
        },
        { status: 400 }
      );
    }

    // Actualizar solo el estado
    reservations[index].status = body.status;

    return NextResponse.json({
      success: true,
      data: reservations[index],
      message: `Estado actualizado a: ${body.status}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el estado' },
      { status: 500 }
    );
  }
}


