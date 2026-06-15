import React from 'react';
import { View } from 'react-native';
import { Skeleton } from './Skeleton';

interface ProdutoSkeletonProps {
  count?: number;
}

function ProdutoSkeletonItem() {
  return (
    <View className="flex-row items-center gap-3 py-3 px-6 border-b border-zinc-800/50">
      {/* Ícone / foto */}
      <Skeleton width={48} height={48} borderRadius={12} />

      {/* Texto: nome + quantidade */}
      <View className="flex-1 gap-2">
        <Skeleton width="75%" height={14} borderRadius={4} />
        <Skeleton width="40%" height={12} borderRadius={4} />
      </View>

      {/* Badge de status */}
      <Skeleton width={56} height={22} borderRadius={6} />
    </View>
  );
}

export function ProdutoSkeleton({ count = 5 }: ProdutoSkeletonProps) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <ProdutoSkeletonItem key={i} />
      ))}
    </View>
  );
}
