import { createGlobalStyle } from 'styled-components'

export const theme = {
  colors: {
    primary: '#6C47FF',
    primaryDark: '#5035CC',
    secondary: '#00D4AA',
    bg: '#0D0D0D',
    bgCard: '#161616',
    bgLight: '#1E1E1E',
    border: '#2A2A2A',
    text: '#F0F0F0',
    textMuted: '#888888',
    success: '#00D4AA',
    warning: '#F5A623',
    danger: '#FF4D4D',
    white: '#FFFFFF',
  },
  fonts: {
    body: "'Inter', sans-serif",
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
  },
}

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    line-height: 1.6;
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg};
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
`
