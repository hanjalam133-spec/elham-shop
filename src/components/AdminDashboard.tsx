import React, { useState } from 'react';
import { useShop, playOrderSuccessSound } from '../context/ShopContext';
import { db, doc, deleteDoc, writeBatch } from '../lib/firebaseClient';

export const AdminDashboard: React.FC = () => {
  const { products, deleteProduct } = useShop();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(
    localStorage.getItem("elham_audio_alerts") !== "false"
  );

  // একক প্রোডাক্ট ডিলিট ফাংশন
  const handleDeleteProduct = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিত এই প্রোডাক্টটি ডিলিট করতে চান?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        deleteProduct(id);
      } catch (error) {
        console.error("Delete error:", error);
        alert("ডিলিট করতে সমস্যা হয়েছে!");
      }
    }
  };

  // সিলেক্ট করা একাধিক প্রোডাক্ট ডিলিট ফাংশন
  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) return;

    if (confirm(`আপনি কি নিশ্চিত ${selectedProducts.length}টি প্রোডাক্ট ডিলিট করবেন?`)) {
      try {
        const batch = writeBatch(db);
        selectedProducts.forEach((id) => {
          batch.delete(doc(db, "products", id));
        });
        await batch.commit();

        selectedProducts.forEach((id) => deleteProduct(id));
        setSelectedProducts([]);
        setShowDeleteModal(true);
      } catch (error) {
        console.error("Batch delete error:", error);
        alert("ডিলিট করতে সমস্যা হয়েছে!");
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((item) => item !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Elham Shop Admin</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const nextVal = !isAudioEnabled;
              setIsAudioEnabled(nextVal);
              localStorage.setItem("elham_audio_alerts", nextVal ? "true" : "false");
              if (nextVal) playOrderSuccessSound();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border ${
              isAudioEnabled
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
            title={isAudioEnabled ? "অ্যালার্ম সাউন্ড টেস্ট করুন" : "ভয়েস ও অ্যালার্ম চালু করুন"}
          >
            🔔 ভয়েস অ্যালার্ম ({isAudioEnabled ? "অন" : "অফ"})
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={products.length > 0 && selectedProducts.length === products.length}
          />
          <span className="text-sm font-medium">সব সিলেক্ট করুন ({selectedProducts.length})</span>
        </div>

        {selectedProducts.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
          >
            সিলেক্ট করা প্রোডাক্ট ডিলিট করুন ({selectedProducts.length})
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-sm">
              <th className="p-3 w-10"></th>
              <th className="p-3">প্রোডাক্ট</th>
              <th className="p-3">ক্যাটাগরি</th>
              <th className="p-3">দাম</th>
              <th className="p-3 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  কোনো প্রোডাক্ট পাওয়া যায়নি!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectOne(product.id)}
                    />
                  </td>
                  <td className="p-3 font-medium flex items-center gap-3">
                    {product.images && product.images[0] && (
                      <img src={product.images[0]} alt="" className="w-10 h-10 object-cover rounded" />
                    )}
                    {product.name}
                  </td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">৳{product.price}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      ডিলিট
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg text-center max-w-sm w-full">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              ✓
            </div>
            <h3 className="text-lg font-bold mb-1">ডিলিট সম্পন্ন হয়েছে!</h3>
            <p className="text-xs text-gray-500 mb-4">সিলেক্ট করা পণ্যগুলো সফলভাবে ডাটাবেস থেকে মুছে ফেলা হয়েছে।</p>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="w-full bg-black text-white py-2 rounded-md font-medium text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};