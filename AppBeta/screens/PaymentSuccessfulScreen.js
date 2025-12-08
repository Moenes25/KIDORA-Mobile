import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function PaymentSuccessfulScreen({ visible, onClose }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Play animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.6)),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* GREEN CHECK ICON */}
          <View style={styles.iconWrapper}>
            <Feather name="check" size={60} color="white" />
          </View>

          {/* TEXT */}
          <Text style={styles.title}>Payment Successful</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: 260,
    backgroundColor: "white",
    paddingVertical: 35,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
  },

  iconWrapper: {
    backgroundColor: "#28a745",
    width: 95,
    height: 95,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#28a745",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#28a745",
    marginTop: 5,
  },
});
