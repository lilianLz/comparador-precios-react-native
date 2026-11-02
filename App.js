import { useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowDownUp,
  Check,
  ChevronRight,
  History,
  MapPin,
  Pencil,
  Plus,
  Search,
  ShoppingCart,
  Store,
  Tag,
  Trash2,
  TrendingDown,
  X,
} from 'lucide-react-native';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { initialBusinesses, initialPriceHistory, initialProducts } from './data/seed';

function formatPrice(value) {
  return `$${value.toLocaleString('es-AR')}`;
}

function formatDate(value) {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function getLowestPrice(product, businesses) {
  const entries = businesses
    .map((business) => ({
      business,
      price: product.prices[business.id]?.amount ?? null,
    }))
    .filter((entry) => entry.price !== null);

  if (entries.length === 0) return null;
  return entries.reduce((lowest, current) =>
    current.price < lowest.price ? current : lowest,
  );
}

function getHighestPrice(product, businesses) {
  const entries = businesses
    .map((business) => ({
      business,
      price: product.prices[business.id]?.amount ?? null,
    }))
    .filter((entry) => entry.price !== null);

  if (entries.length === 0) return null;
  return entries.reduce((highest, current) =>
    current.price > highest.price ? current : highest,
  );
}

function getCartTotals(products, businesses) {
  return businesses
    .map((business) => {
      const prices = products.map((product) => product.prices[business.id]?.amount);
      const availablePrices = prices.filter((value) => value !== undefined);

      return {
        business,
        total: availablePrices.reduce((sum, value) => sum + value, 0),
        missing: products.length - availablePrices.length,
      };
    })
    .sort((a, b) => {
      if (a.missing !== b.missing) return a.missing - b.missing;
      return a.total - b.total;
    });
}

export default function App() {
  const [activeTab, setActiveTab] = useState('productos');
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [products, setProducts] = useState(initialProducts);
  const [priceHistory, setPriceHistory] = useState(initialPriceHistory);
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0].id);
  const [cartIds, setCartIds] = useState([]);
  const [message, setMessage] = useState('');

  const updateProductPrice = (productId, businessId, amount) => {
    const recordedAt = new Date().toISOString().slice(0, 10);

    setProducts((current) =>
      current.map((product) => {
        if (product.id !== productId) return product;
        return {
          ...product,
          prices: {
            ...product.prices,
            [businessId]: { amount, updatedAt: recordedAt },
          },
        };
      }),
    );

    setPriceHistory((current) => [
      ...current,
      {
        id: `${productId}-${businessId}-${Date.now()}`,
        productId,
        businessId,
        amount,
        recordedAt,
      },
    ]);
  };

  const addProduct = (product) => {
    const id = `product-${Date.now()}`;
    setProducts((current) => [...current, { ...product, id }]);
    setSelectedProductId(id);
  };

  const updateProduct = (productId, changes) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, ...changes } : product,
      ),
    );
  };

  const deleteProduct = (productId) => {
    setProducts((current) => current.filter((product) => product.id !== productId));
    setPriceHistory((current) => current.filter((entry) => entry.productId !== productId));
    setCartIds((current) => current.filter((id) => id !== productId));
    setSelectedProductId((current) => (current === productId ? '' : current));
  };

  const addBusiness = (business) => {
    setBusinesses((current) => [
      ...current,
      { ...business, id: `business-${Date.now()}` },
    ]);
  };

  const updateBusiness = (businessId, changes) => {
    setBusinesses((current) =>
      current.map((business) =>
        business.id === businessId ? { ...business, ...changes } : business,
      ),
    );
  };

  const deleteBusiness = (businessId) => {
    setBusinesses((current) => current.filter((business) => business.id !== businessId));
    setProducts((current) =>
      current.map((product) => {
        const nextPrices = { ...product.prices };
        delete nextPrices[businessId];
        return { ...product, prices: nextPrices };
      }),
    );
    setPriceHistory((current) => current.filter((entry) => entry.businessId !== businessId));
  };

  return (
    <View style={styles.app}>
      <StatusBar style="light" />
      <View style={styles.topBar}>
        <Text style={styles.appEyebrow}>COMPARADOR DE PRECIOS</Text>
        <Text style={styles.appTitle}>Comparador de precios</Text>
        <Text style={styles.appSubtitle}>Encontrá la mejor opción cerca tuyo</Text>
      </View>

      <View style={styles.mainContent}>
        {activeTab === 'productos' && (
          <ProductsTab
            products={products}
            businesses={businesses}
            priceHistory={priceHistory}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            updateProductPrice={updateProductPrice}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            message={message}
            setMessage={setMessage}
          />
        )}
        {activeTab === 'compra' && (
          <CartTab
            products={products}
            businesses={businesses}
            cartIds={cartIds}
            setCartIds={setCartIds}
          />
        )}
        {activeTab === 'negocios' && (
          <BusinessesTab
            businesses={businesses}
            products={products}
            addBusiness={addBusiness}
            updateBusiness={updateBusiness}
            deleteBusiness={deleteBusiness}
          />
        )}
      </View>

      <View style={styles.tabs}>
        <TabButton icon={Tag} label="Productos" active={activeTab === 'productos'} onPress={() => setActiveTab('productos')} />
        <TabButton icon={ShoppingCart} label="Compra" active={activeTab === 'compra'} onPress={() => setActiveTab('compra')} />
        <TabButton icon={Store} label="Negocios" active={activeTab === 'negocios'} onPress={() => setActiveTab('negocios')} />
      </View>
    </View>
  );
}

