import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { colors } from '@/constant/theme';
export const MUIThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: colors.primary,
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};  