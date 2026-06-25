import { Text } from '@/src/components/ui/text';
import {
  LayoutGrid,
  List as ListIcon,
  Package,
  Plus,
  Search
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, SectionList, StatusBar, TextInput, TouchableOpacity, View, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { useProducts, Produto } from '@/src/contexts/ProductsContext';
import { useCategorias } from '@/src/hooks/useCategorias';
import { THEME } from '@/src/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '@/src/components/Skeleton';
import { ProdutoSkeleton } from '@/src/components/ProdutoSkeleton';
import { ErrorView } from '@/src/components/ErrorView';

function getStatusBadge(p: Produto) {
  if (p.quantidade === 0) return { label: 'Sem estoque', color: 'bg-red-500/20', textColor: 'text-red-500' };
  // Default to 10 if not defined, since in the API it might not be present or we can hardcode for UI purposes
  const qtMin = (p as any).quantidadeMinima || 10;
  if (p.quantidade <= qtMin) return { label: 'Baixo', color: 'bg-amber-500/20', textColor: 'text-amber-500' };
  return { label: 'Normal', color: 'bg-brand/20', textColor: 'text-brand' };
}

export default function ProdutosScreen() {
  const router = useRouter();
  const { produtos, isLoading: isLoadingProdutos, error: errorProdutos, carregarProdutos } = useProducts();
  const { categorias, isLoading: isLoadingCategorias, error: errorCategorias, refetch: carregarCategorias } = useCategorias();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isGridView, setIsGridView] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([carregarProdutos(), carregarCategorias()]);
    setRefreshing(false);
  };

  const filteredProducts = useMemo(() => {
    return produtos.filter(p => {
      const matchesSearch = p.nome.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.categoriaId === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [produtos, search, activeCategory]);

  const groupedProducts = useMemo(() => {
    if (activeCategory !== 'all') {
      const cat = categorias.find(c => c.id === activeCategory);
      return [{
        title: cat ? cat.nome : 'Categoria',
        data: filteredProducts
      }];
    }

    return categorias.map(cat => ({
      title: cat.nome,
      data: filteredProducts.filter(p => p.categoriaId === cat.id)
    })).filter(g => g.data.length > 0);
  }, [filteredProducts, activeCategory, categorias]);

  const renderItem = ({ item }: { item: Produto }) => {
    const status = getStatusBadge(item);
    return (
      <TouchableOpacity
        className="flex-row items-center gap-3 py-3 px-6 border-b border-zinc-800/50"
        onPress={() => router.push(`/(tabs)/produtos/${item.id}`)}
      >
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
      </TouchableOpacity>
    );
  };

  const renderGridItem = ({ item }: { item: Produto }) => {
    const status = getStatusBadge(item);
    return (
      <TouchableOpacity
        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 m-2 max-w-[46%]"
        onPress={() => router.push(`/(tabs)/produtos/${item.id}`)}
      >
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 mb-3 overflow-hidden">
          {(item as any).foto ? (
            <Image source={{ uri: (item as any).foto }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          ) : (
            <Package size={22} color={THEME.dark.mutedForeground} />
          )}
        </View>
        <Text className="text-sm font-medium text-white mb-1" numberOfLines={1}>{item.nome}</Text>
        <Text className="text-xs text-zinc-400 mb-3">{item.quantidade} un.</Text>
        <View className={`px-2 py-1 rounded-md self-start ${status.color}`}>
          <Text className={`text-[10px] font-bold uppercase ${status.textColor}`}>{status.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title, data } }: any) => (
    <View className="bg-background px-6 py-3 flex-row justify-between items-center border-b border-zinc-800/50">
      <Text className="text-sm font-bold text-zinc-300 uppercase tracking-wider">{title}</Text>
      <Text className="text-xs text-zinc-500 font-medium">{data.length} itens</Text>
    </View>
  );

  const EmptyList = () => (
    <View className="items-center justify-center py-20">
      <Package size={48} color="#27272a" />
      <Text className="text-zinc-400 mt-4">Nenhum produto encontrado.</Text>
    </View>
  );

  if (errorProdutos || errorCategorias) {
    return <ErrorView message={errorProdutos || errorCategorias || 'Erro de rede.'} onRetry={onRefresh} />;
  }

  // Se for a primeira vez e estiver carregando
  if ((isLoadingProdutos || isLoadingCategorias) && produtos.length === 0 && categorias.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        {/* Skeletons para header + categorias */}
        <View className="px-6 pt-6 mt-4 pb-4">
          <Skeleton width={120} height={28} borderRadius={6} />
          <View className="flex-row gap-3 mt-4">
            <Skeleton width={72} height={32} borderRadius={16} />
            <Skeleton width={88} height={32} borderRadius={16} />
            <Skeleton width={64} height={32} borderRadius={16} />
          </View>
        </View>
        {/* Skeletons animados para produtos */}
        <ProdutoSkeleton count={6} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="px-6 pt-6 mt-4 pb-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-white">Produtos</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => setIsGridView(!isGridView)}
            className="h-12 w-12 bg-zinc-900 border border-zinc-800 rounded-full items-center justify-center"
          >
            {isGridView ? <ListIcon size={20} color="white" /> : <LayoutGrid size={20} color="white" />}
          </TouchableOpacity>
          <TouchableOpacity
            className="h-12 w-12 bg-brand rounded-full items-center justify-center"
            onPress={() => router.push('/(tabs)/produtos/novo')}
          >
            <Plus size={24} color={THEME.dark.brandForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View className="px-6 mb-4">
        <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-4 h-12">
          <Search size={20} color="#71717a" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder="Buscar produto..."
            placeholderTextColor="#71717a"
            autoCapitalize="none"
            autoCorrect={false}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Categories */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 mb-4">
          <TouchableOpacity
            onPress={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full mr-3 ${activeCategory === 'all' ? 'bg-brand' : 'bg-zinc-900 border border-zinc-800'}`}
          >
            <Text className={`text-sm font-semibold ${activeCategory === 'all' ? 'text-brand-foreground' : 'text-zinc-400'}`}>Todos</Text>
          </TouchableOpacity>
          {categorias.map(cat => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full mr-3 ${activeCategory === cat.id ? 'bg-brand' : 'bg-zinc-900 border border-zinc-800'}`}
            >
              <Text className={`text-sm font-semibold ${activeCategory === cat.id ? 'text-brand-foreground' : 'text-zinc-400'}`}>{cat.nome}</Text>
            </TouchableOpacity>
          ))}
          <View className="w-6" />
        </ScrollView>
      </View>

      {/* List / Grid */}
      {isGridView ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          renderItem={renderGridItem}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyList}
          key="grid-view"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />
          }
        />
      ) : (
        <SectionList
          sections={groupedProducts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyList}
          key="list-view"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 h-14 w-14 bg-brand rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/(tabs)/produtos/novo')}
        style={{ elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
      >
        <Plus size={28} color={THEME.dark.brandForeground} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
