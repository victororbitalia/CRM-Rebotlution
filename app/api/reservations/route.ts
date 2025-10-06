import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reservations - Listar todas las reservas con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const tableId = searchParams.get('tableId');

    const where: any = {};
    if (status) where.status = status;
    if (tableId) where.tableId = tableId;
    if (date) {
      const start = new Date(date);
      start.setHours(0,0,0,0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      where.date = { gte: start, lt: end };
    }

    const data = await prisma.reservation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data, count: data.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener reservas' },
      { status: 500 }
    );
  }
}

// POST /api/reservations - Crear nueva reserva
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validaciones
    if (!body.customerName || !body.customerEmail || !body.customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos del cliente (nombre, email, teléfono)' },
        { status: 400 }
      );
    }

    if (!body.date || !body.time || !body.guests) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos de la reserva (fecha, hora, comensales)' },
        { status: 400 }
      );
    }

    if (body.guests < 1 || body.guests > 20) {
      return NextResponse.json(
        { success: false, error: 'El número de comensales debe estar entre 1 y 20' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customerEmail)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      );
    }

    const newReservation = await prisma.reservation.create({
      data: {
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        date: new Date(body.date),
        time: body.time,
        guests: body.guests,
        tableId: body.tableId || undefined,
        status: body.status || 'pending',
        specialRequests: body.specialRequests || undefined,
      },
    });

    return NextResponse.json({ success: true, data: newReservation, message: 'Reserva creada exitosamente' }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al crear la reserva' },
      { status: 500 }
    );
  }
}



