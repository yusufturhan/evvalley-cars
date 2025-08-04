"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';

export default function UpdateVehiclePage() {
  const params = useParams();
  const [vehicleId, setVehicleId] = useState<string>('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (params.id) {
      setVehicleId(params.id as string);
    }
  }, [params.id]);

  const handleUpdatePrice = async () => {
    if (!price) {
      setMessage('Lütfen yeni fiyat girin');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: parseFloat(price)
        }),
      });

      if (response.ok) {
        setMessage('✅ Fiyat güncellendi! Favori kullanıcılara bildirim gönderildi.');
      } else {
        const error = await response.json();
        setMessage(`❌ Hata: ${error.error}`);
      }
    } catch (error) {
      setMessage('❌ Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Araç Fiyatı Güncelle</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Fiyat ($)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Örn: 25000"
              />
            </div>
            
            <button
              onClick={handleUpdatePrice}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Güncelleniyor...' : 'Fiyatı Güncelle'}
            </button>
            
            {message && (
              <div className={`p-4 rounded-md ${
                message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">📧 Email Bildirimleri</h3>
            <p className="text-blue-700 text-sm">
              Bu araç favori listesinde olan kullanıcılara otomatik olarak email bildirimi gönderilecektir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 