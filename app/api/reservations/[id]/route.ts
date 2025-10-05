import { NextRequest, NextResponse } from 'next/server';
import { Reservation } from '@/types';

// Simulación de base de datos
let reservations: Reservation[] = [];

// GET /api/reservations/:id - Obtener una reserva específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = reservations.find(r => r.id === params.id);

    if (!reservation) {
      return NextResponse.json(
        { success: false, error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener la reserva' },
      { status: 500 }
    );
  }
}

// PUT /api/reservations/:id - Actualizar reserva completa
export async function PUT(
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

    // Validaciones
    if (body.guests && (body.guests < 1 || body.guests > 20)) {
      return NextResponse.json(
        { success: false, error: 'El número de comensales debe estar entre 1 y 20' },
        { status: 400 }
      );
    }

    if (body.customerEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.customerEmail)) {
        return NextResponse.json(
          { success: false, error: 'Email inválido' },
          { status: 400 }
        );
      }
    }

    // Actualizar reserva
    const updatedReservation: Reservation = {
      ...reservations[index],
      ...body,
      id: params.id, // Mantener el ID original
      createdAt: reservations[index].createdAt, // Mantener fecha de creación
      date: body.date ? new Date(body.date) : reservations[index].date,
    };

    reservations[index] = updatedReservation;

    return NextResponse.json({
      success: true,
      data: updatedReservation,
      message: 'Reserva actualizada exitosamente',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la reserva' },
      { status: 500 }
    );
  }
}

// DELETE /api/reservations/:id - Eliminar reserva
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const index = reservations.findIndex(r => r.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    const deletedReservation = reservations[index];
    reservations.splice(index, 1);

    return NextResponse.json({
      success: true,
      data: deletedReservation,
      message: 'Reserva eliminada exitosamente',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar la reserva' },
      { status: 500 }
    );
  }
}


