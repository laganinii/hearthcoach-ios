# HearthCoach iOS — screenshot → advice (v1 slice)

From brief v4: no floating overlay, no ReplayKit Broadcast Extension.
Companion app only: pick a Battlegrounds screenshot → deterministic advice → local history.

Bundle ID: `com.laganinii.hearthcoach`  
Apple Team: Gaj Ducak `ZLM4K5RVQW`

```bash
npm install
python3 scripts/gen-icons.py
npx expo start
npx eas build --platform ios --profile production
npx eas submit --platform ios --latest
```

Box path: `/workspace/overnight-2026-09-28/apps/hearthcoach-ios/`
