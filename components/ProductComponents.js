import { useState } from 'react';
import { History, Pencil, Plus, Tag, Trash2, TrendingDown } from 'lucide-react-native';
import { Text, TextInput, View } from 'react-native';
import { ActionButton, ChoiceChip, ProductImage } from './CommonComponents';
import { formatDate, formatPrice, getHighestPrice, getLowestPrice } from '../utils/priceUtils';
import styles from '../styles';

export function ProductDetail({ product, businesses, history, updateProductPrice, onEdit, onDelete, message, setMessage }) {
  const [selectedBusinessId, setSelectedBusinessId] = useState(businesses[0]?.id ?? '');
  const [priceInput, setPriceInput] = useState('');
  const lowest = getLowestPrice(product, businesses);
  const highest = getHighestPrice(product, businesses);
  const saving = lowest && highest ? highest.price - lowest.price : 0;
  const savingPercentage = highest?.price ? Math.round((saving / highest.price) * 100) : 0;
  const orderedHistory = [...history].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));

  const savePrice = () => {
    const amount = Number(priceInput);
    if (!selectedBusinessId || !amount || amount <= 0) {
      setMessage('Elegí un negocio e ingresá un precio mayor a cero.');
      return;
    }
    updateProductPrice(product.id, selectedBusinessId, amount);
    setPriceInput('');
    setMessage('Precio actualizado y agregado al historial.');
  };

  return (
    <View style={styles.card}>
      <ProductImage uri={product.imageUrl} style={styles.detailImage} />
      <View style={styles.detailHeader}><View style={styles.detailIcon}><Tag size={20} color="#166534" strokeWidth={2.2} /></View><View style={styles.detailHeadingText}><Text style={styles.productTitle}>{product.name}</Text><Text style={styles.mutedText}>{product.unit}</Text></View></View>
      <View style={styles.businessActions}><ActionButton icon={Pencil} label="Editar producto" onPress={onEdit} variant="secondary" /><ActionButton icon={Trash2} label="Eliminar" onPress={onDelete} variant="danger" /></View>
      <Text style={styles.mutedText}>Precios por negocio</Text>
      {businesses.map((business) => {
        const entry = product.prices[business.id];
        return <View style={styles.priceRow} key={business.id}><View><Text style={styles.businessName}>{business.name}</Text><Text style={styles.mutedText}>{business.address}</Text></View><Text style={styles.price}>{entry ? formatPrice(entry.amount) : 'Sin precio'}</Text></View>;
      })}
      {lowest && <View style={styles.lowestCard}><View style={styles.lowestHeader}><TrendingDown size={18} color="#BBF7D0" strokeWidth={2.25} /><Text style={styles.lowestLabel}>Precio más bajo</Text></View><Text style={styles.lowestBusiness}>{lowest.business.name}</Text><Text style={styles.lowestPrice}>{formatPrice(lowest.price)}</Text>{saving > 0 && <Text style={styles.savingText}>Ahorrás {formatPrice(saving)} frente al precio más alto ({savingPercentage}%)</Text>}</View>}
      <Text style={styles.cardTitle}>Actualizar precio</Text><Text style={styles.mutedText}>Seleccioná el negocio que querés actualizar.</Text>
      <View style={styles.choiceList}>{businesses.map((business) => <ChoiceChip key={business.id} label={business.name} selected={selectedBusinessId === business.id} onPress={() => setSelectedBusinessId(business.id)} />)}</View>
      <TextInput style={styles.input} value={priceInput} onChangeText={(value) => setPriceInput(value.replace(/[^0-9]/g, ''))} placeholder="Nuevo precio" keyboardType="numeric" />
      <ActionButton label="Guardar precio" onPress={savePrice} />{message !== '' && <Text style={styles.message}>{message}</Text>}
      <View style={styles.cardTitleRow}><History size={18} color="#166534" strokeWidth={2.25} /><Text style={styles.cardTitle}>Historial de precios</Text></View>
      {orderedHistory.length === 0 ? <Text style={styles.mutedText}>Todavía no hay cambios registrados.</Text> : orderedHistory.map((entry, index) => {
        const business = businesses.find((item) => item.id === entry.businessId);
        const previous = [...orderedHistory].slice(0, index).reverse().find((item) => item.businessId === entry.businessId);
        const difference = previous ? entry.amount - previous.amount : null;
        const changeLabel = difference === null ? 'Primer registro' : difference > 0 ? `↑ ${formatPrice(difference)}` : difference < 0 ? `↓ ${formatPrice(Math.abs(difference))}` : '→ Sin cambios';
        return <View style={styles.historyRow} key={entry.id}><View style={styles.historyMain}><Text style={styles.mutedText}>{formatDate(entry.recordedAt)}</Text><Text style={styles.businessName}>{business?.name ?? 'Negocio eliminado'}</Text></View><View style={styles.historyValue}><Text style={styles.price}>{formatPrice(entry.amount)}</Text><Text style={[styles.historyChange, difference > 0 && styles.historyUp, difference < 0 && styles.historyDown]}>{changeLabel}</Text></View></View>;
      })}
    </View>
  );
}

export function ProductForm({ product, businesses, onSave, onCancel }) {
  const [name, setName] = useState(product?.name ?? '');
  const [unit, setUnit] = useState(product?.unit ?? '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '');
  const [prices, setPrices] = useState(() => Object.fromEntries(businesses.map((business) => [business.id, String(product?.prices?.[business.id]?.amount ?? '')])));
  const [error, setError] = useState('');

  const save = () => {
    if (!name.trim() || !unit.trim()) { setError('Completá el nombre y la unidad del producto.'); return; }
    const nextPrices = {};
    for (const business of businesses) {
      const amount = Number(prices[business.id]);
      if (!amount || amount <= 0) { setError(`Ingresá un precio válido para ${business.name}.`); return; }
      nextPrices[business.id] = { amount, updatedAt: product?.prices?.[business.id]?.updatedAt ?? new Date().toISOString().slice(0, 10) };
    }
    onSave({ name: name.trim(), unit: unit.trim(), imageUrl: imageUrl.trim(), prices: nextPrices });
  };

  return <View style={styles.card}><View style={styles.cardTitleRow}><Plus size={18} color="#166534" strokeWidth={2.25} /><Text style={styles.cardTitle}>{product ? 'Editar producto' : 'Nuevo producto'}</Text></View><TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre del producto" /><TextInput style={styles.input} value={unit} onChangeText={setUnit} placeholder="Unidad (ej. 1 kg)" /><TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="URL de imagen del producto" autoCapitalize="none" /><Text style={styles.formLabel}>Precios por negocio</Text>{businesses.map((business) => <TextInput key={business.id} style={styles.input} value={prices[business.id]} onChangeText={(value) => setPrices((current) => ({ ...current, [business.id]: value.replace(/[^0-9]/g, '') }))} placeholder={`Precio en ${business.name}`} keyboardType="numeric" />)}{error !== '' && <Text style={styles.errorText}>{error}</Text>}<View style={styles.businessActions}><ActionButton label="Guardar" onPress={save} /><ActionButton label="Cancelar" onPress={onCancel} variant="secondary" /></View></View>;
}
