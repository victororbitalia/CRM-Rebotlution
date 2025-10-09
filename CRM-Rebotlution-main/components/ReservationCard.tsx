import { useState } from 'react';
import { Reservation } from '@/types';
import { ClockIcon, UsersIcon, TableIcon, DocumentIcon, CheckIcon, XIcon } from './Icons';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { motion } from 'motion/react';

interface ReservationCardProps {
  reservation: Reservation;
  onStatusChange?: (id: string, status: Reservation['status']) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Reservation>) => void;
}

export default function ReservationCard({ reservation, onStatusChange, onDelete, onUpdate }: ReservationCardProps) {
  const statusColors = {
    pending: {
      bg: 'bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      accent: 'from-amber-500 to-amber-600'
    },
    confirmed: {
      bg: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      accent: 'from-blue-500 to-blue-600'
    },
    seated: {
      bg: 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      accent: 'from-green-500 to-green-600'
    },
    completed: {
      bg: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-700',
      accent: 'from-gray-500 to-gray-600'
    },
    cancelled: {
      bg: 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      accent: 'from-red-500 to-red-600'
    },
  };

  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    seated: 'En mesa',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    customerName: reservation.customerName || '',
    customerEmail: reservation.customerEmail || '',
    customerPhone: reservation.customerPhone || '',
    date: new Date(reservation.date).toISOString().slice(0, 10),
    time: reservation.time || '',
    guests: reservation.guests || 1,
    preferredLocation: (reservation as any).preferredLocation || 'any',
    specialRequests: reservation.specialRequests || '',
  });

  const handleSave = async () => {
    if (!onUpdate) {
      setIsEditing(false);
      return;
    }
    await onUpdate(reservation.id, {
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      date: new Date(form.date),
      time: form.time,
      guests: Number(form.guests),
      // preferredLocation: form.preferredLocation as any, // Hotfix: Se deshabilita temporalmente hasta que la migración se aplique en producción.
      specialRequests: form.specialRequests || undefined,
    });
    setIsEditing(false);
  };

  const currentStatus = statusColors[reservation.status];

  return (
    <CardContainer className="w-full h-full">
      <CardBody className="h-full w-full">
        <div className={`card p-5 hover:shadow-xl transition-all duration-300 border-l-4 ${currentStatus.border} ${currentStatus.bg} relative overflow-hidden group`}>
          {/* Background gradient effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentStatus.accent} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <CardItem
                  translateZ="30"
                  className="font-semibold text-lg text-foreground mb-1"
                >
                  {reservation.customerName}
                </CardItem>
                <CardItem
                  translateZ="20"
                  className="text-sm text-muted-foreground"
                >
                  {reservation.customerPhone}
                </CardItem>
              </div>
              <CardItem
                translateZ="40"
                translateX="10"
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border} shadow-sm`}
              >
                {statusLabels[reservation.status]}
              </CardItem>
            </div>

            {isEditing ? (
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-1 gap-3">
                  <input
                    className="input-field"
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="Nombre del cliente"
                  />
                  <input
                    className="input-field"
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    placeholder="Email"
                  />
                  <input
                    className="input-field"
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    placeholder="Teléfono"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="input-field"
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                    <input
                      className="input-field"
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                    />
                  </div>
                  <input
                    className="input-field"
                    type="number"
                    min={1}
                    max={20}
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                  />
                  <select
                    className="input-field"
                    value={form.preferredLocation}
                    onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })}
                  >
                    <option value="any">Ubicación: Cualquiera</option>
                    <option value="interior">Ubicación: Interior</option>
                    <option value="exterior">Ubicación: Exterior</option>
                    <option value="terraza">Ubicación: Terraza</option>
                    <option value="privado">Ubicación: Privado</option>
                  </select>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Peticiones especiales"
                    value={form.specialRequests}
                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <CardItem
                  translateZ="20"
                  className="flex items-center text-sm text-muted-foreground p-2 rounded-lg bg-background/50"
                >
                  <ClockIcon className="w-4 h-4 mr-3 text-primary" />
                  <div>
                    <span className="font-medium">{new Date(reservation.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span className="font-medium">{reservation.time}</span>
                  </div>
                </CardItem>
                
                <CardItem
                  translateZ="20"
                  className="flex items-center text-sm text-muted-foreground p-2 rounded-lg bg-background/50"
                >
                  <UsersIcon className="w-4 h-4 mr-3 text-primary" />
                  <span>{reservation.guests} {reservation.guests === 1 ? 'persona' : 'personas'}</span>
                </CardItem>
                
                {reservation.tableId && (
                  <CardItem
                    translateZ="20"
                    className="flex items-center text-sm text-muted-foreground p-2 rounded-lg bg-background/50"
                  >
                    <TableIcon className="w-4 h-4 mr-3 text-primary" />
                    <span>Mesa asignada</span>
                  </CardItem>
                )}
                
                {reservation.specialRequests && (
                  <CardItem
                    translateZ="20"
                    className="flex items-start text-sm text-muted-foreground bg-background/50 p-3 rounded-lg"
                  >
                    <DocumentIcon className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="italic">{reservation.specialRequests}</span>
                  </CardItem>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-border">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 btn-primary"
                  >
                    Guardar
                  </motion.button>
                </>
              ) : (
                <>
                  {onUpdate && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(true)}
                      className="flex-1 btn-secondary"
                    >
                      Editar
                    </motion.button>
                  )}
                  {onStatusChange && reservation.status === 'pending' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onStatusChange(reservation.id, 'confirmed')}
                      className="flex-1 btn-primary flex items-center justify-center gap-1.5"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Confirmar
                    </motion.button>
                  )}
                  {onStatusChange && reservation.status === 'confirmed' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onStatusChange(reservation.id, 'seated')}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg"
                    >
                      <TableIcon className="w-4 h-4" />
                      Sentar
                    </motion.button>
                  )}
                  {onStatusChange && reservation.status === 'seated' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onStatusChange(reservation.id, 'completed')}
                      className="flex-1 btn-secondary flex items-center justify-center gap-1.5"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Completar
                    </motion.button>
                  )}
                  {onDelete && reservation.status !== 'completed' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onDelete(reservation.id)}
                      className="px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 rounded-lg transition-all border border-red-200 shadow-sm"
                      title="Eliminar reserva"
                    >
                      <XIcon className="w-4 h-4" />
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Animated side accent */}
          <motion.div
            className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${currentStatus.accent}`}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ originY: 0 }}
          />
        </div>
      </CardBody>
    </CardContainer>
  );
}
