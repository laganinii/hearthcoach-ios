import { useCallback, useState } from 'react'
import { View, Text, StyleSheet, Pressable, Image, ScrollView, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link } from 'expo-router'
import { adviseFromScreenshotMeta, AdviceResult } from '../src/data/adviceEngine'

const HISTORY_KEY = 'hearthcoach_advice_v1'

export default function CoachHome() {
  const [uri, setUri] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const [advice, setAdvice] = useState<AdviceResult | null>(null)

  const pick = useCallback(async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 })
    if (res.canceled || !res.assets?.[0]) return
    const a = res.assets[0]
    setUri(a.uri)
    setFileName(a.fileName || a.uri.split('/').pop() || null)
    setDims({ w: a.width || 0, h: a.height || 0 })
    setAdvice(null)
  }, [])

  const run = useCallback(async () => {
    if (!uri) { Alert.alert('Pick a screenshot first'); return }
    const result = adviseFromScreenshotMeta({ fileName, width: dims?.w, height: dims?.h })
    setAdvice(result)
    const raw = await AsyncStorage.getItem(HISTORY_KEY)
    const prev = raw ? JSON.parse(raw) : []
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([{ ...result, id: `a-${Date.now()}`, at: new Date().toISOString(), uri }, ...prev].slice(0, 50)))
  }, [uri, fileName, dims])

  return (
    <ScrollView style={s.root} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
      <Text style={s.h1}>Screenshot → advice</Text>
      <Text style={s.sub}>v1 slice · no overlay · deterministic demo coach</Text>
      <Pressable style={s.btn} onPress={pick}><Text style={s.btnText}>Pick Battlegrounds screenshot</Text></Pressable>
      {uri ? <Image source={{ uri }} style={s.preview} resizeMode="contain" /> : <View style={s.ph}><Text style={{ color: '#666' }}>No screenshot yet</Text></View>}
      <Pressable style={[s.primary, !uri && { opacity: 0.5 }]} onPress={run} disabled={!uri}>
        <Text style={s.primaryText}>Get advice</Text>
      </Pressable>
      {advice ? (
        <View style={s.card}>
          <Text style={s.badge}>{advice.latencyMs} ms · {advice.phase} · risk {advice.risk}</Text>
          <Text style={s.headline}>{advice.headline}</Text>
          <Text style={s.action}>{advice.action}</Text>
          {advice.why.map((w, i) => <Text key={i} style={s.why}>• {w}</Text>)}
        </View>
      ) : null}
      <Link href="/history" asChild><Pressable style={{ marginTop: 20 }}><Text style={{ color: '#E85D2A' }}>Advice history →</Text></Pressable></Link>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0b0f' },
  h1: { color: '#fff', fontSize: 24, fontWeight: '800' },
  sub: { color: '#9ca3af', marginVertical: 8 },
  btn: { borderWidth: 1, borderColor: '#E85D2A', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 12 },
  btnText: { color: '#E85D2A', fontWeight: '700' },
  primary: { backgroundColor: '#E85D2A', borderRadius: 12, padding: 14, alignItems: 'center', marginVertical: 12 },
  primaryText: { color: '#fff', fontWeight: '800' },
  preview: { width: '100%', height: 200, borderRadius: 12, backgroundColor: '#15151c' },
  ph: { height: 140, borderRadius: 12, backgroundColor: '#15151c', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#15151c', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#2a2a35' },
  badge: { color: '#E85D2A', fontSize: 12, fontWeight: '700', marginBottom: 8 },
  headline: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  action: { color: '#e5e7eb', marginBottom: 8 },
  why: { color: '#9ca3af', marginTop: 4 },
})
