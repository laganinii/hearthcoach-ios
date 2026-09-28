import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0b0b0f' },
          headerTintColor: '#E85D2A',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#0b0b0f' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'HearthCoach' }} />
        <Stack.Screen name="history" options={{ title: 'Advice history' }} />
      </Stack>
    </SafeAreaProvider>
  )
}
