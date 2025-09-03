import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getRides } from "../utils/storage";

export default function HistoryScreen() {
  const [rides, setRides] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        const data = await getRides();
        if (active) setRides(data);
      };
      load();
      return () => {
        active = false;
      };
    }, [])
  );

  const renderItem = ({ item }) => (
    <Text>
      {formatDate(item.date)}: {Number(item.distance).toFixed(2)} km in {item.time}s
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride History</Text>
      <FlatList
        data={rides}
        keyExtractor={(_, index) => String(index)}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No rides yet</Text>}
      />
    </View>
  );
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
