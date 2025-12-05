// screens/DailyRecordScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";

const SERVER_URL = "http://192.168.0.222:5000"; // <-- change to your server

export default function DailyRecordScreen() {
  const [uid, setUid] = useState("user123"); // change or use login
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ id: null, date: new Date().toISOString().slice(0,10), steps: "", distance: "", calories: "", streak_status: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [uid]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${SERVER_URL}/api/daily-records`, { params: { uid } });
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch records");
    } finally { setLoading(false); }
  };

  const resetForm = () => setForm({ id: null, date: new Date().toISOString().slice(0,10), steps: "", distance: "", calories: "", streak_status: "" });

  const saveRecord = async () => {
    try {
      const payload = {
        uid,
        date: new Date(form.date),
        steps: Number(form.steps || 0),
        distance: Number(form.distance || 0),
        calories: Number(form.calories || 0),
        streak_status: form.streak_status || ""
      };

      if (form.id) {
        await axios.put(`${SERVER_URL}/api/daily-records/${form.id}`, payload);
      } else {
        await axios.post(`${SERVER_URL}/api/daily-records`, payload);
      }
      resetForm();
      fetchRecords();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save record");
    }
  };

  const editRecord = (rec) => {
    setForm({
      id: rec._id,
      date: new Date(rec.date).toISOString().slice(0,10),
      steps: String(rec.steps || ""),
      distance: String(rec.distance || ""),
      calories: String(rec.calories || ""),
      streak_status: rec.streak_status || ""
    });
  };

  const deleteRecord = async (id) => {
    Alert.alert("Confirm", "Delete this record?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try { await axios.delete(`${SERVER_URL}/api/daily-records/${id}`); fetchRecords(); }
        catch (err) { console.error(err); Alert.alert("Error", "Failed to delete"); }
      } }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Records</Text>

      <View style={styles.form}>
        <Text>Date (YYYY-MM-DD)</Text>
        <TextInput value={form.date} onChangeText={(v) => setForm(s => ({...s, date: v}))} style={styles.input} />

        <Text>Steps</Text>
        <TextInput keyboardType="numeric" value={form.steps} onChangeText={(v) => setForm(s => ({...s, steps: v}))} style={styles.input} />

        <Text>Distance</Text>
        <TextInput keyboardType="numeric" value={form.distance} onChangeText={(v) => setForm(s => ({...s, distance: v}))} style={styles.input} />

        <Text>Calories</Text>
        <TextInput keyboardType="numeric" value={form.calories} onChangeText={(v) => setForm(s => ({...s, calories: v}))} style={styles.input} />

        <Text>Streak status</Text>
        <TextInput value={form.streak_status} onChangeText={(v) => setForm(s => ({...s, streak_status: v}))} style={styles.input} />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button title={form.id ? "Update" : "Add"} onPress={saveRecord} />
          <Button title="Reset" onPress={resetForm} />
        </View>
      </View>

      <Text style={{ marginTop: 12, marginBottom: 6 }}>Records</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item._id}
        refreshing={loading}
        onRefresh={fetchRecords}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => editRecord(item)}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600" }}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text>Steps: {item.steps} • Distance: {item.distance} • Calories: {item.calories}</Text>
            </View>
            <View style={{ justifyContent: "center" }}>
              <Button title="Delete" color="#c00" onPress={() => deleteRecord(item._id)} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  form: { backgroundColor: "#fafafa", padding: 10, borderRadius: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, paddingHorizontal: 8, height: 40, marginBottom: 8 },
  row: { padding: 10, borderBottomWidth: 1, borderColor: "#eee", flexDirection: "row", alignItems: "center" }
});
