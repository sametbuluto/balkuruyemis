import type { ContactChannel } from '../types/content';
import { getSocialSettings } from './editorial.server';
import { resolveCopy, socialSchema } from './editorial-schema';
import { getCopyContext } from './page-copy';

export function getContactChannels(): readonly ContactChannel[] {
  const settings = socialSchema(
    resolveCopy(getSocialSettings(), getCopyContext()),
    'social(çözülmüş)',
  );
  return (['instagram', 'whatsapp'] as const).map((id) => ({
    id,
    name: id === 'instagram' ? 'Instagram' : 'WhatsApp',
    description: settings[id].description,
    url: settings[id].verified ? settings[id].url : null,
    actionLabel: settings[id].actionLabel,
  }));
}
export const contactChannels = getContactChannels();
