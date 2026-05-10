import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const featuredProducts = [
  {
    title: "Freelancer toolkit",
    price: "6,900 DZD",
    delivery: "Instant download",
    description: "Invoices, proposals, and social assets for solo operators.",
  },
  {
    title: "Arabic coding course",
    price: "12,000 DZD",
    delivery: "Course access",
    description: "Lessons, source files, and future update packs for students.",
  },
  {
    title: "Ramadan recipe ebook",
    price: "2,500 DZD",
    delivery: "PDF delivery",
    description: "Recipe content with printable extras and social promo copy.",
  },
];

const paymentOptions = ["CIB", "Edahabia", "BaridiMob support"];

const orderFlow = [
  "Buyer opens a product page",
  "Checkout collects contact details",
  "Payment confirmation unlocks delivery",
];

const nextSteps = [
  "Add buyer accounts and purchase history",
  "Connect local payment confirmation callbacks",
  "Unlock secure downloads and course access",
];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>DigiSouk DZ app</Text>
          <Text style={styles.title}>Digital products for Algerian buyers</Text>
          <Text style={styles.subtitle}>
            Browse a real starter catalog shaped around templates, courses, and
            downloadable packs with local payment expectations in mind.
          </Text>
        </View>

        <View style={styles.statsRow}>
          {[
            { value: "3", label: "Product types" },
            { value: "2", label: "Core payment rails" },
            { value: "1", label: "Order flow to mirror" },
          ].map((item) => (
            <View key={item.label} style={styles.statCard}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>Featured offers</Text>
          <Text style={styles.sectionTitle}>Start with fast digital wins</Text>
          {featuredProducts.map((product) => (
            <View key={product.title} style={styles.productCard}>
              <View style={styles.productHeader}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
              </View>
              <Text style={styles.deliveryTag}>{product.delivery}</Text>
              <Text style={styles.productDescription}>
                {product.description}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.checkoutCard}>
          <Text style={styles.sectionEyebrow}>Checkout direction</Text>
          <Text style={styles.sectionTitle}>Payment options to prioritize</Text>
          <View style={styles.pillRow}>
            {paymentOptions.map((option) => (
              <View key={option} style={styles.pill}>
                <Text style={styles.pillText}>{option}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.checkoutCopy}>
            The web app now includes a demo order flow. Keep the mobile app aligned
            so product browsing, checkout handoff, and delivery feel consistent.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>Purchase flow</Text>
          <Text style={styles.sectionTitle}>What the app should mirror next</Text>
          {orderFlow.map((step, index) => (
            <View key={step} style={styles.checklistItem}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.checklistText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>Build next</Text>
          <Text style={styles.sectionTitle}>What turns this into a real app</Text>
          {nextSteps.map((step) => (
            <View key={step} style={styles.checklistItem}>
              <View style={styles.checkDot} />
              <Text style={styles.checklistText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#08131b",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 20,
  },
  hero: {
    borderRadius: 28,
    backgroundColor: "#0d1f2b",
    padding: 24,
  },
  eyebrow: {
    color: "#74f0b0",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 10,
    color: "#f5fbf7",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 12,
    color: "#c3d4cb",
    fontSize: 15,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: "#122737",
    padding: 16,
  },
  statValue: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    marginTop: 6,
    color: "#b3c8bc",
    fontSize: 12,
    lineHeight: 18,
  },
  section: {
    borderRadius: 28,
    backgroundColor: "#f5f8f6",
    padding: 20,
  },
  sectionEyebrow: {
    color: "#0c754a",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sectionTitle: {
    marginTop: 8,
    color: "#102028",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  productCard: {
    marginTop: 16,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  productTitle: {
    flex: 1,
    color: "#102028",
    fontSize: 18,
    fontWeight: "700",
  },
  productPrice: {
    color: "#0c754a",
    fontSize: 16,
    fontWeight: "700",
  },
  productDescription: {
    marginTop: 10,
    color: "#475661",
    fontSize: 14,
    lineHeight: 22,
  },
  deliveryTag: {
    marginTop: 10,
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#e7f7ef",
    color: "#0c754a",
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  checkoutCard: {
    borderRadius: 28,
    backgroundColor: "#0f1f2b",
    padding: 20,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  pill: {
    borderRadius: 999,
    backgroundColor: "#173243",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pillText: {
    color: "#ebfff4",
    fontSize: 13,
    fontWeight: "600",
  },
  checkoutCopy: {
    marginTop: 16,
    color: "#c5d6cc",
    fontSize: 14,
    lineHeight: 23,
  },
  checklistItem: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkDot: {
    marginTop: 6,
    height: 10,
    width: 10,
    borderRadius: 999,
    backgroundColor: "#0c754a",
  },
  stepBadge: {
    alignItems: "center",
    justifyContent: "center",
    height: 24,
    width: 24,
    borderRadius: 999,
    backgroundColor: "#0c754a",
  },
  stepBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  checklistText: {
    flex: 1,
    color: "#24333b",
    fontSize: 14,
    lineHeight: 22,
  },
});
