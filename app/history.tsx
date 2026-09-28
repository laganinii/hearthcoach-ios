import { useCallback, useState } from 'react'
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from 'expo-router'

const HISTORY_KEY = 'hearthcoach_advice_v1'

type Item = {
  id: string
  at: string
  headline: string
  action: string
  phase: string
  risk: string
  latencyMs: number
}

export default function History() {
  const [items, setItems] = useState<Item[]>([])

  useFocusEffect(
    useCallback(() => {
      ;(async () => {
        const raw = await AsyncStorage.getItem(HISTORY_KEY)
        setItems(raw ? JSON.parse(raw) : [])
      })()
    }, [])
  )

  return (
    <View style={styles.root}>
      <FlatList
        data={items}
        keyExtractor={i => i.id}
        ListEmptyComponent={<Text style={styles.empty}>No advice yet. Run a screenshot on Home.</Text>}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.meta}>
              {new Date(item.at).toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })} · {item.phase} · {item.latencyMs} ms
            </Text>
            <Text style={styles.title}>{item.headline}</Text>
            <Text style={styles.action}>{item.action}</Text>
          </View>
        )}
      />
      {items.length > 0 ? (
        <Pressable
          style={styles.clear}
          onPress={async () => {
            await AsyncStorage.removeItem(HISTORY_KEY)
            setItems([])
          }}
        >
          <Text style={styles.clearText}>Clear history</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0b0f' },
  empty: { color: '#666', padding: 24 },
  card: {
    backgroundColor: '#15151c', borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#222',
  },
  meta: { color: '#E85D2A', fontSize: 11, marginBottom: 6 },
  title: { color: '#fff', fontWeight: '700', fontSize: 16 },
  action: { color: '#9ca3af', marginTop: 6, lineHeight: 20 },
  clear: { padding: 16, alignItems: 'center' },
  clearText: { color: '#888' },
})
