import { createHash } from 'node:crypto';
import type { Coordinates } from '../types/content';

/** İçerik editörünün değiştiremediği teknik onay; yalnız ürün sahibi doğrulamasıyla eklenir. */
export interface BranchIdentityApproval {
  id: string;
  fingerprint: string;
}

/** Onay işareti veri kopyası değildir; kimlik alanlarının sıralı SHA-256 özetidir. */
export function branchIdentityFingerprint(branch: {
  id: string;
  slug: string;
  name: string;
  address: string;
  coordinates?: Coordinates | null;
}): string {
  return createHash('sha256')
    .update(
      JSON.stringify([
        branch.id,
        branch.slug,
        branch.name,
        branch.address,
        branch.coordinates?.latitude ?? null,
        branch.coordinates?.longitude ?? null,
      ]),
    )
    .digest('hex');
}

// Şu an yalnız koordinatlar biliniyor; kimliği onaylanmış şube yok.
// JSON contentKind alanı veya CMS readonly/hidden ayarı yetki/onay yerine geçmez.
export const approvedBranchIdentities: readonly BranchIdentityApproval[] = [];
