import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produto, PRODUTOS_MOCK } from '@/src/data/mockData';

const STORAGE_KEY = '@proestoque_produtos';

type Action =
  | { type: 'LOAD'; payload: Produto[] }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string };

type State = {
  produtos: Produto[];
  isLoading: boolean;
};

const initialState: State = {
  produtos: [],
  isLoading: true,
};

function productsReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD':
      return { ...state, produtos: action.payload, isLoading: false };
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
  adicionarProduto: (produto: Omit<Produto, 'id' | 'ultimaMovimentacao'>) => Promise<void>;
  editarProduto: (produto: Produto) => Promise<void>;
  excluirProduto: (id: string) => Promise<void>;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, initialState);

  useEffect(() => {
    async function loadProducts() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          dispatch({ type: 'LOAD', payload: JSON.parse(stored) });
        } else {
          // Initialize with mock data if empty for the first time
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUTOS_MOCK));
          dispatch({ type: 'LOAD', payload: PRODUTOS_MOCK });
        }
      } catch (error) {
        console.error('Failed to load products', error);
        dispatch({ type: 'LOAD', payload: [] });
      }
    }
    loadProducts();
  }, []);

  const saveProducts = async (newProducts: Produto[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    } catch (error) {
      console.error('Failed to save products', error);
    }
  };

  const adicionarProduto = async (produtoData: Omit<Produto, 'id' | 'ultimaMovimentacao'>) => {
    const novoProduto: Produto = {
      ...produtoData,
      id: `prod_${Date.now()}`,
      ultimaMovimentacao: new Date().toISOString(),
    };
    dispatch({ type: 'ADD', payload: novoProduto });
    await saveProducts([novoProduto, ...state.produtos]);
  };

  const editarProduto = async (produto: Produto) => {
    dispatch({ type: 'UPDATE', payload: produto });
    const newProducts = state.produtos.map((p) => (p.id === produto.id ? produto : p));
    await saveProducts(newProducts);
  };

  const excluirProduto = async (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
    const newProducts = state.produtos.filter((p) => p.id !== id);
    await saveProducts(newProducts);
  };

  return (
    <ProductsContext.Provider
      value={{
        produtos: state.produtos,
        isLoading: state.isLoading,
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
