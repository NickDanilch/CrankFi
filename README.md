# RideToEarn

React Native/Expo app for tracking rides and earning tokens.

## Structure
- App.js
- screens/
  - RideScreen.js
  - HistoryScreen.js
  - WalletScreen.js
- utils/
  - storage.js

## Setup
1. Install dependencies

	Expo (recommended):
	
	npx expo install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage expo-location @expo/vector-icons
	

2. iOS permissions

	Add to app.json under expo.ios.infoPlist:
	

3. Run

	
	npx expo start
	

## Notes
- GPS distance computed via Haversine; positions polled via watchPositionAsync.
- Rides stored in AsyncStorage (newest first).
- Wallet tokens equal total km for now.
