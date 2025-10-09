'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardIcon, CalendarIcon, TableIcon, RestaurantIcon } from './Icons';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { motion } from 'motion/react';

const SettingsIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      link: '/',
      icon: <DashboardIcon className="w-4 h-4" />
    },
    {
      name: 'Reservas',
      link: '/reservations',
      icon: <CalendarIcon className="w-4 h-4" />
    },
    {
      name: 'Mesas',
      link: '/tables',
      icon: <TableIcon className="w-4 h-4" />
    },
    {
      name: 'Ajustes',
      link: '/settings',
      icon: <SettingsIcon className="w-4 h-4" />
    },
  ];

  return (
    <>
      {/* Static Navigation for branding and mobile */}
      <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5 group">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RestaurantIcon className="w-5 h-5 text-primary-foreground" />
                </motion.div>
                <div>
                  <h1 className="text-lg font-bold text-foreground leading-none">REBOTLUTION</h1>
                  <p className="text-xs text-muted-foreground leading-none mt-0.5">Restaurant CRM</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-lg">
                A
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border px-2 py-2">
          <div className="flex justify-around">
            {navItems.map((item) => {
              const isActive = pathname === item.link;
              return (
                <Link
                  key={item.link}
                  href={item.link}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Floating Navigation for desktop */}
      <div className="hidden md:block">
        <FloatingNav
          navItems={navItems}
          className="top-20"
        />
      </div>
    </>
  );
}
