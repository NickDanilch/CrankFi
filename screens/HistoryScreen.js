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
    <View style={styles.item}>
      <View style={styles.itemRow}>
        <Text style={styles.itemPrimary}>{Number(item.distance).toFixed(2)} km</Text>
        <Text style={styles.itemSecondary}>{formatDate(item.date)}</Text>
      </View>
      <Text style={styles.itemMeta}>Time: {item.time}s</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride History</Text>
      <FlatList
        data={rides}
        keyExtractor={(_, index) => String(index)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.empty}>No rides yet</Text>}
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
  item: { paddingVertical: 12 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemPrimary: { fontSize: 16, fontWeight: "600" },
  itemSecondary: { fontSize: 12, color: "#6b7280" },
  itemMeta: { marginTop: 4, fontSize: 14, color: "#374151" },
  separator: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 },
  empty: { color: "#6b7280" },
});
