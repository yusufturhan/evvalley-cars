import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata: Metadata = {
  title: 'Elektrikli Scooter\'lar - Evvalley',
  description: 'En iyi elektrikli scooter\'ları Evvalley\'de bulun. Xiaomi, Segway, Ninebot ve daha fazlası. Şehir içi ulaşım için elektrikli scooter alım satımı.',
  keywords: 'elektrikli scooter, e-scooter, Xiaomi, Segway, Ninebot, şehir içi ulaşım, portatif ulaşım',
  alternates: {
    canonical: 'https://www.evvalley.com/vehicles/ev-scooters',
  },
  openGraph: {
    title: 'Elektrikli Scooter\'lar - Evvalley',
    description: 'En iyi elektrikli scooter\'ları Evvalley\'de bulun. Xiaomi, Segway, Ninebot ve daha fazlası.',
    url: 'https://www.evvalley.com/vehicles/ev-scooters',
  },
};

export default async function EVScootersPage() {
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('category', 'ev-scooter')
    .eq('sold_at', null)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛴 Elektrikli Scooter'lar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Şehir içi ulaşımın en pratik çözümü. Elektrikli scooter'lar ile 
            trafik sıkışıklığından kurtulun, çevre dostu ulaşımın keyfini çıkarın.
          </p>
        </div>

        {/* Vehicle Count */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">
              {vehicles?.length || 0} Elektrikli Scooter
            </p>
            <p className="text-gray-600">Şu anda satışta</p>
          </div>
        </div>

        {/* Vehicles Grid */}
        {vehicles && vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle: any) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {vehicle.images && vehicle.images[0] ? (
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Resim Yok</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {vehicle.title}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    ${vehicle.price?.toLocaleString() || 'Fiyat Belirtilmemiş'}
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📍 {vehicle.location || 'Konum Belirtilmemiş'}</p>
                    <p>📅 {vehicle.year || 'Yıl Belirtilmemiş'}</p>
                    <p>🔋 {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'Kilometre Belirtilmemiş'}</p>
                  </div>
                  <a
                    href={`/vehicles/${vehicle.id}`}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block"
                  >
                    Detayları Gör
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛴</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Henüz Elektrikli Scooter Yok
            </h3>
            <p className="text-gray-600 mb-6">
              Şu anda satışta elektrikli scooter bulunmuyor. Yeni araçlar eklendiğinde haberdar olmak için takipte kalın.
            </p>
            <a
              href="/vehicles"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Tüm Araçları Gör
            </a>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Elektrikli Scooter'lar Hakkında
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              Elektrikli scooter'lar, şehir içi ulaşımın en pratik ve çevre dostu 
              çözümlerinden biridir. Kompakt boyutları, kolay kullanımı ve düşük 
              maliyetleri ile özellikle gençler ve şehir sakinleri arasında popülerdir.
            </p>
            <p className="mb-4">
              Evvalley'de Xiaomi, Segway, Ninebot, Razor gibi popüler elektrikli 
              scooter markalarını bulabilir, uygun fiyatlarla satın alabilir veya 
              mevcut elektrikli scooter'ınızı satabilirsiniz.
            </p>
            <p>
              Elektrikli scooter alım satımında uzman ekibimiz size yardımcı olur. 
              Detaylı bilgi için bizimle iletişime geçin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