function TabButton({ icon: Icon, label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.activeTab]}>
      <Icon size={17} color={active ? '#166534' : '#5B6B62'} strokeWidth={2.25} />
      <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
    </Pressable>
  );
}

function ProductsTab({
  products,
  businesses,
  priceHistory,
  selectedProductId,
  setSelectedProductId,
  updateProductPrice,
  addProduct,
  updateProduct,
  deleteProduct,
  message,
  setMessage,
}) {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('name');
  const [businessFilterId, setBusinessFilterId] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const scrollToDetailRef = useRef(false);
  const openProductForm = (product = null) => {
    setEditingProduct(product);
    setShowProductForm(true);
    setTimeout(() => scrollViewRef.current?.scrollTo({ y: 175, animated: true }), 100);
  };
  const scrollViewRef = useRef(null);
  const normalizedSearch = search.toLowerCase().trim();
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(normalizedSearch);
    const lowest = getLowestPrice(product, businesses);
    const matchesBusiness =
      businessFilterId === 'all' || lowest?.business.id === businessFilterId;
    return matchesSearch && matchesBusiness;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = getLowestPrice(a, businesses)?.price ?? Number.POSITIVE_INFINITY;
    const priceB = getLowestPrice(b, businesses)?.price ?? Number.POSITIVE_INFINITY;
    if (sortOrder === 'lowest') {
      return priceA - priceB;
    }
    if (sortOrder === 'highest') {
      return priceB - priceA;
    }
    return a.name.localeCompare(b.name, 'es');
  });
  const selectedProduct = products.find((product) => product.id === selectedProductId);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.sectionTitle}>Buscar producto</Text>
      <View style={styles.searchBox}>
        <Search size={19} color="#5B6B62" strokeWidth={2} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nombre..."
          placeholderTextColor="#8A978E"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <X size={18} color="#5B6B62" strokeWidth={2} />
          </Pressable>
        )}
      </View>

      <View style={styles.overviewCard}>
        <View style={styles.overviewIcon}>
          <Tag size={19} color="#166534" strokeWidth={2.2} />
        </View>
        <View style={styles.overviewText}>
          <Text style={styles.overviewTitle}>Tu lista de precios</Text>
          <Text style={styles.overviewSubtitle}>
            {products.length} productos · {businesses.length} negocios
          </Text>
        </View>
        <View style={styles.overviewBadge}>
          <Text style={styles.overviewBadgeText}>Local</Text>
        </View>
      </View>

      <ActionButton
        icon={Plus}
        label="Agregar producto"
        onPress={() => openProductForm()}
      />

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          businesses={businesses}
          onSave={(product) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, product);
              setSelectedProductId(editingProduct.id);
              setMessage('Producto actualizado correctamente.');
            } else {
              addProduct(product);
              setMessage('Producto agregado correctamente.');
            }
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      <View style={styles.sortHeader}>
        <View style={styles.sortTitleRow}>
          <ArrowDownUp size={16} color="#166534" strokeWidth={2.2} />
          <Text style={styles.sortTitle}>Ordenar productos</Text>
        </View>
        <View style={styles.sortOptions}>
          <SortChip label="Nombre" selected={sortOrder === 'name'} onPress={() => setSortOrder('name')} />
          <SortChip label="Menor precio" selected={sortOrder === 'lowest'} onPress={() => setSortOrder('lowest')} />
          <SortChip label="Mayor precio" selected={sortOrder === 'highest'} onPress={() => setSortOrder('highest')} />
        </View>
      </View>

      <View style={styles.sortHeader}>
        <View style={styles.sortTitleRow}>
          <Store size={16} color="#166534" strokeWidth={2.2} />
          <Text style={styles.sortTitle}>Filtrar por mejor negocio</Text>
        </View>
        <View style={styles.sortOptions}>
          <SortChip
            label="Todos"
            selected={businessFilterId === 'all'}
            onPress={() => setBusinessFilterId('all')}
          />
          {businesses.map((business) => (
            <SortChip
              key={business.id}
              label={business.name}
              selected={businessFilterId === business.id}
              onPress={() => setBusinessFilterId(business.id)}
            />
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Lista de productos</Text>
      <View style={styles.list}>
        {sortedProducts.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No encontramos productos"
            description="Probá con otro nombre o limpiá los filtros."
            actionLabel="Limpiar búsqueda y filtros"
            onAction={() => {
              setSearch('');
              setBusinessFilterId('all');
            }}
          />
        ) : (
          sortedProducts.map((product) => {
            const lowest = getLowestPrice(product, businesses);
            return (
              <Pressable
                onPress={() => {
                  setMessage('');
                  if (selectedProductId === product.id) {
                    setSelectedProductId('');
                    scrollToDetailRef.current = false;
                    return;
                  }
                  setSelectedProductId(product.id);
                  scrollToDetailRef.current = true;
                }}
                style={[
                  styles.productRow,
                  selectedProductId === product.id && styles.selectedProductRow,
                ]}
                key={product.id}
              >
                <ProductImage uri={product.imageUrl} style={styles.thumbnail} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.mutedText}>{product.unit}</Text>
                  {lowest && (
                    <View style={styles.bestPriceBadge}>
                      <Text style={styles.bestPriceHint} numberOfLines={1}>
                        Mejor precio · {lowest.business.name} · {formatPrice(lowest.price)}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.productAction}>
                  <Text style={styles.detailsHint}>Ver detalles</Text>
                  <ChevronRight size={17} color="#8A978E" strokeWidth={2} />
                </View>
              </Pressable>
            );
          })
        )}
      </View>

      {selectedProduct && (
        <View
          onLayout={(event) => {
            if (!scrollToDetailRef.current) return;
            scrollToDetailRef.current = false;
            scrollViewRef.current?.scrollTo({
              y: Math.max(0, event.nativeEvent.layout.y - 12),
              animated: true,
            });
          }}
        >
          <ProductDetail
            product={selectedProduct}
            businesses={businesses}
            history={priceHistory.filter((entry) => entry.productId === selectedProduct.id)}
            updateProductPrice={updateProductPrice}
            onEdit={() => {
              openProductForm(selectedProduct);
            }}
            onDelete={() => {
              const deletedName = selectedProduct.name;
              deleteProduct(selectedProduct.id);
              setMessage(`${deletedName} fue eliminado correctamente.`);
            }}
            message={message}
            setMessage={setMessage}
          />
        </View>
      )}
    </ScrollView>
  );
}

