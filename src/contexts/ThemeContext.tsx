'use client';

import { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';
type PrimaryColor = 'indigo' | 'blue' | 'purple' | 'green' | 'orange' | 'red';

interface ThemeContextType {
    mode: ThemeMode;
    primaryColor: PrimaryColor;
    sidebarOpen: boolean;
    toggleMode: () => void;
    setPrimaryColor: (color: PrimaryColor) => void;
    toggleSidebar: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colorMap = {
    indigo: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
    blue: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },
    purple: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' },
    green: { main: '#10b981', light: '#34d399', dark: '#059669' },
    orange: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
    red: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>('light');
    const [primaryColor, setPrimaryColor] = useState<PrimaryColor>('indigo');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleMode = () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    const theme = useMemo(() => {
        const colors = colorMap[primaryColor];

        return createTheme({
            palette: {
                mode,
                primary: {
                    ...colors,
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#8b5cf6',
                    light: '#a78bfa',
                    dark: '#7c3aed',
                    contrastText: '#ffffff',
                },
                background: {
                    default: mode === 'light' ? '#f8fafc' : '#0f172a',
                    paper: mode === 'light' ? '#ffffff' : '#1e293b',
                },
                text: {
                    primary: mode === 'light' ? '#1e293b' : '#f8fafc',
                    secondary: mode === 'light' ? '#64748b' : '#94a3b8',
                },
            },
            typography: {
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                h1: { fontWeight: 700 },
                h2: { fontWeight: 700 },
                h3: { fontWeight: 600 },
                h4: { fontWeight: 600 },
                h5: { fontWeight: 600 },
                h6: { fontWeight: 600 },
                button: { fontWeight: 600, textTransform: 'none' },
            },
            shape: { borderRadius: 12 },
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 10,
                            padding: '8px 20px',
                            boxShadow: 'none',
                        },
                    },
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            borderRadius: 16,
                            backgroundImage: 'none',
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: { backgroundImage: 'none' },
                    },
                },
            },
        });
    }, [mode, primaryColor]);

    return (
        <ThemeContext.Provider
            value={{
                mode,
                primaryColor,
                sidebarOpen,
                toggleMode,
                setPrimaryColor,
                toggleSidebar,
            }}
        >
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
}
