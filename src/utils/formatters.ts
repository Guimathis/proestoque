import { Produto } from '../contexts/ProductsContext';

export function formatarPreco(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

export function getProdutosComEstoqueBaixo(produtos: Produto[]): Produto[] {
  return produtos.filter((p) => p.quantidade <= p.quantidadeMinima);
}

export function getValorTotalEstoque(produtos: Produto[]): number {
  return produtos.reduce((total, p) => total + p.preco * p.quantidade, 0);
}
