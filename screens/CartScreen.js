import { useMemo } from 'react';
import { Check, ShoppingCart, X } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ActionButton } from '../components/CommonComponents';
import { formatPrice, getCartTotals } from '../utils/priceUtils';
import styles from '../styles';

export default function CartScreen({ products, businesses, cartIds, setCartIds }) {
  const selectedProducts = products.filter((product) => cartIds.includes(product.id));
  const totals = useMemo(() => getCartTotals(selectedProducts, businesses), [selectedProducts, businesses]);
  const bestComplete = totals.find((entry) => entry.missing === 0);
  const completeTotals = totals.filter((entry) => entry.missing === 0);
  const highestComplete = completeTotals[completeTotals.length - 1];
  const cartSaving = bestComplete && highestComplete ? highestComplete.total - bestComplete.total : 0;
  const toggleProduct = (productId) => setCartIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}><View style={styles.screenHeading}><View style={styles.headingIcon}><ShoppingCart size={21} color="#166534" strokeWidth={2.2} /></View><View><Text style={styles.sectionTitle}>Comparar una compra</Text><Text style={styles.mutedText}>Seleccioná productos y calculá el total.</Text></View></View><View style={styles.list}>{products.map((product) => { const selected = cartIds.includes(product.id); return <Pressable key={product.id} onPress={() => toggleProduct(product.id)} style={[styles.cartProduct, selected && styles.cartProductSelected]}><View style={[styles.checkbox, selected && styles.checkboxSelected]}>{selected && <Check size={16} color="#FFFFFF" strokeWidth={3} />}</View><Text style={styles.productName}>{product.name}</Text></Pressable>; })}</View><View style={styles.selectionSummary}><Text style={styles.selectionSummaryLabel}>Productos seleccionados</Text><Text style={styles.selectionSummaryValue}>{selectedProducts.length}</Text></View>{selectedProducts.length > 0 && <ActionButton icon={X} label="Limpiar selección" onPress={() => setCartIds([])} variant="secondary" />}{selectedProducts.length === 0 ? <Text style={styles.mutedText}>Seleccioná al menos un producto.</Text> : <View style={styles.card}><Text style={styles.cardTitle}>Totales por negocio</Text>{bestComplete && <View style={styles.lowestCard}><Text style={styles.lowestLabel}>Compra más barata</Text><Text style={styles.lowestBusiness}>{bestComplete.business.name}</Text><Text style={styles.lowestPrice}>{formatPrice(bestComplete.total)}</Text>{cartSaving > 0 && <Text style={styles.savingText}>Ahorrás {formatPrice(cartSaving)} frente a la opción más cara</Text>}</View>}{totals.map((entry) => <View style={styles.priceRow} key={entry.business.id}><View><Text style={styles.businessName}>{entry.business.name}</Text>{entry.missing > 0 && <Text style={styles.warningText}>{entry.missing} producto(s) sin precio</Text>}</View><Text style={styles.price}>{formatPrice(entry.total)}</Text></View>)}</View>}</ScrollView>;
}
