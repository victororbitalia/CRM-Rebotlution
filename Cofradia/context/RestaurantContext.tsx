'use client';

import React, { createContext, useContext, useState } from 'react';
import { Reservation, Table } from '@/types';
import { mockReservations, mockTables } from '@/lib/mockData';

interface RestaurantContextType {
  reservations: Reservation[];
  tables: Table[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
  getReservationsByDate: (date: Date) => Reservation[];
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [tables] = useState<Table[]>(mockTables);

  const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: `res-${Date.now()}`,
      createdAt: new Date(),
    };
    setReservations(prev => [...prev, newReservation]);
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations(prev =>
      prev.map(res => (res.id === id ? { ...res, ...updates } : res))
    );
  };

  const deleteReservation = (id: string) => {
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
