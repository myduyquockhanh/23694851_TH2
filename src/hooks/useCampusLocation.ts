import { useState, useCallback } from 'react';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
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

// ── Android permission helper ─────────────────────────────────
async function requestAndroidPermission(): Promise<boolean> {
  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Quyền vị trí',
        message: 'KTXGo cần quyền vị trí để tính phí giao hàng.',
        buttonNeutral: 'Hỏi sau',
        buttonNegative: 'Từ chối',
        buttonPositive: 'Cho phép',
      },
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

// ── Hook ──────────────────────────────────────────────────────
export function useCampusLocation(): UseCampusLocationReturn {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [km, setKm] = useState<number | null>(null);
  const setShippingKm = useCartStore((s) => s.setShippingKm);

  const requestLocation = useCallback(async () => {
    setStatus('loading');

    try {
      // 1. Request permission on Android; iOS uses Info.plist
      if (Platform.OS === 'android') {
        const granted = await requestAndroidPermission();
        if (!granted) {
          // Check if blocked (never ask again)
          const check = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (!check) {
            setStatus('blocked');
            Linking.openSettings();
          } else {
            setStatus('denied');
          }
          return;
        }
      }

      // 2. Permission granted – get current position
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const distance = haversineKm(latitude, longitude, CAMPUS_LAT, CAMPUS_LNG);
          setKm(distance);
          setShippingKm(distance);
          setStatus('granted');
        },
        (_error) => {
          setStatus('denied');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch {
      setStatus('denied');
    }
  }, [setShippingKm]);

  return { status, km, requestLocation };
}
