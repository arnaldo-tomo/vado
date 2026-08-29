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
    // A aplicação é totalmente offline — não pede nenhuma permissão de runtime.
    permissions: [],
  },
  // OTA desligado: o Vado funciona sem rede e não contacta servidores.
  // Basta activar aqui quando houver um projecto EAS associado.
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
        backgroundColor: '#0B1F33',
        dark: { backgroundColor: '#08131F' },
        image: './assets/images/splash-icon.png',
        imageWidth: 140,
        resizeMode: 'contain',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
