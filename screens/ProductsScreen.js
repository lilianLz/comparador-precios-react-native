import { useRef, useState } from 'react';
import { ArrowDownUp, ChevronRight, Plus, Search, Store, Tag, X } from 'lucide-react-native';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ActionButton, EmptyState, ProductImage, SortChip } from '../components/CommonComponents';
import { ProductDetail, ProductForm } from '../components/ProductComponents';
import { formatPrice, getLowestPrice } from '../utils/priceUtils';
import styles from '../styles';

export default function ProductsScreen({ products, businesses, priceHistory, selectedProductId, setSelectedProductId, updateProductPrice, addProduct, updateProduct, deleteProduct, message, setMessage }) {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('name');
  const [businessFilterId, setBusinessFilterId] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const scrollToDetailRef = useRef(false);
  const scrollViewRef = useRef(null);
  const openProductForm = (product = null) => { setEditingProduct(product); setShowProductForm(true); setTimeout(() => scrollViewRef.current?.scrollTo({ y: 175, animated: true }), 100); };
  const normalizedSearch = search.toLowerCase().trim();
  const sortedProducts = [...products.filter((product) => product.name.toLowerCase().includes(normalizedSearch) && (businessFilterId === 'all' || getLowestPrice(product, businesses)?.business.id === businessFilterId))].sort((a, b) => {
    const priceA = getLowestPrice(a, businesses)?.price ?? Number.POSITIVE_INFINITY;
    const priceB = getLowestPrice(b, businesses)?.price ?? Number.POSITIVE_INFINITY;
    if (sortOrder === 'lowest') return priceA - priceB;
    if (sortOrder === 'highest') return priceB - priceA;
    return a.name.localeCompare(b.name, 'es');
  });
  const selectedProduct = products.find((product) => product.id === selectedProductId);

  return <ScrollView ref={scrollViewRef} style={styles.screen} contentContainerStyle={styles.content}>
    <Text style={styles.sectionTitle}>Buscar producto</Text>
    <View style={styles.searchBox}><Search size={19} color="#5B6B62" strokeWidth={2} /><TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="Buscar por nombre..." placeholderTextColor="#8A978E" />{search.length > 0 && <Pressable onPress={() => setSearch('')} hitSlop={8}><X size={18} color="#5B6B62" strokeWidth={2} /></Pressable>}</View>
    <View style={styles.overviewCard}><View style={styles.overviewIcon}><Tag size={19} color="#166534" strokeWidth={2.2} /></View><View style={styles.overviewText}><Text style={styles.overviewTitle}>Tu lista de precios</Text><Text style={styles.overviewSubtitle}>{products.length} productos · {businesses.length} negocios</Text></View><View style={styles.overviewBadge}><Text style={styles.overviewBadgeText}>Local</Text></View></View>
    <ActionButton icon={Plus} label="Agregar producto" onPress={() => openProductForm()} />
    {showProductForm && <ProductForm product={editingProduct} businesses={businesses} onSave={(product) => { if (editingProduct) { updateProduct(editingProduct.id, product); setSelectedProductId(editingProduct.id); setMessage('Producto actualizado correctamente.'); } else { addProduct(product); setMessage('Producto agregado correctamente.'); } setShowProductForm(false); setEditingProduct(null); }} onCancel={() => { setShowProductForm(false); setEditingProduct(null); }} />}
    <View style={styles.sortHeader}><View style={styles.sortTitleRow}><ArrowDownUp size={16} color="#166534" strokeWidth={2.2} /><Text style={styles.sortTitle}>Ordenar productos</Text></View><View style={styles.sortOptions}><SortChip label="Nombre" selected={sortOrder === 'name'} onPress={() => setSortOrder('name')} /><SortChip label="Menor precio" selected={sortOrder === 'lowest'} onPress={() => setSortOrder('lowest')} /><SortChip label="Mayor precio" selected={sortOrder === 'highest'} onPress={() => setSortOrder('highest')} /></View></View>
    <View style={styles.sortHeader}><View style={styles.sortTitleRow}><Store size={16} color="#166534" strokeWidth={2.2} /><Text style={styles.sortTitle}>Filtrar por mejor negocio</Text></View><View style={styles.sortOptions}><SortChip label="Todos" selected={businessFilterId === 'all'} onPress={() => setBusinessFilterId('all')} />{businesses.map((business) => <SortChip key={business.id} label={business.name} selected={businessFilterId === business.id} onPress={() => setBusinessFilterId(business.id)} />)}</View></View>
    <Text style={styles.sectionTitle}>Lista de productos</Text>
    <View style={styles.list}>{sortedProducts.length === 0 ? <EmptyState icon={Search} title="No encontramos productos" description="Probá con otro nombre o limpiá los filtros." actionLabel="Limpiar búsqueda y filtros" onAction={() => { setSearch(''); setBusinessFilterId('all'); }} /> : sortedProducts.map((product) => { const lowest = getLowestPrice(product, businesses); return <Pressable onPress={() => { setMessage(''); if (selectedProductId === product.id) { setSelectedProductId(''); scrollToDetailRef.current = false; return; } setSelectedProductId(product.id); scrollToDetailRef.current = true; }} style={[styles.productRow, selectedProductId === product.id && styles.selectedProductRow]} key={product.id}><ProductImage uri={product.imageUrl} style={styles.thumbnail} /><View style={styles.productInfo}><Text style={styles.productName}>{product.name}</Text><Text style={styles.mutedText}>{product.unit}</Text>{lowest && <View style={styles.bestPriceBadge}><Text style={styles.bestPriceHint} numberOfLines={1}>Mejor precio · {lowest.business.name} · {formatPrice(lowest.price)}</Text></View>}</View><View style={styles.productAction}><Text style={styles.detailsHint}>Ver detalles</Text><ChevronRight size={17} color="#8A978E" strokeWidth={2} /></View></Pressable>; })}</View>
    {selectedProduct && <View onLayout={(event) => { if (!scrollToDetailRef.current) return; scrollToDetailRef.current = false; scrollViewRef.current?.scrollTo({ y: Math.max(0, event.nativeEvent.layout.y - 12), animated: true }); }}><ProductDetail product={selectedProduct} businesses={businesses} history={priceHistory.filter((entry) => entry.productId === selectedProduct.id)} updateProductPrice={updateProductPrice} onEdit={() => openProductForm(selectedProduct)} onDelete={() => { const deletedName = selectedProduct.name; deleteProduct(selectedProduct.id); setMessage(`${deletedName} fue eliminado correctamente.`); }} message={message} setMessage={setMessage} /></View>}
  </ScrollView>;
}
