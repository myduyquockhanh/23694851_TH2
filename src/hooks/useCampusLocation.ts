import { useState, useCallback } from 'react';
import { Linking } from 'react-native';
import * as Location from 'expo-location';
import { useCartStore } from '@stores/cartStore';

// KTX / Campus destination coordinates
// (UEF Campus B, Bình Thạnh – update to your actual campus if needed)
const CAMPUS_LAT = 10.8231;
const CAMPUS_LNG = 106.6297;

// ── Haversine formula ─────────────────────────────────────────
const toRad = (deg: number) => (deg * Math.PI) / 180;

export const haversineKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Permission states ─────────────────────────────────────────
export type LocationStatus = 'idle' | 'granted' | 'denied' | 'blocked' | 'loading';

interface UseCampusLocationReturn {
  status: LocationStatus;
  km: number | null;
  requestLocation: () => Promise<void>;
}

// ── Hook ──────────────────────────────────────────────────────
export function useCampusLocation(): UseCampusLocationReturn {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [km, setKm] = useState<number | null>(null);
  const setShippingKm = useCartStore((s) => s.setShippingKm);

  const requestLocation = useCallback(async () => {
    setStatus('loading');

    try {
      // 1. Check existing permission
      const { status: existing } = await Location.getForegroundPermissionsAsync();

      if (existing === 'denied') {
        // On some platforms 'denied' means permanently blocked
        // Try to request; if it fails we open settings
        const { status: requested } = await Location.requestForegroundPermissionsAsync();
        if (requested !== 'granted') {
          // Treat as blocked – open settings
          setStatus('blocked');
          Linking.openSettings();
          return;
        }
      } else if (existing !== 'granted') {
        // 'undetermined' – request normally
        const { status: requested } = await Location.requestForegroundPermissionsAsync();
        if (requested === 'granted') {
          // continue below
        } else {
          // Check if it can be asked again
          const { canAskAgain } = await Location.getForegroundPermissionsAsync();
          if (!canAskAgain) {
            setStatus('blocked');
            Linking.openSettings(); // Blocked → open settings
            return;
          }
          setStatus('denied');
          return;
        }
      }

      // 2. Permission granted – get position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = position.coords;
      const distance = haversineKm(latitude, longitude, CAMPUS_LAT, CAMPUS_LNG);
      setKm(distance);
      setShippingKm(distance);
      setStatus('granted');
    } catch {
      setStatus('denied');
    }
  }, [setShippingKm]);

  return { status, km, requestLocation };
}
