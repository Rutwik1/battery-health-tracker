import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set title for the application
document.title = "Battery Health Visualization Dashboard";

createRoot(document.getElementById("root")!).render(<App />);
