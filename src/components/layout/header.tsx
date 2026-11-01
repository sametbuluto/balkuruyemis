import { navigation } from '@/config/site';
import { Brand } from '@/components/ui/brand';
import { HeaderNavigation } from './header-navigation';

// Marka/merkezi içerik yalnız sunucuda okunur; istemciye menü ve render edilmiş logo gider.
export function Header() {
  return <HeaderNavigation navigation={navigation} brand={<Brand />} />;
}
