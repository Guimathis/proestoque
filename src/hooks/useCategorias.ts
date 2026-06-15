import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export type Categoria = {
  id: string;
  nome: string;
  descricao?: string;
};

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (err: any) {
      console.error('Failed to load categorias', err);
      setError(err.message || 'Erro ao carregar categorias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategorias();
    }
  }, [fetchCategorias, isAuthenticated]);

  return { categorias, isLoading, error, refetch: fetchCategorias };
}
