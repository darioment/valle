import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/users" options={{ title: 'Users' }} />
        <Stack.Screen name="(tabs)/orders" options={{ title: 'Orders' }} />
        <Stack.Screen name="(tabs)/reportes" options={{ title: 'Reportes' }} />
        <Stack.Screen name="(tabs)/configuracion" options={{ title: 'Configuración' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
