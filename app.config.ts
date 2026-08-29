import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Vado',
  slug: 'vado',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'vado',
  userInterfaceStyle: 'automatic',
  icon: './assets/images/icon.png',
  platforms: ['android'],
  backgroundColor: '#F7F9FB',
  android: {
    package: 'com.arnaldotomo.vado',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#0B1F33',
    },
    // A aplicação é totalmente offline. INTERNET é normal (não pede consentimento)
    // e é exigida pelo dev client; as de armazenamento são legadas e desnecessárias.
    permissions: [],
    blockedPermissions: [
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ],
  },
  extra: {
    eas: {
      // Escrito à mão: o EAS não consegue actualizar um app.config.ts dinâmico.
      projectId: 'c959312d-c844-4da7-9a6a-0a1dc4461b8d',
    },
  },
  // OTA desligado: o Vado funciona sem rede e não contacta servidores.
  // Para activar, ponha `enabled: true` e acrescente
  // url: 'https://u.expo.dev/c959312d-c844-4da7-9a6a-0a1dc4461b8d'.
  updates: {
    enabled: false,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-splash-screen',
      {
        // O lockup tem a palavra "Vado" em navy escuro, por isso o splash claro
        // usa o fundo claro da aplicação. Em modo escuro entra a versão com o
        // wordmark clareado, sobre o navy da marca.
        backgroundColor: '#F7F9FB',
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        dark: {
          backgroundColor: '#08131F',
          image: './assets/images/splash-icon-dark.png',
          imageWidth: 200,
          resizeMode: 'contain',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
