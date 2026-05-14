import { Package } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

interface LogoProEstoqueProps {
    size?: "sm" | "md" | "lg";
}

export default function LogoProEstoque({ size = "md" }: LogoProEstoqueProps) {
    const sizeConfig = {
        sm: { container: "h-10 w-10", icon: 20 },
        md: { container: "h-16 w-16", icon: 32 },
        lg: { container: "h-24 w-24", icon: 48 },
    };

    const currentSize = sizeConfig[size];

    return (
        <View
            className={`${currentSize.container} items-center justify-center rounded-full bg-brand`}
        >
            <Package
                size={currentSize.icon}
                color="#000000"
                strokeWidth={2.5}
            />
        </View>
    );
}