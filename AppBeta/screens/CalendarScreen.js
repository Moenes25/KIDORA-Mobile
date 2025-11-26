// screens/CalendarScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios";

const SERVER_URL = "http://192.168.0.222:5000"; // change

export default function CalendarScreen() {
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const uid = "user123"; // same uid used in DailyRecordScreen

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${SERVER_URL}/api/daily-records`, { params: { uid } });
      const m = {};
      res.data.forEach(rec => {
        const d = new Date(rec.date);
        const key = d.toISOString().slice(0,10);
        m[key] = { marked: true, dotColor: "#6F42C1" };
      });
      setMarks(m);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <Calendar
        markedDates={marks}
        onDayPress={(day) => {
          // you can navigate to DailyRecord screen and filter by date
          alert("Selected: " + day.dateString);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 }
});
