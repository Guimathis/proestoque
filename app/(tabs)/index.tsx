import LogoProEstoque from '@/src/components/LogoProEstoque';
import { Text } from '@/src/components/ui/text';
import {
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: 'brand' | 'red' | 'amber';
  accent?: boolean;
};

type ActivityItemProps = {
  title: string;
  subtitle: string;
  time: string;
  type: 'in' | 'out' | 'alert';
};

// ─── Mapa de variantes ────────────────────────────────────────────────────────
const BADGE_COLOR: Record<NonNullable<StatCardProps['badgeColor']>, string> = {
  brand: 'text-brand',
  red: 'text-red-400',
  amber: 'text-amber-400',
};

const ACTIVITY_CONFIG: Record<
  ActivityItemProps['type'],
  { bg: string; icon: React.ReactNode }
> = {
  in: {
    bg: 'bg-brand/10',
    icon: <TrendingUp size={16} color="#1DB954" strokeWidth={1.8} />,
  },
  out: {
    bg: 'bg-red-500/10',
    icon: <TrendingDown size={16} color="#ef4444" strokeWidth={1.8} />,
  },
  alert: {
    bg: 'bg-amber-500/10',
    icon: <AlertTriangle size={16} color="#f59e0b" strokeWidth={1.8} />,
  },
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────
function StatCard({ label, value, icon, badge, badgeColor = 'brand', accent }: StatCardProps) {
  return (
    <View
      className={
        accent
          ? 'flex-1 rounded-2xl bg-brand p-4 gap-3'
          : 'flex-1 rounded-2xl bg-zinc-900 border border-zinc-800 p-4 gap-3'
      }
    >
      <View className="flex-row items-center justify-between">
        <View
          className={
            accent
              ? 'h-10 w-10 items-center justify-center rounded-xl bg-black/20'
              : 'h-10 w-10 items-center justify-center rounded-xl bg-zinc-800'
          }
        >
          {icon}
        </View>
        {badge && (
          <Text className={`text-xs font-semibold ${accent ? 'text-black/70' : BADGE_COLOR[badgeColor]}`}>
            {badge}
          </Text>
        )}
      </View>
      <View className="gap-0.5">
        <Text className={`text-2xl font-bold ${accent ? 'text-black' : 'text-white'}`}>
          {value}
        </Text>
        <Text className={`text-xs ${accent ? 'text-black/70' : 'text-zinc-400'}`}>
          {label}
        </Text>
      </View>
    </View>
  );
}

function ActivityItem({ title, subtitle, time, type }: ActivityItemProps) {
  const { bg, icon } = ACTIVITY_CONFIG[type];
  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-zinc-800 last:border-0">
      <View className={`h-9 w-9 items-center justify-center rounded-full ${bg}`}>
        {icon}
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-sm font-medium text-white">{title}</Text>
        <Text className="text-xs text-zinc-400">{subtitle}</Text>
      </View>
      <Text className="text-xs text-zinc-500">{time}</Text>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="text-base font-semibold text-zinc-300">{children}</Text>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 pt-6 gap-7">

          {/* Header */}
          <View className="flex-row items-center gap-2 mt-4">
            <LogoProEstoque size="sm" />
            <Text className="text-2xl font-bold text-white">ProEstoque</Text>
          </View>

          {/* Stats — linha 1 */}
          <View className="gap-3">
            <SectionTitle>Visão geral</SectionTitle>
            <View className="flex-row gap-3">
              <StatCard
                label="Itens em estoque"
                value="1.248"
                icon={<Package size={20} color="#000000" strokeWidth={2} />}
                badge="↑ 12%"
                badgeColor="brand"
                accent
              />
              <StatCard
                label="Estoque baixo"
                value="14"
                icon={<AlertTriangle size={20} color="#f59e0b" strokeWidth={1.8} />}
                badge="⚠ atenção"
                badgeColor="amber"
              />
            </View>

            {/* Stats — linha 2 */}
            <View className="flex-row gap-3">
              <StatCard
                label="Entradas hoje"
                value="36"
                icon={<TrendingUp size={20} color="#1DB954" strokeWidth={1.8} />}
                badge="+8 itens"
                badgeColor="brand"
              />
              <StatCard
                label="Saídas hoje"
                value="22"
                icon={<TrendingDown size={20} color="#ef4444" strokeWidth={1.8} />}
                badge="-3 itens"
                badgeColor="red"
              />
            </View>
          </View>

          {/* Atividade recente */}
          <View className="gap-3">
            <SectionTitle>Atividade recente</SectionTitle>
            <View className="bg-zinc-900 rounded-2xl px-4 border border-zinc-800">
              <ActivityItem
                title="Entrada: Caixas de papelão"
                subtitle="50 unidades · Armazém A"
                time="14:32"
                type="in"
              />
              <ActivityItem
                title="Saída: Fitas adesivas"
                subtitle="12 unidades · Pedido #4821"
                time="13:10"
                type="out"
              />
              <ActivityItem
                title="Alerta: Papel A4 em baixa"
                subtitle="Apenas 8 unidades restantes"
                time="11:45"
                type="alert"
              />
              <ActivityItem
                title="Entrada: Etiquetas adesivas"
                subtitle="200 unidades · Armazém B"
                time="09:20"
                type="in"
              />
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
