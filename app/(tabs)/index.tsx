import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleZonePress = (zoneName: string) => {
    // Por ahora solo mostraremos un console.log, luego implementaremos la navegación
    console.log(`Zona seleccionada: ${zoneName}`);
    // router.push(`/(tabs)/zones/${zoneName}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Valle Verde</Text>
          <Text style={styles.subtitle}>Sistema de Gestión</Text>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/(tabs)/reports')}
          >
            <Text style={styles.statTitle}>Ventas Hoy</Text>
            <Text style={styles.statValue}>$12,450</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/(tabs)/orders')}
          >
            <Text style={styles.statTitle}>Órdenes Activas</Text>
            <Text style={styles.statValue}>8</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zonas Activas</Text>
          <View style={styles.zoneList}>
            {[
              { name: 'Restaurante Principal', status: 'Abierto' },
              { name: 'Bar de Alberca', status: 'Abierto' },
              { name: 'Taquilla', status: 'Abierto' }
            ].map((zone, index) => (
              <TouchableOpacity
                key={index}
                style={styles.zoneCard}
                onPress={() => handleZonePress(zone.name)}
                activeOpacity={0.7}
              >
                <Text style={styles.zoneName}>{zone.name}</Text>
                <View style={[styles.statusIndicator, { backgroundColor: '#10b981' }]} />
                <Text style={styles.zoneStatus}>{zone.status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/orders/new')}
            >
              <Text style={styles.actionButtonText}>Nueva Orden</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/reports')}
            >
              <Text style={styles.actionButtonText}>Ver Reportes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/inventory')}
            >
              <Text style={styles.actionButtonText}>Inventario</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: Platform.select({ web: 'Inter_700Bold', default: 'Inter-Bold' }),
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
    fontFamily: Platform.select({ web: 'Inter_400Regular', default: 'Inter-Regular' }),
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        ':hover': {
          transform: 'translateY(-2px)',
        },
      },
    }),
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: Platform.select({ web: 'Inter_500Medium', default: 'Inter-Medium' }),
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 4,
    fontFamily: Platform.select({ web: 'Inter_700Bold', default: 'Inter-Bold' }),
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    fontFamily: Platform.select({ web: 'Inter_600SemiBold', default: 'Inter-SemiBold' }),
  },
  zoneList: {
    gap: 12,
  },
  zoneCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        ':hover': {
          transform: 'translateX(4px)',
        },
      },
    }),
  },
  zoneName: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: Platform.select({ web: 'Inter_500Medium', default: 'Inter-Medium' }),
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  zoneStatus: {
    fontSize: 14,
    color: '#10b981',
    fontFamily: Platform.select({ web: 'Inter_500Medium', default: 'Inter-Medium' }),
  },
  quickActions: {
    padding: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        ':hover': {
          backgroundColor: '#059669',
        },
      },
    }),
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({ web: 'Inter_600SemiBold', default: 'Inter-SemiBold' }),
  },
});