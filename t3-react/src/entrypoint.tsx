import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Modal from "./components/modal";
import Footer from "./components/footer";

/* specify the element as the react root element */
const rootElement = document.getElementById("react-root");
const root = createRoot(rootElement!); //! tells compiler that rootElement is not null


root.render(
    <StrictMode>
        <App />
    </StrictMode>
);