import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata: Metadata = {
  title: 'Elektrikli Araçlar - Evvalley',
  description: 'En iyi elektrikli araçları Evvalley\'de bulun. Tesla, BMW, Audi ve daha fazlası. Uygun fiyatlarla elektrikli araç alım satımı.',
  keywords: 'elektrikli araçlar, EV, Tesla, BMW i3, Audi e-tron, elektrikli otomobil, sıfır emisyon',
  alternates: {
    canonical: 'https://www.evvalley.com/vehicles/ev-cars',
  },
  openGraph: {
    title: 'Elektrikli Araçlar - Evvalley',
    description: 'En iyi elektrikli araçları Evvalley\'de bulun. Tesla, BMW, Audi ve daha fazlası.',
    url: 'https://www.evvalley.com/vehicles/ev-cars',
  },
};

export default async function EVCarsPage() {
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('category', 'ev-car')
    .eq('sold', false)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ⚡ Elektrikli Araçlar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Geleceğin teknolojisi ile bugün tanışın. En yeni elektrikli araçlar, 
            uygun fiyatlar ve profesyonel hizmet.
          </p>
        </div>

        {/* Vehicle Count */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">
              {vehicles?.length || 0} Elektrikli Araç
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
            <div className="text-gray-400 text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Henüz Elektrikli Araç Yok
            </h3>
            <p className="text-gray-600 mb-6">
              Şu anda satışta elektrikli araç bulunmuyor. Yeni araçlar eklendiğinde haberdar olmak için takipte kalın.
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
            Elektrikli Araçlar Hakkında
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              Elektrikli araçlar, çevre dostu ulaşımın geleceğidir. Sıfır emisyon, 
              düşük bakım maliyeti ve gelişmiş teknoloji ile elektrikli araçlar 
              günümüzde en popüler ulaşım seçeneklerinden biri haline gelmiştir.
            </p>
            <p className="mb-4">
              Evvalley'de Tesla, BMW i3, Audi e-tron, Nissan Leaf gibi popüler 
              elektrikli araç markalarını bulabilir, uygun fiyatlarla satın alabilir 
              veya mevcut elektrikli aracınızı satabilirsiniz.
            </p>
            <p>
              Elektrikli araç alım satımında uzman ekibimiz size yardımcı olur. 
              Detaylı bilgi için bizimle iletişime geçin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
