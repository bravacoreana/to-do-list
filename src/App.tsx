import { ThemeProvider } from "styled-components";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "./atoms";
import { darkTheme, lightTheme } from "./style/theme";
import { GlobalStyle } from "./style/globalStyle";
import ToDo from "./ToDo";

function App() {
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <ToDo />
    </ThemeProvider>
  );
}

export default App;
