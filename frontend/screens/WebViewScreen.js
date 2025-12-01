import { WebView } from "react-native-webview";

export default function WebViewScreen() {
  return (
    <WebView
      source={{ uri: "https://maps.google.com" }}
      style={{ flex: 1 }}
    />
  );
}
