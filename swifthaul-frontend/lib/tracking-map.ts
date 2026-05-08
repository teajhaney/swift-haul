export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface MapPoint {
  left: number;
  top: number;
}

const MAP_FRAME = {
  minLeft: 18,
  maxLeft: 78,
  minTop: 20,
  maxTop: 68,
};

export function hasCoordinates(
  point: Partial<GeoPoint> | null | undefined,
): point is GeoPoint {
  return typeof point?.lat === 'number' && typeof point?.lng === 'number';
}

export function toMapPoint(
  point: Partial<GeoPoint> | null | undefined,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number } | null,
  fallback: MapPoint,
): MapPoint {
  if (!point || !bounds) {
    return fallback;
  }

  if (!hasCoordinates(point)) {
    return fallback;
  }

  const lngSpan = Math.max(bounds.maxLng - bounds.minLng, 0.001);
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.001);

  const x = (point.lng - bounds.minLng) / lngSpan;
  const y = 1 - (point.lat - bounds.minLat) / latSpan;

  return {
    left: clamp(
      MAP_FRAME.minLeft + x * (MAP_FRAME.maxLeft - MAP_FRAME.minLeft),
      MAP_FRAME.minLeft,
      MAP_FRAME.maxLeft,
    ),
    top: clamp(
      MAP_FRAME.minTop + y * (MAP_FRAME.maxTop - MAP_FRAME.minTop),
      MAP_FRAME.minTop,
      MAP_FRAME.maxTop,
    ),
  };
}

export function getBounds(
  points: Array<Partial<GeoPoint> | null | undefined>,
): { minLat: number; maxLat: number; minLng: number; maxLng: number } | null {
  const valid: GeoPoint[] = [];

  for (const point of points) {
    if (hasCoordinates(point)) {
      valid.push(point);
    }
  }

  if (valid.length < 2) {
    return null;
  }

  const lats = valid.map((point) => point.lat);
  const lngs = valid.map((point) => point.lng);

  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
