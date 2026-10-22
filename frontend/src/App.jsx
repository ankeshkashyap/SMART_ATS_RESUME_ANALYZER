import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css"
import "./index.css"
function App() {
    return (
        <ThemeProvider>
            <AppRoutes />
        </ThemeProvider>
    );

}

export default App;
