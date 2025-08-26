import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EV Rehberleri - Evvalley Blog',
  description: 'Elektrikli araçlar hakkında kapsamlı rehberler, ipuçları ve güncel bilgiler. EV satın alma, şarj ve bakım konularında uzman tavsiyeleri.',
  keywords: 'elektrikli araç rehberi, EV satın alma, şarj istasyonu, bakım ipuçları, Tesla rehberi',
  alternates: {
    canonical: 'https://www.evvalley.com/blog/category/ev-guide',
  },
  openGraph: {
    title: 'EV Rehberleri - Evvalley Blog',
    description: 'Elektrikli araçlar hakkında kapsamlı rehberler ve uzman tavsiyeleri.',
    url: 'https://www.evvalley.com/blog/category/ev-guide',
  },
};

export default function EVGuideCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 EV Rehberleri
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elektrikli araçlar hakkında kapsamlı rehberler, satın alma ipuçları, 
            şarj çözümleri ve bakım tavsiyeleri.
          </p>
        </div>

        {/* Category Description */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Elektrikli Araç Rehberleri
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              Elektrikli araç dünyasına yeni adım atanlar için kapsamlı rehberler 
              ve deneyimli EV sürücüleri için gelişmiş ipuçları sunuyoruz.
            </p>
            <p className="mb-4">
              Bu kategoride elektrikli araç satın alma süreci, şarj istasyonu 
              bulma, bakım ve performans optimizasyonu gibi konuları ele alıyoruz.
            </p>
            <p>
              Uzman yazarlarımız tarafından hazırlanan güncel ve doğru bilgilerle 
              elektrikli araç deneyiminizi en üst seviyeye çıkarın.
            </p>
          </div>
        </div>

        {/* Featured Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Article 1 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Elektrikli Araç Satın Alma Rehberi 2024
              </h3>
              <p className="text-gray-600 mb-4">
                İlk elektrikli aracınızı satın alırken dikkat etmeniz gereken 
                tüm detaylar ve püf noktaları.
              </p>
              <Link
                href="/blog/ev-buying-guide-2024"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Devamını Oku →
              </Link>
            </div>
          </div>

          {/* Article 2 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Evde Tesla Şarj Kurulumu
              </h3>
              <p className="text-gray-600 mb-4">
                Evinizde Tesla şarj istasyonu kurulumu için adım adım rehber 
                ve maliyet analizi.
              </p>
              <Link
                href="/blog/tesla-home-charging-setup"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Devamını Oku →
              </Link>
            </div>
          </div>

          {/* Article 3 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                EV Bakım ve Servis Rehberi
              </h3>
              <p className="text-gray-600 mb-4">
                Elektrikli araçların bakım gereksinimleri, servis aralıkları 
                ve uzun ömürlü kullanım ipuçları.
              </p>
              <Link
                href="/blog/ev-maintenance-guide"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Devamını Oku →
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Tüm Blog Yazılarına Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
