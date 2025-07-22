import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
}

// Pobierz zapisany theme z localStorage lub użyj domyślnego
const savedTheme = localStorage.getItem('maf_theme_mode') as ThemeMode | null;
const initialState: ThemeState = {
  mode: savedTheme || 'light'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Zapisz do localStorage
      localStorage.setItem('maf_theme_mode', state.mode);
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      // Zapisz do localStorage
      localStorage.setItem('maf_theme_mode', state.mode);
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