function ProductDetail({ product, businesses, history, updateProductPrice, onEdit, onDelete, message, setMessage }) {
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
      <View style={styles.detailHeader}>
        <View style={styles.detailIcon}>
          <Tag size={20} color="#166534" strokeWidth={2.2} />
        </View>
        <View style={styles.detailHeadingText}>
          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.mutedText}>{product.unit}</Text>
        </View>
      </View>
      <View style={styles.businessActions}>
        <ActionButton icon={Pencil} label="Editar producto" onPress={onEdit} variant="secondary" />
        <ActionButton icon={Trash2} label="Eliminar" onPress={onDelete} variant="danger" />
      </View>
      <Text style={styles.mutedText}>Precios por negocio</Text>

      {businesses.map((business) => {
        const entry = product.prices[business.id];
        return (
          <View style={styles.priceRow} key={business.id}>
            <View>
              <Text style={styles.businessName}>{business.name}</Text>
              <Text style={styles.mutedText}>{business.address}</Text>
            </View>
            <Text style={styles.price}>{entry ? formatPrice(entry.amount) : 'Sin precio'}</Text>
          </View>
        );
      })}

      {lowest && (
        <View style={styles.lowestCard}>
          <View style={styles.lowestHeader}>
            <TrendingDown size={18} color="#BBF7D0" strokeWidth={2.25} />
            <Text style={styles.lowestLabel}>Precio más bajo</Text>
          </View>
          <Text style={styles.lowestBusiness}>{lowest.business.name}</Text>
          <Text style={styles.lowestPrice}>{formatPrice(lowest.price)}</Text>
          {saving > 0 && (
            <Text style={styles.savingText}>
              Ahorrás {formatPrice(saving)} frente al precio más alto ({savingPercentage}%)
            </Text>
          )}
        </View>
      )}

      <Text style={styles.cardTitle}>Actualizar precio</Text>
      <Text style={styles.mutedText}>Seleccioná el negocio que querés actualizar.</Text>
      <View style={styles.choiceList}>
        {businesses.map((business) => (
          <ChoiceChip
            key={business.id}
            label={business.name}
            selected={selectedBusinessId === business.id}
            onPress={() => setSelectedBusinessId(business.id)}
          />
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={priceInput}
        onChangeText={(value) => setPriceInput(value.replace(/[^0-9]/g, ''))}
        placeholder="Nuevo precio"
        keyboardType="numeric"
      />
      <ActionButton label="Guardar precio" onPress={savePrice} />
      {message !== '' && <Text style={styles.message}>{message}</Text>}

      <View style={styles.cardTitleRow}>
        <History size={18} color="#166534" strokeWidth={2.25} />
        <Text style={styles.cardTitle}>Historial de precios</Text>
      </View>
      {orderedHistory.length === 0 ? (
        <Text style={styles.mutedText}>Todavía no hay cambios registrados.</Text>
      ) : (
        orderedHistory.map((entry, index) => {
          const business = businesses.find((item) => item.id === entry.businessId);
          const previous = [...orderedHistory]
            .slice(0, index)
            .reverse()
            .find((item) => item.businessId === entry.businessId);
          const difference = previous ? entry.amount - previous.amount : null;
          const changeLabel =
            difference === null
              ? 'Primer registro'
              : difference > 0
                ? `↑ ${formatPrice(difference)}`
                : difference < 0
                  ? `↓ ${formatPrice(Math.abs(difference))}`
                  : '→ Sin cambios';
          return (
            <View style={styles.historyRow} key={entry.id}>
              <View style={styles.historyMain}>
                <Text style={styles.mutedText}>{formatDate(entry.recordedAt)}</Text>
                <Text style={styles.businessName}>{business?.name ?? 'Negocio eliminado'}</Text>
              </View>
              <View style={styles.historyValue}>
                <Text style={styles.price}>{formatPrice(entry.amount)}</Text>
                <Text
                  style={[
                    styles.historyChange,
                    difference > 0 && styles.historyUp,
                    difference < 0 && styles.historyDown,
                  ]}
                >
                  {changeLabel}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

function ProductForm({ product, businesses, onSave, onCancel }) {
  const [name, setName] = useState(product?.name ?? '');
  const [unit, setUnit] = useState(product?.unit ?? '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '');
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(
      businesses.map((business) => [business.id, String(product?.prices?.[business.id]?.amount ?? '')]),
    ),
  );
  const [error, setError] = useState('');

  const save = () => {
    if (!name.trim() || !unit.trim()) {
      setError('Completá el nombre y la unidad del producto.');
      return;
    }

    const nextPrices = {};
    for (const business of businesses) {
      const amount = Number(prices[business.id]);
      if (!amount || amount <= 0) {
        setError(`Ingresá un precio válido para ${business.name}.`);
        return;
      }
      nextPrices[business.id] = {
        amount,
        updatedAt: product?.prices?.[business.id]?.updatedAt ?? new Date().toISOString().slice(0, 10),
      };
    }

    onSave({ name: name.trim(), unit: unit.trim(), imageUrl: imageUrl.trim(), prices: nextPrices });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Plus size={18} color="#166534" strokeWidth={2.25} />
        <Text style={styles.cardTitle}>{product ? 'Editar producto' : 'Nuevo producto'}</Text>
      </View>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre del producto" />
      <TextInput style={styles.input} value={unit} onChangeText={setUnit} placeholder="Unidad (ej. 1 kg)" />
      <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="URL de imagen del producto" autoCapitalize="none" />
      <Text style={styles.formLabel}>Precios por negocio</Text>
      {businesses.map((business) => (
        <TextInput
          key={business.id}
          style={styles.input}
          value={prices[business.id]}
          onChangeText={(value) =>
            setPrices((current) => ({
              ...current,
              [business.id]: value.replace(/[^0-9]/g, ''),
            }))
          }
          placeholder={`Precio en ${business.name}`}
          keyboardType="numeric"
        />
      ))}
      {error !== '' && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.businessActions}>
        <ActionButton label="Guardar" onPress={save} />
        <ActionButton label="Cancelar" onPress={onCancel} variant="secondary" />
      </View>
    </View>
  );
}

function ProductImage({ uri, style }) {
  if (!uri) {
    return (
      <View style={[style, styles.imagePlaceholder]}>
        <Tag size={24} color="#73A47D" strokeWidth={2} />
        <Text style={styles.imagePlaceholderText}>Sin imagen</Text>
      </View>
    );
  }

  return <Image source={{ uri }} style={style} />;
}

function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Icon size={25} color="#73A47D" strokeWidth={2} />
      </View>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateText}>{description}</Text>
      {actionLabel && <ActionButton label={actionLabel} onPress={onAction} variant="secondary" />}
    </View>
  );
}

function CartTab({ products, businesses, cartIds, setCartIds }) {
  const selectedProducts = products.filter((product) => cartIds.includes(product.id));
  const totals = useMemo(
    () => getCartTotals(selectedProducts, businesses),
    [selectedProducts, businesses],
  );
  const bestComplete = totals.find((entry) => entry.missing === 0);
  const completeTotals = totals.filter((entry) => entry.missing === 0);
  const highestComplete = completeTotals[completeTotals.length - 1];
  const cartSaving = bestComplete && highestComplete
    ? highestComplete.total - bestComplete.total
    : 0;

  const toggleProduct = (productId) => {
    setCartIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.screenHeading}>
        <View style={styles.headingIcon}>
          <ShoppingCart size={21} color="#166534" strokeWidth={2.2} />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Comparar una compra</Text>
          <Text style={styles.mutedText}>Seleccioná productos y calculá el total.</Text>
        </View>
      </View>

      <View style={styles.list}>
        {products.map((product) => {
          const selected = cartIds.includes(product.id);
          return (
            <Pressable
              key={product.id}
              onPress={() => toggleProduct(product.id)}
              style={[styles.cartProduct, selected && styles.cartProductSelected]}
            >
              <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                {selected && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text style={styles.productName}>{product.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.selectionSummary}>
        <Text style={styles.selectionSummaryLabel}>Productos seleccionados</Text>
        <Text style={styles.selectionSummaryValue}>{selectedProducts.length}</Text>
      </View>
      {selectedProducts.length > 0 && (
        <ActionButton
          icon={X}
          label="Limpiar selección"
          onPress={() => setCartIds([])}
          variant="secondary"
        />
      )}

      {selectedProducts.length === 0 ? (
        <Text style={styles.mutedText}>Seleccioná al menos un producto.</Text>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Totales por negocio</Text>
          {bestComplete && (
            <View style={styles.lowestCard}>
              <Text style={styles.lowestLabel}>Compra más barata</Text>
              <Text style={styles.lowestBusiness}>{bestComplete.business.name}</Text>
              <Text style={styles.lowestPrice}>{formatPrice(bestComplete.total)}</Text>
              {cartSaving > 0 && (
                <Text style={styles.savingText}>
                  Ahorrás {formatPrice(cartSaving)} frente a la opción más cara
                </Text>
              )}
            </View>
          )}
          {totals.map((entry) => (
            <View style={styles.priceRow} key={entry.business.id}>
              <View>
                <Text style={styles.businessName}>{entry.business.name}</Text>
                {entry.missing > 0 && (
                  <Text style={styles.warningText}>{entry.missing} producto(s) sin precio</Text>
                )}
              </View>
              <Text style={styles.price}>{formatPrice(entry.total)}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function BusinessesTab({ businesses, products, addBusiness, updateBusiness, deleteBusiness }) {
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const startNew = () => {
    setEditingId('new');
    setName('');
    setAddress('');
    setError('');
  };

  const startEdit = (business) => {
    setEditingId(business.id);
    setName(business.name);
    setAddress(business.address);
    setError('');
  };

  const saveBusiness = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Ingresá el nombre del negocio.');
      return;
    }

    const duplicated = businesses.some(
      (business) => business.name.toLowerCase() === trimmedName.toLowerCase() && business.id !== editingId,
    );
    if (duplicated) {
      setError('Ya existe un negocio con ese nombre.');
      return;
    }

    if (editingId === 'new') {
      addBusiness({ name: trimmedName, address: address.trim() });
    } else {
      updateBusiness(editingId, { name: trimmedName, address: address.trim() });
    }

    setEditingId(null);
    setError('');
  };

  const askDelete = (business) => {
    if (businesses.length <= 1) {
      setError('Debe quedar al menos un negocio para comparar precios.');
      return;
    }
    deleteBusiness(business.id);
    setNotice(`${business.name} fue eliminado correctamente.`);
    setError('');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.screenHeading}>
        <View style={styles.headingIcon}>
          <Store size={21} color="#166534" strokeWidth={2.2} />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Negocios</Text>
          <Text style={styles.mutedText}>Administrá los negocios de la comparación.</Text>
        </View>
      </View>

      {editingId === null ? (
        <ActionButton icon={Plus} label="Agregar negocio" onPress={startNew} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{editingId === 'new' ? 'Nuevo negocio' : 'Editar negocio'}</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre" />
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Dirección" />
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          <ActionButton label="Guardar negocio" onPress={saveBusiness} />
          <ActionButton label="Cancelar" onPress={() => setEditingId(null)} variant="secondary" />
        </View>
      )}
      {notice !== '' && <Text style={styles.message}>{notice}</Text>}
      {editingId === null && error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.list}>
        {businesses.map((business) => (
          <View style={styles.card} key={business.id}>
            <Text style={styles.productTitle}>{business.name}</Text>
            <View style={styles.addressRow}>
              <MapPin size={15} color="#5B6B62" strokeWidth={2} />
              <Text style={styles.mutedText}>{business.address || 'Sin dirección'}</Text>
            </View>
            <Text style={styles.businessProductCount}>
              {products.filter((product) => product.prices[business.id]?.amount != null).length} productos con precio
            </Text>
            <View style={styles.businessActions}>
              <ActionButton icon={Pencil} label="Editar" onPress={() => startEdit(business)} variant="secondary" />
              <ActionButton icon={Trash2} label="Eliminar" onPress={() => askDelete(business)} variant="danger" />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function ActionButton({ icon: Icon, label, onPress, variant = 'primary' }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        variant === 'secondary' && styles.actionButtonSecondary,
        variant === 'danger' && styles.actionButtonDanger,
        pressed && styles.actionButtonPressed,
      ]}
    >
      {Icon && (
        <Icon
          size={16}
          color={variant === 'primary' ? '#FFFFFF' : variant === 'danger' ? '#B91C1C' : '#166534'}
          strokeWidth={2.3}
        />
      )}
      <Text
        style={[
          styles.actionButtonText,
          variant === 'secondary' && styles.actionButtonSecondaryText,
          variant === 'danger' && styles.actionButtonDangerText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SortChip({ label, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.sortChip, selected && styles.sortChipSelected]}>
      <Text style={[styles.sortChipText, selected && styles.sortChipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function ChoiceChip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choiceChip, selected && styles.choiceChipSelected]}
    >
      {selected && <Check size={15} color="#FFFFFF" strokeWidth={3} />}
      <Text style={[styles.choiceChipText, selected && styles.choiceChipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#F5F7F4' },
  topBar: { backgroundColor: '#166534', paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 },
  appEyebrow: { color: '#BBF7D0', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 7 },
  appTitle: { color: '#FFFFFF', fontSize: 27, fontWeight: '800', letterSpacing: -0.4 },
  appSubtitle: { color: '#DCFCE7', fontSize: 14, marginTop: 7 },
  mainContent: { flex: 1 },
  tabs: { backgroundColor: '#FFFFFF', borderTopColor: '#E3E8E1', borderTopWidth: 1, flexDirection: 'row', paddingBottom: 6, paddingHorizontal: 10, paddingTop: 8 },
  tab: { alignItems: 'center', borderRadius: 12, flex: 1, gap: 4, justifyContent: 'center', marginHorizontal: 3, paddingVertical: 10 },
  activeTab: { backgroundColor: '#DCFCE7' },
  tabText: { color: '#5B6B62', fontSize: 13, fontWeight: '700' },
  activeTabText: { color: '#166534' },
  screen: { flex: 1 },
  content: { alignSelf: 'center', maxWidth: 760, padding: 18, paddingBottom: 40, width: '100%', gap: 11 },
  sectionTitle: { color: '#14201A', fontSize: 19, fontWeight: '800', marginTop: 5 },
  input: { backgroundColor: '#FFFFFF', borderColor: '#E3E8E1', borderRadius: 13, borderWidth: 1, color: '#14201A', fontSize: 16, paddingHorizontal: 14, paddingVertical: 13 },
  searchBox: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E3E8E1', borderRadius: 13, borderWidth: 1, flexDirection: 'row', gap: 9, minHeight: 52, paddingHorizontal: 14 },
  searchInput: { color: '#14201A', flex: 1, fontSize: 16, minHeight: 50 },
  overviewCard: { alignItems: 'center', backgroundColor: '#EAF6EC', borderColor: '#D2E8D5', borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 11, marginTop: 3, padding: 13 },
  overviewIcon: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 11, height: 39, justifyContent: 'center', width: 39 },
  overviewText: { flex: 1, gap: 2 },
  overviewTitle: { color: '#14532D', fontSize: 14, fontWeight: '800' },
  overviewSubtitle: { color: '#5B6B62', fontSize: 13 },
  overviewBadge: { backgroundColor: '#166534', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5 },
  overviewBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  sortHeader: { gap: 8, marginTop: 2 },
  sortTitleRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  sortTitle: { color: '#5B6B62', fontSize: 13, fontWeight: '800' },
  sortOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  sortChip: { backgroundColor: '#FFFFFF', borderColor: '#D4DED5', borderRadius: 999, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 8 },
  sortChipSelected: { backgroundColor: '#166534', borderColor: '#166534' },
  sortChipText: { color: '#166534', fontSize: 12, fontWeight: '800' },
  sortChipTextSelected: { color: '#FFFFFF' },
  list: { gap: 10 },
  emptyState: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E3E8E1', borderRadius: 16, borderWidth: 1, gap: 8, padding: 24 },
  emptyStateIcon: { alignItems: 'center', backgroundColor: '#EAF6EC', borderRadius: 999, height: 52, justifyContent: 'center', width: 52 },
  emptyStateTitle: { color: '#14201A', fontSize: 16, fontWeight: '800', textAlign: 'center' },
  emptyStateText: { color: '#5B6B62', fontSize: 13, textAlign: 'center' },
  productRow: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E3E8E1', borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 12, padding: 11, shadowColor: '#14201A', shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  selectedProductRow: { backgroundColor: '#F0FAF1', borderColor: '#79B985', borderWidth: 1.5 },
  thumbnail: { backgroundColor: '#DCFCE7', borderRadius: 12, height: 64, width: 64 },
  imagePlaceholder: { alignItems: 'center', backgroundColor: '#EAF6EC', justifyContent: 'center' },
  imagePlaceholderText: { color: '#5B6B62', fontSize: 9, fontWeight: '700', marginTop: 2 },
  productInfo: { flex: 1, gap: 3 },
  productAction: { alignItems: 'center', flexDirection: 'row', gap: 3 },
  detailsHint: { color: '#5B6B62', fontSize: 11, fontWeight: '700' },
  bestPriceBadge: { alignSelf: 'flex-start', backgroundColor: '#EAF6EC', borderRadius: 999, marginTop: 3, paddingHorizontal: 7, paddingVertical: 3 },
  bestPriceHint: { color: '#166534', fontSize: 11, fontWeight: '800' },
  detailImage: { backgroundColor: '#DCFCE7', borderRadius: 14, height: 150, width: '100%' },
  detailHeader: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  detailIcon: { alignItems: 'center', backgroundColor: '#DCFCE7', borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  detailHeadingText: { flex: 1, gap: 2 },
  screenHeading: { alignItems: 'center', flexDirection: 'row', gap: 11, marginBottom: 3 },
  headingIcon: { alignItems: 'center', backgroundColor: '#DCFCE7', borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  productName: { color: '#14201A', fontSize: 16, fontWeight: '800' },
  mutedText: { color: '#5B6B62', fontSize: 14 },
  card: { backgroundColor: '#FFFFFF', borderColor: '#E3E8E1', borderRadius: 18, borderWidth: 1, gap: 10, marginTop: 9, padding: 17, shadowColor: '#14201A', shadowOffset: { height: 4, width: 0 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  productTitle: { color: '#14201A', fontSize: 23, fontWeight: '800' },
  cardTitle: { color: '#14201A', fontSize: 17, fontWeight: '800', marginTop: 7 },
  formLabel: { color: '#5B6B62', fontSize: 13, fontWeight: '800', marginTop: 2 },
  priceRow: { alignItems: 'center', borderBottomColor: '#E3E8E1', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11 },
  businessName: { color: '#14201A', fontSize: 15, fontWeight: '700' },
  price: { color: '#166534', fontSize: 16, fontWeight: '800' },
  lowestCard: { backgroundColor: '#166534', borderRadius: 15, marginTop: 8, padding: 16 },
  lowestHeader: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  lowestLabel: { color: '#BBF7D0', fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  lowestBusiness: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginTop: 4 },
  lowestPrice: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', marginTop: 2 },
  savingText: { color: '#DCFCE7', fontSize: 13, fontWeight: '700', lineHeight: 19, marginTop: 6 },
  choiceList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choiceChip: { alignItems: 'center', backgroundColor: '#F5F7F4', borderColor: '#D4DED5', borderRadius: 999, borderWidth: 1, flexDirection: 'row', gap: 5, paddingHorizontal: 12, paddingVertical: 9 },
  choiceChipSelected: { backgroundColor: '#166534', borderColor: '#166534' },
  choiceChipText: { color: '#166534', fontSize: 13, fontWeight: '800' },
  choiceChipTextSelected: { color: '#FFFFFF' },
  message: { color: '#166534', fontSize: 14, fontWeight: '700' },
  historyRow: { alignItems: 'center', borderBottomColor: '#E3E8E1', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9 },
  historyMain: { flex: 1, gap: 2 },
  historyValue: { alignItems: 'flex-end', gap: 2 },
  historyChange: { color: '#8A978E', fontSize: 11, fontWeight: '800' },
  historyUp: { color: '#B45309' },
  historyDown: { color: '#166534' },
  cardTitleRow: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  cartProduct: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E3E8E1', borderRadius: 13, borderWidth: 1, flexDirection: 'row', gap: 12, padding: 14 },
  cartProductSelected: { backgroundColor: '#DCFCE7', borderColor: '#166534' },
  checkbox: { alignItems: 'center', borderColor: '#A8B5AC', borderRadius: 6, borderWidth: 2, color: '#166534', fontSize: 18, height: 25, textAlign: 'center', width: 25 },
  checkboxSelected: { backgroundColor: '#166534', borderColor: '#166534' },
  warningText: { color: '#B45309', fontSize: 12, marginTop: 3 },
  selectionSummary: { alignItems: 'center', backgroundColor: '#EAF6EC', borderColor: '#D2E8D5', borderRadius: 12, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 11 },
  selectionSummaryLabel: { color: '#166534', fontSize: 13, fontWeight: '700' },
  selectionSummaryValue: { alignItems: 'center', backgroundColor: '#166534', borderRadius: 999, color: '#FFFFFF', fontSize: 13, fontWeight: '800', minWidth: 27, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 4, textAlign: 'center' },
  businessActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  businessProductCount: { color: '#166534', fontSize: 13, fontWeight: '800', marginTop: 5 },
  addressRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  errorText: { color: '#B91C1C', fontSize: 14 },
  actionButton: { alignItems: 'center', backgroundColor: '#166534', borderRadius: 10, flexDirection: 'row', gap: 6, justifyContent: 'center', minHeight: 42, paddingHorizontal: 13, paddingVertical: 9 },
  actionButtonSecondary: { backgroundColor: '#F5F7F4', borderColor: '#D4DED5', borderWidth: 1 },
  actionButtonDanger: { backgroundColor: '#FEE2E2', borderColor: '#FECACA', borderWidth: 1 },
  actionButtonPressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  actionButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', textAlign: 'center' },
  actionButtonSecondaryText: { color: '#166534' },
  actionButtonDangerText: { color: '#B91C1C' },
});
