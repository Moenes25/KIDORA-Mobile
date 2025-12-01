import { View, Text, StyleSheet, FlatList } from "react-native";
import { useState } from "react";
import { Calendar } from "react-native-calendars";
import eventData from "../mock/eventData";

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const events = selectedDate ? eventData[selectedDate] || [] : [];

  return (
    <View style={styles.container}>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#2196f3" },
        }}
        theme={{
          selectedDayBackgroundColor: "#2196f3",
          todayTextColor: "#ff5722",
          arrowColor: "black",
        }}
      />

      <Text style={styles.eventTitle}>
        {selectedDate ? `Events on ${selectedDate}` : "Select a date"}
      </Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventName}>{item.title}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  eventTitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "600",
  },
  eventCard: {
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginBottom: 10,
  },
  eventName: { fontSize: 16, fontWeight: "600" },
  eventTime: { fontSize: 14, color: "#888" },
});
