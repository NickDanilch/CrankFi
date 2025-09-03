import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import { saveRide } from "../utils/storage";

export default function RideScreen() {
  const [isRiding, setIsRiding] = useState(false);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const watchSubscriptionRef = useRef(null);
  const lastCoordsRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (watchSubscriptionRef.current) {
        watchSubscriptionRef.current.remove();
        watchSubscriptionRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const startRide = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Location permission denied", "Enable permissions to track rides.");
      return;
    }

    setIsRiding(true);
    setStartTime(new Date());
    setDistance(0);
    setTime(0);
    lastCoordsRef.current = null;

    timerRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    watchSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 1000,
        distanceInterval: 5,
      },
      (position) => {
        const { latitude, longitude } = position.coords;
        const previous = lastCoordsRef.current;
        if (previous) {
          const deltaKm = haversineDistanceKm(previous, { latitude, longitude });
          if (deltaKm > 0) {
            setDistance((d) => d + deltaKm);
          }
        }
        lastCoordsRef.current = { latitude, longitude };
      }
    );
  };

  const stopRide = async () => {
    setIsRiding(false);

    if (watchSubscriptionRef.current) {
      watchSubscriptionRef.current.remove();
      watchSubscriptionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const ride = {
      distance,
      time,
      date: new Date().toISOString(),
      startedAt: startTime ? startTime.toISOString() : null,
    };
    await saveRide(ride);

    Alert.alert("Ride saved", `Tokens earned: ${distance.toFixed(2)}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ride Tracking</Text>
      <Text>Distance: {distance.toFixed(2)} km</Text>
      <Text>Time: {time}s</Text>
      {!isRiding ? (
        <Button title="Start Ride" onPress={startRide} />
      ) : (
        <Button title="Stop Ride" onPress={stopRide} />
      )}
    </View>
  );
}

function haversineDistanceKm(a, b) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const sinDlat = Math.sin(dLat / 2);
  const sinDlon = Math.sin(dLon / 2);
  const h =
    sinDlat * sinDlat +
    Math.cos(lat1) * Math.cos(lat2) * sinDlon * sinDlon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
