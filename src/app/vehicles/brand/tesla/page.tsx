import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata: Metadata = {
  title: 'Tesla Araçları - Evvalley',
  description: 'Tesla Model S, Model 3, Model X, Model Y ve Cybertruck. En yeni Tesla araçlarını Evvalley\'de bulun ve satın alın.',
  keywords: 'Tesla, Model S, Model 3, Model X, Model Y, Cybertruck, elektrikli araç, Elon Musk',
  alternates: {
    canonical: 'https://www.evvalley.com/vehicles/brand/tesla',
  },
  openGraph: {
    title: 'Tesla Araçları - Evvalley',
    description: 'Tesla Model S, Model 3, Model X, Model Y ve Cybertruck. En yeni Tesla araçları.',
    url: 'https://www.evvalley.com/vehicles/brand/tesla',
  },
};

export default async function TeslaBrandPage() {
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .ilike('title', '%Tesla%')
    .eq('sold_at', null)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img 
              src="/tesla-logo.png" 
              alt="Tesla Logo" 
              className="h-16 mx-auto mb-4"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚗 Tesla Araçları
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Geleceğin teknolojisi ile bugün tanışın. Tesla Model S, Model 3, 
            Model X, Model Y ve Cybertruck modellerini Evvalley\'de bulun.
          </p>
        </div>

        {/* Vehicle Count */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">
              {vehicles?.length || 0} Tesla Araç
            </p>
            <p className="text-gray-600">Şu anda satışta</p>
          </div>
        </div>

        {/* Tesla Models Overview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tesla Model Serisi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Model S</h3>
              <p className="text-sm text-gray-600">Lüks Sedan</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Model 3</h3>
              <p className="text-sm text-gray-600">Kompakt Sedan</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Model X</h3>
              <p className="text-sm text-gray-600">SUV</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Model Y</h3>
              <p className="text-sm text-gray-600">Kompakt SUV</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Cybertruck</h3>
              <p className="text-sm text-gray-600">Pickup Truck</p>
            </div>
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
              Henüz Tesla Araç Yok
            </h3>
            <p className="text-gray-600 mb-6">
              Şu anda satışta Tesla araç bulunmuyor. Yeni araçlar eklendiğinde haberdar olmak için takipte kalın.
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
            Tesla Hakkında
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              Tesla, elektrikli araç teknolojisinde dünya lideri olan Amerikan 
              otomotiv ve enerji şirketidir. Elon Musk tarafından 2003 yılında 
              kurulan Tesla, sürdürülebilir ulaşım için yenilikçi çözümler sunar.
            </p>
            <p className="mb-4">
              Tesla araçları, gelişmiş otonom sürüş özellikleri, uzun menzil, 
              hızlı şarj kapasitesi ve çevre dostu teknolojileri ile öne çıkar. 
              Model S, Model 3, Model X, Model Y ve Cybertruck gibi çeşitli 
              modeller sunar.
            </p>
            <p>
              Evvalley'de Tesla araçlarını bulabilir, uygun fiyatlarla satın 
              alabilir veya mevcut Tesla aracınızı satabilirsiniz. Tesla uzmanı 
              ekibimiz size yardımcı olur.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center space-y-4">
          <div>
            <Link
              href="/vehicles"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Tüm Araçları Gör
            </Link>
          </div>
          <div>
            <Link
              href="/vehicles/ev-cars"
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              ← Elektrikli Araçlara Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
