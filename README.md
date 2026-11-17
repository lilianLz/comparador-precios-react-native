# Comparador de precios

Aplicación móvil desarrollada para el Trabajo Práctico de Desarrollo de Aplicaciones Móviles.

Permite comparar el precio de productos en distintos negocios de barrio y calcular cuál es la opción más conveniente.

## Tecnologías utilizadas

- React Native
- Expo SDK 58
- JavaScript
- `useState` y `useMemo`
- `TextInput`, `Pressable` y botones
- Arrays y objetos locales
- Búsqueda, filtros y ordenamiento
- Cálculos de precios y totales

Los datos iniciales se encuentran en `data/seed.js`.

## Funcionalidades

- Buscar productos por nombre.
- Ordenar por nombre, menor precio o mayor precio.
- Filtrar según el negocio con el precio más bajo.
- Consultar precios y direcciones de los negocios.
- Calcular el precio más bajo y el ahorro posible.
- Ver el historial de precios y sus variaciones.
- Agregar, editar y eliminar productos.
- Actualizar precios por negocio.
- Agregar, editar y eliminar negocios.
- Comparar una compra completa entre negocios.
- Seleccionar varios productos en el carrito.
- Utilizar imágenes externas o dejar productos sin imagen.

## Instalación

Requisitos:

- Node.js
- npm
- Expo Go instalado en el celular

Desde la carpeta del proyecto:

```bash
npm install
npx expo start --go --tunnel
```

Luego se debe escanear el código QR con Expo Go. También se puede ejecutar con una conexión local usando:

```bash
npx expo start --go --lan
```


## Cómo probar la aplicación

1. En **Productos**, buscar un producto por nombre.
2. Probar los filtros por negocio y los distintos órdenes.
3. Seleccionar un producto para consultar sus precios.
4. Volver a tocar el producto para cerrar el detalle.
5. Actualizar un precio y revisar el historial.
6. Agregar un producto nuevo con precios válidos.
7. Editar y eliminar un producto.
8. En **Compra**, seleccionar varios productos y comparar los totales.
9. En **Negocios**, agregar, editar y eliminar negocios.
10. Verificar que la aplicación no permita eliminar el último negocio.

## Validaciones

- El nombre y la unidad del producto son obligatorios.
- Los precios deben ser numéricos y mayores que cero.
- Los campos de precio solo aceptan números.
- La imagen del producto es opcional.
- No se permiten negocios con nombres duplicados.
- Siempre debe quedar al menos un negocio para realizar comparaciones.

## Persistencia de datos

La aplicación utiliza `AsyncStorage` para guardar los datos localmente en el dispositivo.

Se persisten los productos, negocios, precios, historial de precios y productos seleccionados para la compra. Al iniciar la aplicación, se cargan los datos guardados; si es la primera ejecución, se utilizan los datos iniciales de `data/seed.js`.

La dependencia se instala con:

```bash
npx expo install @react-native-async-storage/async-storage
```

La persistencia es local y no requiere conexión con un servidor o una base de datos externa.

## Estructura principal

```text
comparador-precios/
├── App.js                  # Punto de entrada y pestañas principales
├── screens/                # Vistas principales de la aplicación
│   ├── ProductsScreen.js
│   ├── CartScreen.js
│   └── BusinessesScreen.js
├── components/             # Componentes reutilizables
│   ├── CommonComponents.js
│   └── ProductComponents.js
├── hooks/                  # Estado y operaciones de los datos
│   └── usePriceData.js
├── utils/                  # Formateos y cálculos
│   └── priceUtils.js
├── data/
│   └── seed.js              # Datos iniciales
├── styles.js               # Estilos compartidos
├── assets/
├── app.json
├── package-lock.json
├── package.json
└── README.md
```
