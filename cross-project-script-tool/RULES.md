# 📏 Reglas de Marcado de Código Generado por GitHub Copilot

Este documento describe las reglas que el contador detecta y cómo deben aplicarse en tu código.

## 🎯 Propósito

Mantener un registro claro y cuantificable de las líneas de código generadas por GitHub Copilot en proyectos de desarrollo de software, permitiendo:
- Medir la contribución de la IA en el proyecto
- Identificar áreas donde Copilot es más útil
- Documentar qué código fue asistido por IA
- Generar métricas para reportes y análisis

## 📋 Reglas de Marcado

### Regla 7: Métodos Completos Generados

**Descripción**: Todo método generado completamente por GitHub Copilot debe incluir un comentario al inicio que indique claramente que fue generado por Copilot.

**Formato**:
```typescript
// Método generado por GitHub Copilot
public NombreMetodo(parametros): TipoRetorno {
    // Implementación del método
}
```

**Características**:
- ✅ Incluye comentario de INICIO
- ❌ NO incluye comentario de cierre
- 🎯 Se aplica a métodos/funciones COMPLETOS
- 📊 El conteo incluye desde el comentario hasta el cierre del método

**Ejemplos Válidos**:

**TypeScript:**
```typescript
// Método generado por GitHub Copilot
public CalcularPromedio(numeros: number[]): number {
    return numeros.reduce((a, b) => a + b, 0) / numeros.length;
}
```

**C#:**
```csharp
// Método generado por GitHub Copilot
public decimal CalcularTotal(List<Item> items)
{
    return items.Sum(item => item.Precio * item.Cantidad);
}
```

**Python:**
```python
# Método generado por GitHub Copilot
def procesar_datos(self, datos):
    return [item for item in datos if item.activo]
```

**Java:**
```java
// Método generado por GitHub Copilot
public List<User> getActiveUsers() {
    return users.stream()
        .filter(User::isActive)
        .collect(Collectors.toList());
}
```

**Notación Pascal**: Los métodos generados deben usar notación Pascal (PascalCase):
- ✅ `CalcularTotal`
- ✅ `ObtenerUsuarios`
- ✅ `ValidarDatos`
- ❌ `calcular_total` (snake_case)
- ❌ `obtenerUsuarios` (camelCase)

---

### Regla 8: Fragmentos de Código

**Descripción**: Cuando se genera un fragmento de código (no un método completo) con GitHub Copilot, se debe indicar el inicio y el fin del fragmento con comentarios claros.

**Formato**:
```typescript
// Inicio código generado por GitHub Copilot
// ...código generado...
// Fin código generado por GitHub Copilot
```

**Características**:
- ✅ Incluye comentario de INICIO
- ✅ Incluye comentario de FIN
- 🎯 Se aplica a fragmentos de código dentro de métodos
- 📊 El conteo incluye desde el inicio hasta el fin (incluyendo los comentarios)

**Ejemplos Válidos**:

**TypeScript:**
```typescript
public procesarUsuarios(usuarios: User[]): User[] {
    // Inicio código generado por GitHub Copilot
    const usuariosActivos = usuarios
        .filter(u => u.activo)
        .map(u => ({
            ...u,
            nombreCompleto: `${u.nombre} ${u.apellido}`
        }))
        .sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));
    // Fin código generado por GitHub Copilot
    
    return usuariosActivos;
}
```

**C#:**
```csharp
public void ProcesarOrden(Orden orden)
{
    ValidarOrden(orden);
    
    // Inicio código generado por GitHub Copilot
    var itemsValidos = orden.Items
        .Where(item => item.Cantidad > 0 && item.Precio > 0)
        .Select(item => new ItemProcesado
        {
            Id = item.Id,
            Total = item.Cantidad * item.Precio
        })
        .ToList();
    // Fin código generado por GitHub Copilot
    
    GuardarItems(itemsValidos);
}
```

**Python:**
```python
def analizar_ventas(self, datos):
    # Inicio código generado por GitHub Copilot
    ventas_agrupadas = {}
    for venta in datos:
        mes = venta['fecha'].month
        if mes not in ventas_agrupadas:
            ventas_agrupadas[mes] = []
        ventas_agrupadas[mes].append(venta['total'])
    # Fin código generado por GitHub Copilot
    
    return ventas_agrupadas
```

---

### Regla 10: Refactorizaciones y Optimizaciones

**Descripción**: Toda refactorización u optimización de código realizada por medio de GitHub Copilot debe incluir un comentario al inicio y al final del bloque indicando que fue realizada por Copilot.

**Formato**:
```typescript
// Inicio refactorización/optimización por GitHub Copilot
// ...código refactorizado u optimizado...
// Fin refactorización/optimización por GitHub Copilot
```

**Características**:
- ✅ Incluye comentario de INICIO
- ✅ Incluye comentario de FIN
- 🎯 Se aplica a código mejorado/optimizado por Copilot
- 📊 El conteo incluye desde el inicio hasta el fin
- 💡 Documenta mejoras de rendimiento, legibilidad o estructura

**Ejemplos Válidos**:

