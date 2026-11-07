import { loadAnnouncements } from './announcements.server';
import { selectPublishedAnnouncements } from './announcement-schema';
import { getBuildInstant } from './build-clock';
export const getAnnouncements = loadAnnouncements;
export function getPublishedAnnouncements(at = getBuildInstant()) {
  return selectPublishedAnnouncements(getAnnouncements(), at);
}
