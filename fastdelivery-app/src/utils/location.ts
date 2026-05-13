import * as ExpoLocation from 'expo-location';

export interface Coordinates {
  lat: number;
  lng: number;
}

// Coordenadas de fallback para desarrollo (Monterrey, NL)
const DEV_FALLBACK_COORDS: Coordinates = {
  lat: 25.6866,
  lng: -100.3161,
};

const GPS_TIMEOUT_MS = 5_000;

/** Rechaza después de N ms — evita que el emulador tarde 20s+ en hacer timeout */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`GPS timeout (${ms}ms)`)), ms),
    ),
  ]);
}

/**
 * Obtiene las coordenadas actuales del dispositivo.
 * En emuladores AVD con Expo Go donde el GPS no funciona,
 * devuelve coordenadas de Monterrey como fallback de desarrollo.
 */
export async function getCurrentCoordinates(): Promise<Coordinates & { isFallback?: boolean }> {
  const { status } = await ExpoLocation.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error(
      'Permiso de ubicación denegado. Habilitalo en Configuración para continuar.',
    );
  }

  try {
    // Primero intenta la última posición conocida (rápido)
    const last = await withTimeout(
      ExpoLocation.getLastKnownPositionAsync({ maxAge: 60_000 }),
      GPS_TIMEOUT_MS,
    );
    if (last) {
      return { lat: last.coords.latitude, lng: last.coords.longitude };
    }

    // Si no hay posición reciente, solicita la actual
    const current = await withTimeout(
      ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Lowest }),
      GPS_TIMEOUT_MS,
    );
    return { lat: current.coords.latitude, lng: current.coords.longitude };

  } catch {
    // En emuladores AVD + Expo Go el GPS falla aunque esté habilitado.
    // En DEV usamos fallback; en producción (dispositivo real) esto no ocurre.
    if (__DEV__) {
      return { ...DEV_FALLBACK_COORDS, isFallback: true };
    }
    throw new Error('No se pudo obtener la ubicación. Verificá que el GPS esté activo.');
  }
}

