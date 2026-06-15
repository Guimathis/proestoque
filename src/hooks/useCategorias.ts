import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

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

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return { categorias, isLoading, error, refetch: fetchCategorias };
}
