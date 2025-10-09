import { TrendUpIcon, TrendDownIcon } from './Icons';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export default function StatCard({ title, value, icon, trend, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-600 bg-gradient-to-br',
    green: 'from-green-500 to-green-600 text-green-600 bg-gradient-to-br',
    purple: 'from-purple-500 to-purple-600 text-purple-600 bg-gradient-to-br',
    orange: 'from-orange-500 to-orange-600 text-orange-600 bg-gradient-to-br',
    red: 'from-red-500 to-red-600 text-red-600 bg-gradient-to-br',
  };

  const bgClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
    purple: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800',
    red: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
  };

  return (
    <CardContainer className="w-full h-full">
      <CardBody className="h-full w-full">
        <div className={`card p-6 hover:shadow-lg transition-all duration-300 border ${bgClasses[color]} relative overflow-hidden group`}>
          {/* Background gradient effect */}
          <div className={`absolute inset-0 ${colorClasses[color]} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <CardItem
                translateZ="50"
                className={`p-3 rounded-xl ${colorClasses[color]} text-white shadow-lg`}
              >
                {icon}
              </CardItem>
              
              {trend && (
                <CardItem
                  translateZ="40"
                  translateX="10"
                  className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${
                    trend.isPositive
                      ? 'text-green-600 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                      : 'text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {trend.isPositive ? <TrendUpIcon className="w-4 h-4" /> : <TrendDownIcon className="w-4 h-4" />}
                  <span>{Math.abs(trend.value)}%</span>
                </CardItem>
              )}
            </div>
            
            <div className="space-y-2">
              <CardItem
                translateZ="30"
                className="text-sm font-medium text-muted-foreground"
              >
                {title}
              </CardItem>
              <CardItem
                translateZ="40"
                className="text-3xl font-bold text-foreground"
              >
                {value}
              </CardItem>
            </div>
          </div>
          
          {/* Animated bottom accent */}
          <motion.div
            className={`absolute bottom-0 left-0 h-1 ${colorClasses[color]}`}
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      </CardBody>
    </CardContainer>
  );
}
