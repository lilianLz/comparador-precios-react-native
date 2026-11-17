import { useState } from 'react';
import { MapPin, Pencil, Plus, Store, Trash2 } from 'lucide-react-native';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { ActionButton } from '../components/CommonComponents';
import styles from '../styles';

export default function BusinessesScreen({ businesses, products, addBusiness, updateBusiness, deleteBusiness }) {
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const startNew = () => { setEditingId('new'); setName(''); setAddress(''); setError(''); };
  const startEdit = (business) => { setEditingId(business.id); setName(business.name); setAddress(business.address); setError(''); };
  const saveBusiness = () => {
    const trimmedName = name.trim();
    if (!trimmedName) { setError('Ingresá el nombre del negocio.'); return; }
    if (businesses.some((business) => business.name.toLowerCase() === trimmedName.toLowerCase() && business.id !== editingId)) { setError('Ya existe un negocio con ese nombre.'); return; }
    if (editingId === 'new') addBusiness({ name: trimmedName, address: address.trim() }); else updateBusiness(editingId, { name: trimmedName, address: address.trim() });
    setEditingId(null); setError('');
  };
  const askDelete = (business) => { if (businesses.length <= 1) { setError('Debe quedar al menos un negocio para comparar precios.'); return; } deleteBusiness(business.id); setNotice(`${business.name} fue eliminado correctamente.`); setError(''); };

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}><View style={styles.screenHeading}><View style={styles.headingIcon}><Store size={21} color="#166534" strokeWidth={2.2} /></View><View><Text style={styles.sectionTitle}>Negocios</Text><Text style={styles.mutedText}>Administrá los negocios de la comparación.</Text></View></View>{editingId === null ? <ActionButton icon={Plus} label="Agregar negocio" onPress={startNew} /> : <View style={styles.card}><Text style={styles.cardTitle}>{editingId === 'new' ? 'Nuevo negocio' : 'Editar negocio'}</Text><TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre" /><TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Dirección" />{error !== '' && <Text style={styles.errorText}>{error}</Text>}<ActionButton label="Guardar negocio" onPress={saveBusiness} /><ActionButton label="Cancelar" onPress={() => setEditingId(null)} variant="secondary" /></View>}{notice !== '' && <Text style={styles.message}>{notice}</Text>}{editingId === null && error !== '' && <Text style={styles.errorText}>{error}</Text>}<View style={styles.list}>{businesses.map((business) => <View style={styles.card} key={business.id}><Text style={styles.productTitle}>{business.name}</Text><View style={styles.addressRow}><MapPin size={15} color="#5B6B62" strokeWidth={2} /><Text style={styles.mutedText}>{business.address || 'Sin dirección'}</Text></View><Text style={styles.businessProductCount}>{products.filter((product) => product.prices[business.id]?.amount != null).length} productos con precio</Text><View style={styles.businessActions}><ActionButton icon={Pencil} label="Editar" onPress={() => startEdit(business)} variant="secondary" /><ActionButton icon={Trash2} label="Eliminar" onPress={() => askDelete(business)} variant="danger" /></View></View>)}</View></ScrollView>;
}
