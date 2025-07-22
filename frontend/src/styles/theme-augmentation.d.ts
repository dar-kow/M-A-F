import '@mui/material/styles';
import '@mui/material/styles/createTheme';

// Rozszerzamy typy Material-UI o komponenty DataGrid
declare module '@mui/material/styles' {
  interface ComponentNameToClassKey {
    MuiDataGrid: any;
  }

  interface ComponentsPropsList {
    MuiDataGrid: any;
  }

  interface Components<Theme = unknown> {
    MuiDataGrid?: {
      defaultProps?: ComponentsPropsList['MuiDataGrid'];
      styleOverrides?: ComponentsOverrides<Theme>['MuiDataGrid'];
      variants?: ComponentsVariants['MuiDataGrid'];
    };
  }

  interface ComponentsOverrides {
    MuiDataGrid?: {
      root?: React.CSSProperties;
      [key: string]: React.CSSProperties | undefined;
    };
  }

  interface ComponentsVariants {
    MuiDataGrid?: Array<{
      props: Partial<ComponentsPropsList['MuiDataGrid']>;
      style: React.CSSProperties;
    }>;
  }
}
