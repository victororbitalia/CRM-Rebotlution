'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Reservation, Table } from '@/types';
import { mockReservations, mockTables } from '@/lib/mockData';

interface RestaurantContextType {
  reservations: Reservation[];
  tables: Table[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => Promise<void>;
  updateReservation: (id: string, updates: Partial<Reservation>) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  getReservationsByDate: (date: Date) => Reservation[];
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables] = useState<Table[]>(mockTables);

  // Cargar reservas desde la API al montar
  useEffect(() => {
    const loadReservations = async () => {
      try {
        const res = await fetch('/api/reservations', { cache: 'no-store' });
        const json = await res.json();
        if (json?.success && Array.isArray(json.data)) {
          const parsed: Reservation[] = json.data.map((r: any) => ({
            ...r,
            date: new Date(r.date),
            createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
          }));
          setReservations(parsed);
        }
      } catch (e) {
        // Si falla la API, mantener vacío (o podríamos fallback a mock)
      }
    };
    loadReservations();
  }, []);

  const addReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    // Persistir en backend
    const payload = {
      ...reservation,
      date: reservation.date.toISOString(),
    } as any;
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json?.success) {
      throw new Error(json?.error || 'No se pudo crear la reserva');
    }
    const created = json.data;
    const newReservation: Reservation = {
      ...created,
      date: new Date(created.date),
      createdAt: created.createdAt ? new Date(created.createdAt) : new Date(),
    };
    setReservations(prev => [...prev, newReservation]);
  };

  const updateReservation = async (id: string, updates: Partial<Reservation>) => {
    const payload: any = { ...updates };
    if (updates.date instanceof Date) payload.date = updates.date.toISOString();

    const res = await fetch(`/api/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json?.success) {
      throw new Error(json?.error || 'No se pudo actualizar la reserva');
    }
    const updated = json.data;
    setReservations(prev =>
      prev.map(res => (res.id === id ? {
        ...res,
        ...updated,
        date: updated.date ? new Date(updated.date) : res.date,
        createdAt: updated.createdAt ? new Date(updated.createdAt) : res.createdAt,
      } : res))
    );
  };

  const deleteReservation = async (id: string) => {
    const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json?.success) {
      throw new Error(json?.error || 'No se pudo eliminar la reserva');
    }
    setReservations(prev => prev.filter(res => res.id !== id));
  };

  const getReservationsByDate = (date: Date) => {
    return reservations.filter(res => {
      const resDate = new Date(res.date);
      return resDate.toDateString() === date.toDateString();
    });
  };

  return (
    <RestaurantContext.Provider
      value={{
        reservations,
        tables,
        addReservation,
        updateReservation,
        deleteReservation,
        getReservationsByDate,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
