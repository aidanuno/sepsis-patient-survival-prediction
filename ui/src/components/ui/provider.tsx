"use client";

import { ChakraProvider, defineConfig } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { createSystem, defaultConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: {
          value: "Figtree, sans-serif",
        },
      },
      radii: {
        sm: { value: "6px" },
      },
      
    },
  
  }
})

const system = createSystem(defaultConfig, customConfig)

export function Provider(props: ColorModeProviderProps) {
    return (
        <ChakraProvider value={system}>
            <ColorModeProvider {...props} forcedTheme="light" />
        </ChakraProvider>
    );
}
