import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reservations/:id - Obtener una reserva específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await prisma.reservation.findUnique({ where: { id: params.id } });

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
    const exists = await prisma.reservation.findUnique({ where: { id: params.id } });
    if (!exists) {
      return NextResponse.json({ success: false, error: 'Reserva no encontrada' }, { status: 404 });
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

    const updatedReservation = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        customerName: body.customerName ?? undefined,
        customerEmail: body.customerEmail ?? undefined,
        customerPhone: body.customerPhone ?? undefined,
        date: body.date ? new Date(body.date) : undefined,
        time: body.time ?? undefined,
        guests: body.guests ?? undefined,
        tableId: body.tableId ?? undefined,
        status: body.status ?? undefined,
        specialRequests: body.specialRequests ?? undefined,
      },
    });

    return NextResponse.json({ success: true, data: updatedReservation, message: 'Reserva actualizada exitosamente' });
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
    const exists = await prisma.reservation.findUnique({ where: { id: params.id } });
    if (!exists) {
      return NextResponse.json({ success: false, error: 'Reserva no encontrada' }, { status: 404 });
    }

    const deletedReservation = await prisma.reservation.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: deletedReservation, message: 'Reserva eliminada exitosamente' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar la reserva' },
      { status: 500 }
    );
  }
}