**Optimización de Rendimiento:**
```typescript
// Inicio refactorización/optimización por GitHub Copilot
// Optimizado para evitar múltiples iteraciones
const estadisticas = datos.reduce((acc, item) => {
    acc.suma += item.valor;
    acc.count++;
    acc.max = Math.max(acc.max, item.valor);
    acc.min = Math.min(acc.min, item.valor);
    return acc;
}, { suma: 0, count: 0, max: -Infinity, min: Infinity });
// Fin refactorización/optimización por GitHub Copilot
```

**Refactorización para Mejor Legibilidad:**
```csharp
// Inicio refactorización/optimización por GitHub Copilot
// Refactorizado para separar responsabilidades
private bool ValidarUsuario(Usuario usuario)
{
    return ValidarEmail(usuario.Email) 
        && ValidarEdad(usuario.Edad)
        && ValidarDocumento(usuario.Documento);
}

private bool ValidarEmail(string email) => 
    !string.IsNullOrEmpty(email) && email.Contains("@");

private bool ValidarEdad(int edad) => 
    edad >= 18 && edad <= 120;

private bool ValidarDocumento(string documento) => 
    !string.IsNullOrEmpty(documento) && documento.Length >= 8;
// Fin refactorización/optimización por GitHub Copilot
```

**Optimización con Memoización:**
```python
# Inicio refactorización/optimización por GitHub Copilot
# Implementada memoización para mejorar rendimiento
@lru_cache(maxsize=128)
def calcular_fibonacci(n):
    if n <= 1:
        return n
    return calcular_fibonacci(n-1) + calcular_fibonacci(n-2)
# Fin refactorización/optimización por GitHub Copilot
```

---

## ⚠️ Casos Especiales

### Múltiples Bloques en un Mismo Archivo

Es válido tener múltiples bloques de código generado por AI en un mismo archivo:

```typescript
export class ProductService {
    // Método generado por GitHub Copilot
    public ObtenerProductos(): Product[] {
        return this.productos.filter(p => p.activo);
    }

    public procesarInventario() {
        // Inicio código generado por GitHub Copilot
        const productosConStock = this.productos
            .filter(p => p.stock > 0)
            .map(p => ({ ...p, disponible: true }));
        // Fin código generado por GitHub Copilot
        
        return productosConStock;
    }

    // Inicio refactorización/optimización por GitHub Copilot
    // Optimizado con Map para búsquedas O(1)
    private indiceProductos = new Map<number, Product>();
    
    public BuscarProducto(id: number): Product | undefined {
        return this.indiceProductos.get(id);
    }
    // Fin refactorización/optimización por GitHub Copilot
}
```

### Comentarios Anidados (No Soportado)

❌ No se deben anidar bloques de código AI:

```typescript
// Inicio código generado por GitHub Copilot
const datos = obtenerDatos();
    // Método generado por GitHub Copilot  ❌ NO VÁLIDO
    function procesar(x) {
        return x * 2;
    }
// Fin código generado por GitHub Copilot
```

✅ En su lugar, usa comentarios separados:

```typescript
// Método generado por GitHub Copilot
function Procesar(x: number): number {
    return x * 2;
}

// Inicio código generado por GitHub Copilot
const datos = obtenerDatos();
const resultado = datos.map(Procesar);
// Fin código generado por GitHub Copilot
```

---

## 📊 Interpretación de Métricas

### ¿Cuándo usar cada regla?

| Situación | Regla a Usar |
|-----------|--------------|
| Copilot generó un método/función completo | Regla 7 |
| Copilot generó algunas líneas dentro de un método | Regla 8 |
| Copilot ayudó a mejorar/optimizar código existente | Regla 10 |

### Buenas Prácticas

1. **Inmediatez**: Marca el código apenas lo generes con Copilot
2. **Precisión**: Solo marca código que realmente fue generado por Copilot
3. **Consistencia**: Usa el formato exacto de los comentarios
4. **Honestidad**: No marques código manual como generado por AI

---

## 🔍 Verificación

Para verificar que tus marcas son correctas, ejecuta el contador:

```bash
npm run cli ./tu-proyecto
```

El reporte te mostrará cuántas líneas detectó de cada tipo.

---

## 💡 Tips

### Variaciones de Texto Aceptadas

El contador acepta variaciones en los comentarios para mayor flexibilidad:

**Para "código":**
- ✅ `código`
- ✅ `codigo`

**Para "refactorización":**
- ✅ `refactorización`
- ✅ `refactorizacion`

**Para "optimización":**
- ✅ `optimización`
- ✅ `optimizacion`

### Insensibilidad a Mayúsculas/Minúsculas

Los patrones son case-insensitive:
- ✅ `// Método generado por GitHub Copilot`
- ✅ `// método generado por github copilot`
- ✅ `// MÉTODO GENERADO POR GITHUB COPILOT`

---

## 📚 Recursos Adicionales

- [README.md](README.md) - Documentación principal
- [USAGE.md](USAGE.md) - Guía de uso del contador
- [example/userService.ts](example/userService.ts) - Archivo de ejemplo con las tres reglas

---

**Nota**: Estas reglas son fundamentales para mantener la trazabilidad del código generado por IA y generar métricas precisas sobre la contribución de GitHub Copilot en tus proyectos.
