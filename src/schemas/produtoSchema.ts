import { z } from 'zod';

export const produtoSchema = z.object({
  nome: z.string().min(1, 'O nome do produto é obrigatório'),
  categoriaId: z.string().min(1, 'A categoria é obrigatória'),
  quantidade: z.coerce.number({ message: 'Deve ser um número' }).min(0, 'Não pode ser negativo'),
  quantidadeMinima: z.coerce.number({ message: 'Deve ser um número' }).min(0, 'Não pode ser negativo'),
  preco: z.coerce.number({ message: 'Deve ser um número' }).min(0, 'O preço deve ser maior ou igual a zero'),
  unidade: z.string().min(1, 'A unidade é obrigatória'),
  observacao: z.string().optional(),
  foto: z.string().optional().nullable(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
