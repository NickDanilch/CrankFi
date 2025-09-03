import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getRides } from "../utils/storage";

export default function WalletScreen() {
  const [tokens, setTokens] = useState(0);

  const calculateTokens = async () => {
    const rides = await getRides();
    const totalDistance = rides.reduce((sum, r) => sum + Number(r.distance || 0), 0);
    setTokens(totalDistance);
  };

  useFocusEffect(
    useCallback(() => {
      calculateTokens();
    }, [])
  );

  useEffect(() => {
    calculateTokens();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>
      <Text>RPM Tokens: {tokens.toFixed(2)}</Text>
      <Button title="Sync Wallet" onPress={() => alert("Sync demo")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
