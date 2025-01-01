import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "@fontsource/figtree/700.css";
import "@fontsource/figtree/800.css";
import "@fontsource/figtree/900.css";
import { Provider } from "@/components/ui/provider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider>
            <App />
        </Provider>
    </StrictMode>
);
