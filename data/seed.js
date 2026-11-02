const price = (amount, updatedAt) => ({ amount, updatedAt });

export const initialBusinesses = [
  { id: 'maria', name: 'Almacen La Esquina', address: 'Pasaje Los Tilos 184' },
  { id: 'norte', name: 'Maxi Ahorro 24', address: 'Av. Los Aromos 936' },
  { id: 'jose', name: 'Despensa El Hornero', address: 'Calle Las Heras 267' },
];

export const initialProducts = [
  {
    id: 'yerba',
    name: 'Yerba',
    unit: '1 kg',
    imageUrl: 'https://acdn-us.mitiendanube.com/stores/043/230/products/libre_clasica_500g_alta-328b1669bc2595514517545050359838-1024-1024.webp',
    prices: {
      maria: price(4800, '2026-10-28'),
      norte: price(5200, '2026-10-30'),
      jose: price(4500, '2026-10-31'),
    },
  },
  {
    id: 'leche',
    name: 'Leche',
    unit: '1 litro',
    imageUrl: 'https://carrefourar.vtexassets.com/arquivos/ids/834107-600-auto?v=639102220563070000&width=600&height=auto&aspect=true',
    prices: {
      maria: price(1500, '2026-10-29'),
      norte: price(1700, '2026-10-27'),
      jose: price(1600, '2026-10-31'),
    },
  },
  {
    id: 'pan',
    name: 'Pan',
    unit: '1 unidad',
    imageUrl: 'https://ardiaprod.vtexassets.com/arquivos/ids/366727-1200-auto?v=639095966615900000&width=1200&height=auto&aspect=true',
    prices: {
      maria: price(1800, '2026-10-26'),
      norte: price(2100, '2026-10-30'),
      jose: price(1950, '2026-10-29'),
    },
  },
  {
    id: 'azucar',
    name: 'Azucar',
    unit: '1 kg',
    imageUrl: 'https://www.casa-segal.com/wp-content/uploads/2019/03/azucar-kilo-ledesma-reposteria-mendoza-casa-segal-1-600x600.jpg',
    prices: {
      maria: price(1300, '2026-10-25'),
      norte: price(1450, '2026-10-28'),
      jose: price(1250, '2026-10-31'),
    },
  },
  {
    id: 'arroz',
    name: 'Arroz largo fino',
    unit: '1 kg',
    imageUrl: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/2290203_f.jpg',
    prices: {
      maria: price(1850, '2026-10-30'),
      norte: price(1990, '2026-10-29'),
      jose: price(1720, '2026-10-31'),
    },
  },
  {
    id: 'fideos',
    name: 'Fideos secos',
    unit: '500 g',
    imageUrl: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/2540786_f.jpg',
    prices: {
      maria: price(1150, '2026-10-27'),
      norte: price(1090, '2026-10-30'),
      jose: price(1250, '2026-10-28'),
    },
  },
  {
    id: 'aceite',
    name: 'Aceite de girasol',
    unit: '900 ml',
    imageUrl: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/2320094_f.jpg',
    prices: {
      maria: price(2900, '2026-10-29'),
      norte: price(3050, '2026-10-31'),
      jose: price(2780, '2026-10-30'),
    },
  },
  {
    id: 'huevos',
    name: 'Huevos',
    unit: '12 unidades',
    imageUrl: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3520015_f.jpg',
    prices: {
      maria: price(3350, '2026-10-26'),
      norte: price(3200, '2026-10-28'),
      jose: price(3490, '2026-10-31'),
    },
  },
  {
    id: 'cafe',
    name: 'Cafe molido',
    unit: '250 g',
    imageUrl: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/2030690_f.jpg',
    prices: {
      maria: price(4100, '2026-10-25'),
      norte: price(4350, '2026-10-30'),
      jose: price(3980, '2026-10-29'),
    },
  },
  {
    id: 'jabon',
    name: 'Jabon para ropa',
    unit: '800 g',
    imageUrl: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/2842106_f.jpg',
    prices: {
      maria: price(2650, '2026-10-28'),
      norte: price(2490, '2026-10-31'),
      jose: price(2800, '2026-10-27'),
    },
  },
];

export const initialPriceHistory = [
  { id: 'yerba-maria-1', productId: 'yerba', businessId: 'maria', amount: 4600, recordedAt: '2026-10-15' },
  { id: 'yerba-maria-2', productId: 'yerba', businessId: 'maria', amount: 4800, recordedAt: '2026-10-28' },
  { id: 'yerba-norte-1', productId: 'yerba', businessId: 'norte', amount: 5000, recordedAt: '2026-10-18' },
  { id: 'leche-maria-1', productId: 'leche', businessId: 'maria', amount: 1400, recordedAt: '2026-10-12' },
  { id: 'leche-maria-2', productId: 'leche', businessId: 'maria', amount: 1500, recordedAt: '2026-10-29' },
  { id: 'pan-norte-1', productId: 'pan', businessId: 'norte', amount: 2000, recordedAt: '2026-10-12' },
  { id: 'arroz-jose-1', productId: 'arroz', businessId: 'jose', amount: 1600, recordedAt: '2026-10-14' },
  { id: 'fideos-norte-1', productId: 'fideos', businessId: 'norte', amount: 990, recordedAt: '2026-10-16' },
  { id: 'aceite-maria-1', productId: 'aceite', businessId: 'maria', amount: 2700, recordedAt: '2026-10-17' },
  { id: 'huevos-norte-1', productId: 'huevos', businessId: 'norte', amount: 2990, recordedAt: '2026-10-18' },
  { id: 'cafe-jose-1', productId: 'cafe', businessId: 'jose', amount: 3700, recordedAt: '2026-10-19' },
  { id: 'jabon-norte-1', productId: 'jabon', businessId: 'norte', amount: 2350, recordedAt: '2026-10-20' },
];
