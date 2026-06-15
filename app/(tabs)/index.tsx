import { Text } from '@/src/components/ui/text';
import {
  AlertTriangle,
  CircleDollarSign,
  Folder,
  Package,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StatusBar, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';

import LogoProEstoque from '@/src/components/LogoProEstoque';
import { THEME } from '@/src/constants/theme';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/contexts/AuthContext';
import { useProducts, Produto } from '@/src/contexts/ProductsContext';
import { useCategorias } from '@/src/hooks/useCategorias';
import { LoadingView } from '@/src/components/LoadingView';
import { ErrorView } from '@/src/components/ErrorView';
import { formatarPreco, getProdutosComEstoqueBaixo, getValorTotalEstoque } from '@/src/utils/formatters';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getStatusBadge(p: Produto) {
  if (p.quantidade === 0) return { label: 'Sem estoque', color: 'bg-red-500/20', textColor: 'text-red-500' };
  const qtMin = (p as any).quantidadeMinima || 10;
  if (p.quantidade < qtMin) return { label: 'Baixo', color: 'bg-amber-500/20', textColor: 'text-amber-500' };
  return { label: 'Normal', color: 'bg-brand/20', textColor: 'text-brand' };
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { produtos, isLoading: isLoadingProdutos, error: errorProdutos, carregarProdutos } = useProducts();
  const { categorias, isLoading: isLoadingCategorias, error: errorCategorias, refetch: carregarCategorias } = useCategorias();
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([carregarProdutos(), carregarCategorias()]);
    setRefreshing(false);
  }, [carregarProdutos, carregarCategorias]);

  if (errorProdutos || errorCategorias) {
    return <ErrorView message={errorProdutos || errorCategorias || 'Erro de rede.'} onRetry={onRefresh} />;
  }

  if ((isLoadingProdutos || isLoadingCategorias) && produtos.length === 0 && categorias.length === 0) {
    return <LoadingView />;
  }

  const produtosComEstoqueBaixo = getProdutosComEstoqueBaixo(produtos);
  const valorTotal = getValorTotalEstoque(produtos);

  const cards = [
    { id: 'total', label: 'Produtos', value: produtos.length.toString(), icon: <Package size={20} color={THEME.dark.mutedForeground} />, bg: 'bg-zinc-900', border: 'border-zinc-800' },
    { id: 'alertas', label: 'Alertas', value: produtosComEstoqueBaixo.length.toString(), icon: <AlertTriangle size={20} color={THEME.dark.destructive} />, bg: 'bg-red-950/40', border: 'border-red-900/50' },
    { id: 'categorias', label: 'Categorias', value: categorias.length.toString(), icon: <Folder size={20} color={THEME.dark.mutedForeground} />, bg: 'bg-zinc-900', border: 'border-zinc-800' },
    { id: 'valor', label: 'Em Estoque', value: formatarPreco(valorTotal), icon: <CircleDollarSign size={20} color={THEME.dark.brand} />, bg: 'bg-brand/10', border: 'border-brand/20' },
  ];

  const ListHeader = () => (
    <View className="px-6 pt-2">
      <View className="flex-row items-center gap-2">
        <LogoProEstoque size="sm" />
        <Text className="text-2xl font-bold text-white">ProEstoque</Text>
      </View>

      <View className="flex-row justify-between items-center pt-6 pb-6">
        <View>
          <Text className="text-2xl font-bold text-white">{getGreeting()}, {user?.nome?.split(' ')[0] ?? 'Visitante'} 👋</Text>
          <Text className="text-sm text-zinc-400 mt-1">Visão geral do estoque</Text>
        </View>
        <TouchableOpacity className="h-12 w-12 bg-brand rounded-full items-center justify-center">
          <Text className="text-white font-bold text-lg">{user?.nome?.charAt(0)?.toUpperCase() ?? 'U'}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {cards.map(card => (
          <View key={card.id} className={`flex-1 min-w-[45%] rounded-2xl p-4 gap-3 border ${card.border} ${card.bg}`}>
            {card.icon}
            <View className="gap-0.5 mt-2">
              <Text className="text-2xl font-bold text-white">{card.value}</Text>
              <Text className="text-xs text-zinc-400">{card.label}</Text>
            </View>
          </View>
        ))}
      </View>

      {produtosComEstoqueBaixo.length > 0 && (
        <View className="bg-red-950/40 border border-red-900/50 rounded-2xl p-4 mt-6">
          <View className="flex-row items-center gap-2 mb-4">
            <AlertTriangle size={18} color={THEME.dark.destructive} />
            <Text className="text-sm font-bold text-red-500">Estoque crítico ({produtosComEstoqueBaixo.length})</Text>
          </View>
          {produtosComEstoqueBaixo.slice(0, 3).map(p => (
            <View key={p.id} className="flex-row justify-between items-center mb-3">
              <Text className="text-xs text-red-200">{p.nome}</Text>
              <Text className="text-xs font-bold text-red-500">{p.quantidade} un.</Text>
            </View>
          ))}
          <TouchableOpacity className="mt-2 self-end">
            <Text className="text-xs font-semibold text-red-400" onPress={() => router.navigate('/(tabs)/produtos')}>Ver todos →</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text className="text-base font-semibold text-zinc-300 mt-8 mb-2">Produtos recentes</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Produto }) => {
    const status = getStatusBadge(item);
    return (
      <View className="flex-row items-center gap-3 py-3 px-6 border-b border-zinc-800/50">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          {(item as any).foto ? (
            <Image source={{ uri: (item as any).foto }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          ) : (
            <Package size={22} color={THEME.dark.mutedForeground} />
          )}
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-sm font-medium text-white">{item.nome}</Text>
          <Text className="text-xs text-zinc-400">{item.quantidade} un.</Text>
        </View>
        <View className={`px-2.5 py-1 rounded-md ${status.color}`}>
          <Text className={`text-[10px] font-bold uppercase ${status.textColor}`}>{status.label}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={produtos.slice(0, 5)}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.dark.brand}
            colors={[THEME.dark.brand]}
          />
        }
      />
    </SafeAreaView>
  );
}
