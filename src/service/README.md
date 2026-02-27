# Services Layer

Esta carpeta contiene todos los servicios para operaciones CRUD (Create, Read, Update, Delete) en la aplicación de escrutinio.

## Estructura

```
service/
├── voterService.js           # Gestión de votantes
├── configurationService.js   # Gestión de configuración
├── ballotService.js          # Gestión de boletas
├── index.js                  # Punto de entrada para todos los servicios
└── README.md                 # Este archivo
```

## Servicios Disponibles

### 📋 Voter Service (`voterService.js`)

Gestiona la lista de votantes.

**Operaciones:**

- `createVoter(voter)` - Crea un votante individual
- `createVoterList(voterList)` - Importa una lista completa de votantes
- `getAllVoters()` - Obtiene todos los votantes
- `getVoterById(id)` - Obtiene un votante por ID
- `getVotersCount()` - Obtiene el número total de votantes
- `updateVoter(id, updatedData)` - Actualiza un votante
- `deleteVoter(id)` - Elimina un votante
- `deleteAllVoters()` - Elimina todos los votantes
- `voterListExists()` - Verifica si existe una lista de votantes

**Ejemplo de uso:**

```javascript
import { createVoter, getAllVoters, getVotersCount } from '../service';

// Crear un nuevo votante
const newVoter = createVoter({
  nombre: 'Juan',
  primerApellido: 'García',
  segundoApellido: 'López',
  localidad: 'Madrid',
});

// Obtener todos los votantes
const voters = getAllVoters();

// Obtener el total de votantes
const count = getVotersCount();
```

---

### ⚙️ Configuration Service (`configurationService.js`)

Gestiona la configuración del proceso de votación (singleton).

**Operaciones:**

- `saveConfiguration(configData)` - Guarda/actualiza la configuración
- `getConfiguration()` - Obtiene la configuración actual
- `configurationExists()` - Verifica si existe una configuración
- `deleteConfiguration()` - Elimina la configuración
- `updateConfigurationField(field, value)` - Actualiza un campo específico
- `updateConfigurationFields(updates)` - Actualiza múltiples campos

**Estructura de configuración:**

```javascript
{
  electoral_area: string,
  election_date: string, // ISO date format
  election_type: string, // Tipo de elección (opcional)
  total_ballots: number,
  ballots_person: number,
  ballots_postal: number,
  delegates: number,
  total_voters_posible: number,
  scrutineers: number,
  scrutineersNames: string[],
  createdAt: string,
  updatedAt: string
}
```

**Ejemplo de uso:**

```javascript
import { saveConfiguration, getConfiguration } from '../service';

// Guardar configuración
const config = saveConfiguration({
  electoral_area: 'Zona Norte',
  election_date: '2026-02-15',
  delegates: 5,
  scrutineers: 3,
  scrutineersNames: ['Ana', 'Luis', 'María'],
  // ... otros campos
});

// Obtener configuración
const currentConfig = getConfiguration();
```

---

### 🗳️ Ballot Service (`ballotService.js`)

Gestiona las boletas de votación.

**Operaciones:**

- `createBallot(ballotData)` - Crea una boleta
- `getAllBallots()` - Obtiene todas las boletas
- `getBallotById(id)` - Obtiene una boleta por ID
- `getBallotByNumber(number)` - Obtiene una boleta por número
- `getBallotsCount()` - Obtiene el número total de boletas
- `getNextBallotNumber()` - Obtiene el siguiente número de boleta
- `getValidBallots()` - Obtiene solo las boletas válidas
- `getNullBallots()` - Obtiene solo las boletas nulas
- `updateBallot(id, updatedData)` - Actualiza una boleta por ID
- `updateBallotByIndex(index, updatedData)` - Actualiza una boleta por índice
- `deleteBallot(id)` - Elimina una boleta por ID
- `deleteBallotByIndex(index)` - Elimina una boleta por índice
- `deleteAllBallots()` - Elimina todas las boletas
- `replaceAllBallots(newBallots)` - Reemplaza todas las boletas
- `ballotsExist()` - Verifica si existen boletas

**Estructura de boleta:**

```javascript
{
  id: string, // UUID
  number: number,
  votes: Array<{ person, isNull }>,
  isNull: boolean,
  timestamp: string // ISO date format
}
```

**Ejemplo de uso:**

```javascript
import {
  createBallot,
  getAllBallots,
  getNextBallotNumber,
  getValidBallots,
} from '../service';

// Crear una boleta
const ballot = createBallot({
  number: getNextBallotNumber(),
  votes: [{ person: voterData, isNull: false }],
  isNull: false,
});

// Obtener todas las boletas
const allBallots = getAllBallots();

// Obtener solo boletas válidas
const validBallots = getValidBallots();
```

---

## Importación

Todos los servicios se pueden importar desde el archivo `index.js`:

```javascript
// Importar servicios específicos
import {
  createVoter,
  getAllVoters,
  saveConfiguration,
  getConfiguration,
  createBallot,
  getAllBallots,
} from '../service';

// O importar todo
import * as services from '../service';
```

---

## Almacenamiento

Todos los servicios utilizan `localStorage` a través de las funciones helper en `utils/localStorage.js`. Los datos tienen:

- **Expiración automática**: 2 días
- **Formato JSON**: Todos los datos se guardan como JSON
- **Validación**: Los datos se validan antes de guardarse

---

## Buenas Prácticas

1. ✅ **Usa siempre los servicios** en lugar de acceder directamente a `localStorage`
2. ✅ **Maneja errores**: Los servicios pueden devolver `null` si no hay datos
3. ✅ **No modifiques los datos devueltos** directamente, usa las funciones de actualización
4. ✅ **Verifica existencia**: Usa las funciones `*Exists()` antes de operaciones críticas

**❌ NO hacer:**

```javascript
// Mal - acceso directo a localStorage
const voters = JSON.parse(localStorage.getItem('voterList'));
```

**✅ SÍ hacer:**

```javascript
// Bien - usar el servicio
const voters = getAllVoters();
```

---

## Testing

Para resetear todos los datos durante desarrollo:

```javascript
import {
  deleteAllVoters,
  deleteConfiguration,
  deleteAllBallots,
} from '../service';

// Limpiar todos los datos
deleteAllVoters();
deleteConfiguration();
deleteAllBallots();
```

---

## Mantenimiento

Al añadir nuevas funcionalidades:

1. Añade las funciones en el servicio correspondiente
2. Exporta las funciones desde el servicio
3. Añade las exportaciones en `index.js`
4. Actualiza esta documentación
5. Actualiza los componentes para usar las nuevas funciones
