import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { initialBusinesses, initialPriceHistory, initialProducts } from '../data/seed';

const STORAGE_KEY = 'comparador-precios-data';

export default function usePriceData() {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [products, setProducts] = useState(initialProducts);
  const [priceHistory, setPriceHistory] = useState(initialPriceHistory);
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0].id);
  const [cartIds, setCartIds] = useState([]);
  const [message, setMessage] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (!savedData || !isMounted) return;

        const parsedData = JSON.parse(savedData);
        if (parsedData.products) setProducts(parsedData.products);
        if (parsedData.businesses) setBusinesses(parsedData.businesses);
        if (parsedData.priceHistory) setPriceHistory(parsedData.priceHistory);
        if (parsedData.cartIds) setCartIds(parsedData.cartIds);
        if (parsedData.selectedProductId) setSelectedProductId(parsedData.selectedProductId);
      } catch (error) {
        console.warn('No se pudieron cargar los datos guardados.', error);
      } finally {
        if (isMounted) setIsHydrated(true);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const saveData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          businesses,
          products,
          priceHistory,
          cartIds,
          selectedProductId,
        }));
      } catch (error) {
        console.warn('No se pudieron guardar los datos.', error);
      }
    };

    saveData();
  }, [businesses, products, priceHistory, cartIds, selectedProductId, isHydrated]);

  const updateProductPrice = (productId, businessId, amount) => {
    const recordedAt = new Date().toISOString().slice(0, 10);

    setProducts((current) => current.map((product) => {
      if (product.id !== productId) return product;
      return {
        ...product,
        prices: {
          ...product.prices,
          [businessId]: { amount, updatedAt: recordedAt },
        },
      };
    }));

    setPriceHistory((current) => [...current, {
      id: `${productId}-${businessId}-${Date.now()}`,
      productId,
      businessId,
      amount,
      recordedAt,
    }]);
  };

  const addProduct = (product) => {
    const id = `product-${Date.now()}`;
    setProducts((current) => [...current, { ...product, id }]);
    setSelectedProductId(id);
  };

  const updateProduct = (productId, changes) => {
    setProducts((current) => current.map((product) =>
      product.id === productId ? { ...product, ...changes } : product,
    ));
  };

  const deleteProduct = (productId) => {
    setProducts((current) => current.filter((product) => product.id !== productId));
    setPriceHistory((current) => current.filter((entry) => entry.productId !== productId));
    setCartIds((current) => current.filter((id) => id !== productId));
    setSelectedProductId((current) => (current === productId ? '' : current));
  };

  const addBusiness = (business) => {
    setBusinesses((current) => [...current, { ...business, id: `business-${Date.now()}` }]);
  };

  const updateBusiness = (businessId, changes) => {
    setBusinesses((current) => current.map((business) =>
      business.id === businessId ? { ...business, ...changes } : business,
    ));
  };

  const deleteBusiness = (businessId) => {
    setBusinesses((current) => current.filter((business) => business.id !== businessId));
    setProducts((current) => current.map((product) => {
      const nextPrices = { ...product.prices };
      delete nextPrices[businessId];
      return { ...product, prices: nextPrices };
    }));
    setPriceHistory((current) => current.filter((entry) => entry.businessId !== businessId));
  };

  return {
    businesses,
    products,
    priceHistory,
    selectedProductId,
    setSelectedProductId,
    cartIds,
    setCartIds,
    message,
    setMessage,
    updateProductPrice,
    addProduct,
    updateProduct,
    deleteProduct,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    isHydrated,
  };
}
