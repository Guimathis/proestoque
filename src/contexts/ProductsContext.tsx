import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { api } from '../services/api';
import { sendLowStockNotification } from '../services/notifications';
import { useAuth } from './AuthContext';

export type Produto = {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  quantidadeMinima: number;
  unidade: string;
  categoriaId: string;
  ultimaMovimentacao: string;
  observacao?: string;
  foto?: string;
  categoria?: {
    id: string;
    nome: string;
  };
};

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Produto[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string };

type State = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
};

const initialState: State = {
  produtos: [],
  isLoading: true,
  error: null,
};

function productsReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, produtos: action.payload, isLoading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD':
      return { ...state, produtos: [action.payload, ...state.produtos] };
    case 'UPDATE':
      return {
        ...state,
        produtos: state.produtos.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE':
      return {
        ...state,
        produtos: state.produtos.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
  carregarProdutos: () => Promise<void>;
  adicionarProduto: (produto: Omit<Produto, 'id' | 'ultimaMovimentacao' | 'categoria'>) => Promise<void>;
  editarProduto: (produto: Omit<Produto, 'categoria'>) => Promise<void>;
  excluirProduto: (id: string) => Promise<void>;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(productsReducer, initialState);

  const carregarProdutos = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const response = await api.get('/produtos');
      const produtosCarregados: Produto[] = response.data;
      dispatch({ type: 'LOAD_SUCCESS', payload: produtosCarregados });

      // Verificar estoque baixo e enviar notificação
      const produtosBaixos = produtosCarregados.filter((p) => {
        const min = p.quantidadeMinima || 10;
        return p.quantidade < min;
      });
      if (produtosBaixos.length > 0) {
        sendLowStockNotification(produtosBaixos);
      }
    } catch (error: any) {
      console.error('Failed to load products', error);
      dispatch({ type: 'LOAD_ERROR', payload: error.message || 'Erro ao carregar produtos' });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      carregarProdutos();
    }
  }, [carregarProdutos, isAuthenticated]);

  const adicionarProduto = async (produtoData: Omit<Produto, 'id' | 'ultimaMovimentacao' | 'categoria'>) => {
    try {
      const response = await api.post('/produtos', produtoData);
      dispatch({ type: 'ADD', payload: response.data });
    } catch (error) {
      console.error('Failed to add product', error);
      throw error;
    }
  };

  const editarProduto = async (produto: Omit<Produto, 'categoria'>) => {
    try {
      const response = await api.put(`/produtos/${produto.id}`, produto);
      dispatch({ type: 'UPDATE', payload: response.data });
    } catch (error) {
      console.error('Failed to update product', error);
      throw error;
    }
  };

  const excluirProduto = async (id: string) => {
    try {
      await api.delete(`/produtos/${id}`);
      dispatch({ type: 'DELETE', payload: id });
    } catch (error) {
      console.error('Failed to delete product', error);
      throw error;
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        ...state,
        carregarProdutos,
        adicionarProduto,
        editarProduto,
        excluirProduto,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
