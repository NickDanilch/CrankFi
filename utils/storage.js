import AsyncStorage from "@react-native-async-storage/async-storage";

const RIDES_KEY = "rides";

export const getRides = async () => {
  try {
    const raw = await AsyncStorage.getItem(RIDES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.log("Error loading rides", e);
    return [];
  }
};

export const saveRide = async (ride) => {
  try {
    const safeRide = {
      ...ride,
      distance: Number(ride?.distance || 0),
      time: Number(ride?.time || 0),
      date: ride?.date || new Date().toISOString(),
    };
    const existing = await getRides();
    const next = [safeRide, ...existing];
    await AsyncStorage.setItem(RIDES_KEY, JSON.stringify(next));
  } catch (e) {
    console.log("Error saving ride", e);
  }
};

export const clearRides = async () => {
  try {
    await AsyncStorage.removeItem(RIDES_KEY);
  } catch (e) {
    console.log("Error clearing rides", e);
  }
};

export const getTotalDistance = async () => {
  const rides = await getRides();
  return rides.reduce((sum, r) => sum + Number(r.distance || 0), 0);
};
