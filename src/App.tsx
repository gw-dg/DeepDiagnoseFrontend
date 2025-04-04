import Homepage from "./components/Homepage";
import { ThemeProvider } from "next-themes";

function App() {
  return (
    <ThemeProvider>
      <Homepage />
    </ThemeProvider>
  );
}

export default App;
