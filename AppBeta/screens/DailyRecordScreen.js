// screens/DailyRecordScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { normalize, wp, hp } from "../utils/responsive";

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
        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput value={form.date} onChangeText={(v) => setForm(s => ({...s, date: v}))} style={styles.input} />

        <Text style={styles.label}>Steps</Text>
        <TextInput keyboardType="numeric" value={form.steps} onChangeText={(v) => setForm(s => ({...s, steps: v}))} style={styles.input} />

        <Text style={styles.label}>Distance</Text>
        <TextInput keyboardType="numeric" value={form.distance} onChangeText={(v) => setForm(s => ({...s, distance: v}))} style={styles.input} />

        <Text style={styles.label}>Calories</Text>
        <TextInput keyboardType="numeric" value={form.calories} onChangeText={(v) => setForm(s => ({...s, calories: v}))} style={styles.input} />

        <Text style={styles.label}>Streak status</Text>
        <TextInput value={form.streak_status} onChangeText={(v) => setForm(s => ({...s, streak_status: v}))} style={styles.input} />

        <View style={styles.buttonRow}>
          <Button title={form.id ? "Update" : "Add"} onPress={saveRecord} />
          <Button title="Reset" onPress={resetForm} />
        </View>
      </View>

      <Text style={styles.recordsTitle}>Records</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item._id}
        refreshing={loading}
        onRefresh={fetchRecords}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => editRecord(item)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.recordDate}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.recordDetails}>Steps: {item.steps} • Distance: {item.distance} • Calories: {item.calories}</Text>
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
  container: { 
    flex: 1, 
    padding: wp(3) 
  },
  title: { 
    fontSize: normalize(22), 
    fontWeight: "700", 
    marginBottom: hp(1) 
  },
  form: { 
    backgroundColor: "#fafafa", 
    padding: wp(2.5), 
    borderRadius: normalize(8),
    marginBottom: hp(1.5)
  },
  label: {
    fontSize: normalize(14),
    fontWeight: "600",
    marginBottom: hp(0.5),
    marginTop: hp(0.8),
    color: "#333"
  },
  input: { 
    borderWidth: normalize(1), 
    borderColor: "#ddd", 
    borderRadius: normalize(6), 
    paddingHorizontal: wp(2), 
    height: hp(5), 
    marginBottom: hp(1),
    fontSize: normalize(15),
    color: "#000"
  },
  buttonRow: {
    flexDirection: "row", 
    gap: wp(2.5),
    marginTop: hp(1)
  },
  recordsTitle: {
    fontSize: normalize(16),
    fontWeight: "600",
    marginTop: hp(1.5),
    marginBottom: hp(0.8),
    color: "#333"
  },
  row: { 
    padding: wp(2.5), 
    borderBottomWidth: normalize(1), 
    borderColor: "#eee", 
    flexDirection: "row", 
    alignItems: "center",
    minHeight: hp(8)
  },
  recordDate: {
    fontSize: normalize(16),
    fontWeight: "600",
    marginBottom: hp(0.5),
    color: "#000"
  },
  recordDetails: {
    fontSize: normalize(13),
    color: "#666"
  }
});