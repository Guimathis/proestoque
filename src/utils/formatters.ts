import { Produto } from '../contexts/ProductsContext';

export function formatarPreco(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

export function getProdutosComEstoqueBaixo(produtos: Produto[]): Produto[] {
  return produtos.filter((p) => {
    const min = (p as any).quantidadeMinima || 10; // Default to 10 for warning
    return p.quantidade < min;
  });
}

export function getValorTotalEstoque(produtos: Produto[]): number {
  return produtos.reduce((total, p) => total + p.preco * p.quantidade, 0);
}
