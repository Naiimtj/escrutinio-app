# Sistema de Escrutinio / Vote Counting System

Una aplicación web responsive bilingüe (Español/Inglés) para gestionar el proceso de escrutinio de votaciones con diseño minimalista y navegación por URL.

## 🚀 Características

- **Página de Inicio**: Bienvenida con diseño minimalista y descripción del proceso
- **Multiidioma**: Soporte completo para Español e Inglés con menú desplegable
- **Navegación por Rutas**: Cada paso tiene su propia URL (react-router-dom)
- **Header Consistente**: Sistema de navegación con cambio de idioma en todas las páginas
- **4 Pasos Intuitivos**:
  1. Carga de lista de votantes desde Excel (`/step1`)
  2. Configuración del escrutinio (`/step2`)
  3. Registro de papeletas con búsqueda inteligente (`/step3`)
  4. Resultados y exportación a PDF (`/step4`)
- **Almacenamiento Local**: Todos los datos se guardan en localStorage con expiración de 2 días
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Exportación PDF**: Genera informes detallados con estadísticas y resultados
- **Página 404**: Manejo elegante de rutas no encontradas

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio o navegar a la carpeta del proyecto:

```bash
cd escrutinio-app
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

4. Abrir en el navegador:

```
http://localhost:5173
```

## 📱 Uso de la Aplicación

### Página de Inicio (`/`)

La aplicación comienza con una página de bienvenida que incluye:

- Descripción general del sistema
- Características principales
- Resumen del proceso de 4 pasos
- Botón para comenzar el escrutinio

### Paso 1: Cargar Lista de Votantes (`/step1`)

- Subir un archivo Excel (.xlsx o .xls) con las siguientes columnas:
  - **Nombre**: Nombre del votante (`/step2`)
  - **Apellido1**: Primer apellido
  - **Apellido2**: Segundo apellido
  - **Localidad**: Ubicación del votante

- Puedes descargar un archivo de ejemplo haciendo clic en el botón "Descargar ejemplo"
- Una vez procesado, se muestra el número total de personas y avanza automáticamente al siguiente paso

### Paso 2: Configuración del Escrutinio

Completar el formulario con: (`/step3`)

- Número de delegados
- Número del área
- Número de votos por papeleta
- Número de escrutadores
- Nombres de los escrutadores

### Paso 3: Registro de Papeletas

- El número de papeleta se incrementa automáticamente
- Para cada voto:
  - Buscar y seleccionar a una persona de la lista de votantes
  - Marcar como "Voto nulo" si es un nombre no válido
- **Botones disponibles**:
  - **Siguiente papeleta**: Guarda la papeleta actual (con confirmación)
  - **Papeleta anterior**: Permite editar la última papeleta registrada
  - **Papeleta nula**: Registra una papeleta nula con razones predefinidas
  - **Finalizar**: Muestra resumen y avanza a resultados

### Paso 4: Resultados (`/step4`)

Visualiza:

- **Estadísticas completas**:
  - Total de votantes en lista
  - Total de papeletas registradas
  - Papeletas válidas/nulas
  - Nombres no válidos
  - Total de votos posibles/válidos
- **Tabla de resultados** ordenada de mayor a menor número de votos
- **Exportar a PDF**: Descarga un informe completo
- **Volver a votación**: Permite agregar más papeletas sin perder datos

## 🛠️ Tecnologías Utilizadas

- **React 19**: Framework de UI
- **React Router DOM 7**: Navegación y rutas
- **Vite 7**: Build tool y dev server
- **Tailwind CSS 4**: Framework de estilos
- **react-hook-form**: Gestión de formularios
- **react-i18next**: Internacionalización
- **ExcelJS**: Procesamiento de archivos Excel
- **jsPDF**: Generación de PDFs
- **html2canvas**: Captura de canvas para PDFs
- **uuid**: Generación de IDs únicos

## 📁 Estructura del Proyecto

```
src/
├── App.jsx                  # Configuración de rutas principal
├── main.jsx                 # Punto de entrada
├── i18n.js                  # Configuración de i18n
├── components/              # Componentes reutilizables
│   ├── Header.jsx          # Header con selector de idioma
│   ├── Step1.jsx           # Componente de paso 1
│   ├── Step2.jsx           # Componente de paso 2
│   ├── Step3.jsx           # Componente de paso 3
│   ├── Step4.jsx           # Componente de paso 4
│   └── base/               # Componentes base reutilizables
├── layout/                  # Layouts de la app
│   ├── RootLayout.jsx      # Layout raíz con header
│   └── StepsLayout.jsx     # Layout con indicador de progreso
├── pages/                   # Páginas de la aplicación
│   ├── HomePage.jsx        # Página de inicio
│   ├── NotFoundPage.jsx    # Página 404
│   ├── Step1Page.jsx       # Página del paso 1
│   ├── Step2Page.jsx       # Página del paso 2
│   ├── Step3Page.jsx       # Página del paso 3
│   el menú desplegable en la esquina superior derecha del header para cambiar entre español e inglés en cualquier momento. El cambio de idioma se aplica de forma inmediata en toda la aplicación.

## 🎨 Mejoras de Diseño

- **Header fijo**: Con el nombre del sistema a la izquierda y selector de idioma a la derecha
- **Diseño minimalista**: Página de inicio con gradientes sutiles y cards informativos
- **Indicador de progreso visual**: Muestra el paso actual y los completados
- **Navegación por URL**: Cada paso tiene su propia ruta, permitiendo navegación directa
- **Transiciones suaves**: Animaciones y efectos hover en botones y elementos interactivos
- **Página 404 personalizada**: Con navegación de regreso al inicio
│   └── index.js            # Exportaciones de páginas
├── locales/                 # Traducciones
│   ├── es.json             # Español
│   └── en.json             # Inglés
└── utils/                   # Utilidades
    ├── helpers.js          # Funciones auxiliares
    ├── localStorage.js     # Gestión de localStorage
    └── styles.js           # Estilos compartidos
```

## 🌐 Rutas Disponibles

- `/` - Página de inicio
- `/step1` - Cargar lista de votantes
- `/step2` - Configuración del escrutinio
- `/step3` - Registro de papeletas
- `/step4` - Resultados finales
- `*` - Página 404 (cualquier ruta no encontrada)

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 💾 Almacenamiento de Datos

Los datos se guardan en localStorage del navegador con los siguientes keys:

- `voterList`: Lista de votantes cargada
- `configuration`: Configuración del escrutinio
- `ballots`: Papeletas registradas

**Nota importante**: Los datos expiran automáticamente después de 2 días desde su creación.

## 🌐 Cambio de Idioma

Usa los botones 🇪🇸 ES / 🇬🇧 EN en la esquina superior derecha para cambiar entre español e inglés en cualquier momento.

## 📄 Formato del Archivo Excel

El archivo Excel debe tener estas columnas (el orden no importa, pero los nombres sí):

- `Nombre` o `Name`
- `Apellido1` o `LastName1`
- `Apellido2` o `LastName2`
- `Localidad` o `Location`

Ejemplo:
| Nombre | Apellido1 | Apellido2 | Localidad |
|--------|-----------|-----------|-----------|
| Juan | García | López | Madrid |
| María | Rodríguez | Martínez | Barcelona |

---

Desarrollado con ❤️ usando React + Vite
