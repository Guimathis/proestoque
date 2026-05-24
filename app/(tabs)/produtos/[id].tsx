import { View, Text, ScrollView, TextInput, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useProducts } from '@/src/contexts/ProductsContext';
import { THEME } from '@/src/constants/theme';
import { ImagePickerField } from '@/src/components/ImagePickerField';
import { produtoSchema, ProdutoFormData } from '@/src/schemas/produtoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIAS_MOCK } from '@/src/data/mockData';
import { useEffect } from 'react';

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { produtos, editarProduto, excluirProduto } = useProducts();
  
  const produtoAtual = produtos.find(p => p.id === id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema) as any,
  });

  useEffect(() => {
    if (produtoAtual) {
      reset({
        nome: produtoAtual.nome,
        categoriaId: produtoAtual.categoriaId,
        quantidade: produtoAtual.quantidade,
        quantidadeMinima: produtoAtual.quantidadeMinima,
        preco: produtoAtual.preco,
        unidade: produtoAtual.unidade,
        observacao: '', // or if it had an observacao in type
        foto: produtoAtual.foto,
      });
    }
  }, [produtoAtual, reset]);

  const onSubmit = async (data: ProdutoFormData) => {
    if (!produtoAtual) return;
    await editarProduto({
      ...produtoAtual,
      ...data,
      ultimaMovimentacao: new Date().toISOString(), // Optional: update movement date
    });
    router.back();
  };

  const handleExcluir = () => {
    Alert.alert(
      "Excluir Produto",
      "Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            if (id) {
              await excluirProduto(id);
              router.back();
            }
          }
        }
      ]
    );
  };

  if (!produtoAtual) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-zinc-400">Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        
        <Controller
          control={control}
          name="foto"
          render={({ field: { onChange, value } }) => (
            <ImagePickerField value={value} onChange={onChange} error={errors.foto?.message} />
          )}
        />

        <View className="mb-4">
          <Text className="text-sm font-medium text-zinc-400 mb-2">Nome do produto *</Text>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`bg-zinc-900 border ${errors.nome ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 h-12 text-white`}
                placeholder="Ex: Feijão Carioca 1kg"
                placeholderTextColor="#71717a"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.nome && <Text className="text-xs font-medium text-red-500 mt-1">{errors.nome.message}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-zinc-400 mb-2">Categoria *</Text>
          <Controller
            control={control}
            name="categoriaId"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIAS_MOCK.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => onChange(cat.id)}
                    className={`px-4 py-2 rounded-full border ${value === cat.id ? 'bg-brand border-brand' : 'bg-zinc-900 border-zinc-800'}`}
                  >
                    <Text className={`text-sm ${value === cat.id ? 'text-white font-bold' : 'text-zinc-400'}`}>{cat.nome}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.categoriaId && <Text className="text-xs font-medium text-red-500 mt-1">{errors.categoriaId.message}</Text>}
        </View>

        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-zinc-400 mb-2">Quantidade *</Text>
            <Controller
              control={control}
              name="quantidade"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-zinc-900 border ${errors.quantidade ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 h-12 text-white`}
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value?.toString() || ''}
                />
              )}
            />
            {errors.quantidade && <Text className="text-xs font-medium text-red-500 mt-1">{errors.quantidade.message}</Text>}
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-zinc-400 mb-2">Qtd Mínima *</Text>
            <Controller
              control={control}
              name="quantidadeMinima"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-zinc-900 border ${errors.quantidadeMinima ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 h-12 text-white`}
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value?.toString() || ''}
                />
              )}
            />
            {errors.quantidadeMinima && <Text className="text-xs font-medium text-red-500 mt-1">{errors.quantidadeMinima.message}</Text>}
          </View>
        </View>

        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-zinc-400 mb-2">Preço (R$) *</Text>
            <Controller
              control={control}
              name="preco"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-zinc-900 border ${errors.preco ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 h-12 text-white`}
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value?.toString() || ''}
                />
              )}
            />
            {errors.preco && <Text className="text-xs font-medium text-red-500 mt-1">{errors.preco.message}</Text>}
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-zinc-400 mb-2">Unidade *</Text>
            <Controller
              control={control}
              name="unidade"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-zinc-900 border ${errors.unidade ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 h-12 text-white`}
                  placeholder="Ex: un, kg, cx"
                  placeholderTextColor="#71717a"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.unidade && <Text className="text-xs font-medium text-red-500 mt-1">{errors.unidade.message}</Text>}
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-sm font-medium text-zinc-400 mb-2">Observação (opcional)</Text>
          <Controller
            control={control}
            name="observacao"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 h-24 text-white"
                placeholder="Detalhes adicionais..."
                placeholderTextColor="#71717a"
                multiline
                textAlignVertical="top"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>

        <TouchableOpacity
          className={`h-14 rounded-full items-center justify-center mb-4 ${isSubmitting ? 'bg-brand/50' : 'bg-brand'}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text className="text-white font-bold text-lg">
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="h-14 rounded-full border border-red-900 bg-red-950/40 items-center justify-center mb-12"
          onPress={handleExcluir}
        >
          <Text className="text-red-500 font-bold text-lg">Excluir produto</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
