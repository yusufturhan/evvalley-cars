import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı - Evvalley',
  description: 'Aradığınız sayfa bulunamadı. Evvalley\'de elektrikli araçlar, hibrit araçlar ve e-mobility çözümleri için doğru sayfaları ziyaret edin.',
  robots: 'noindex, nofollow',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* 404 Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Sayfa Bulunamadı</h2>
            
            <p className="text-gray-600 mb-8">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
              Evvalley\'de elektrikli araçlar ve e-mobility çözümleri için doğru sayfaları ziyaret edin.
            </p>

            {/* Popular Pages Navigation */}
            <div className="space-y-3 mb-8">
              <h3 className="text-sm font-medium text-gray-700">Popüler Sayfalar:</h3>
              <div className="grid grid-cols-1 gap-2">
                <Link 
                  href="/vehicles" 
                  className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                >
                  🚗 Tüm Araçlar
                </Link>
                <Link 
                  href="/vehicles/ev-cars" 
                  className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                >
                  ⚡ Elektrikli Araçlar
                </Link>
                <Link 
                  href="/vehicles/hybrid-cars" 
                  className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                >
                  🔋 Hibrit Araçlar
                </Link>
                <Link 
                  href="/blog" 
                  className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                >
                  📝 Blog & Rehberler
                </Link>
                <Link 
                  href="/sell" 
                  className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                >
                  💰 Araç Sat
                </Link>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ana Sayfaya Dön
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                İletişime Geç
              </Link>
            </div>

            {/* Search Suggestion */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Aradığınız içeriği bulamadınız mı?
              </p>
              <Link 
                href="/vehicles" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
              >
                Araç arama sayfasını ziyaret edin →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
