import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { ShoppingCart, Store, Tag } from 'lucide-react-native';
import ProductsScreen from './screens/ProductsScreen';
import CartScreen from './screens/CartScreen';
import BusinessesScreen from './screens/BusinessesScreen';
import usePriceData from './hooks/usePriceData';
import styles from './styles';

function TabButton({ icon: Icon, label, active, onPress }) {
  return <Pressable onPress={onPress} style={[styles.tab, active && styles.activeTab]}><Icon size={17} color={active ? '#166534' : '#5B6B62'} strokeWidth={2.25} /><Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text></Pressable>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('productos');
  const data = usePriceData();

  return <View style={styles.app}><StatusBar style="light" /><View style={styles.topBar}><Text style={styles.appEyebrow}>COMPARADOR DE PRECIOS</Text><Text style={styles.appTitle}>Comparador de precios</Text><Text style={styles.appSubtitle}>Encontrá la mejor opción cerca tuyo</Text></View><View style={styles.mainContent}>{activeTab === 'productos' && <ProductsScreen {...data} />}{activeTab === 'compra' && <CartScreen {...data} />}{activeTab === 'negocios' && <BusinessesScreen {...data} />}</View><View style={styles.tabs}><TabButton icon={Tag} label="Productos" active={activeTab === 'productos'} onPress={() => setActiveTab('productos')} /><TabButton icon={ShoppingCart} label="Compra" active={activeTab === 'compra'} onPress={() => setActiveTab('compra')} /><TabButton icon={Store} label="Negocios" active={activeTab === 'negocios'} onPress={() => setActiveTab('negocios')} /></View></View>;
}
