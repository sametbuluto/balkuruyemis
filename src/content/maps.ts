import type { BranchCardEntry, Coordinates } from '../types/content';

export function coordinateText(coordinates: Coordinates): string {
  return `${coordinates.latitude},${coordinates.longitude}`;
}

export function getMapsLinks(
  branch: BranchCardEntry,
): { view: string; directions: string | null } | null {
  if (branch.contentKind === 'example') return null;
  if (!branch.coordinates)
    return branch.contentKind === 'verified' && branch.googleMapsUrl
      ? { view: branch.googleMapsUrl, directions: null }
      : null;
  const point = coordinateText(branch.coordinates);
  return {
    view:
      branch.googleMapsUrl ??
      `https://www.google.com/maps/search/?${new URLSearchParams({ api: '1', query: point })}`,
    directions: `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', destination: point })}`,
  };
}
