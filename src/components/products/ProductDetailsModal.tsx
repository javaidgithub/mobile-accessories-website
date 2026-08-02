import React, { useState } from 'react';
import { X, MessageCircle, Phone, MapPin, Tag, CheckCircle, XCircle, Share2, Shield, Info, ArrowRight } from 'lucide-react';
import { Product, ContactInfo } from '../../types';

interface ProductDetailsModalProps {
  product: Product | null;
  relatedProducts: Product[];
  contactInfo: ContactInfo | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateContact: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  relatedProducts,
  contactInfo,
  onClose,
  onSelectProduct,
  onNavigateContact
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.image);
  const [copied, setCopied] = useState(false);

  const images = [product.image, ...(product.additional_images || [])];
  const isInStock = product.stock_status === 'in_stock';

  const handleWhatsAppInquiry = () => {
    if (!contactInfo?.whatsapp) return;
    const cleanPhone = contactInfo.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hi ${contactInfo.owner_name || 'Apex Tech'}! I am interested in purchasing: "${product.name}" ($${product.price.toFixed(2)}). Please let me know item availability and pickup/delivery details.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handlePhoneInquiry = () => {
    if (!contactInfo?.phone) return;
    window.location.href = `tel:${contactInfo.phone}`;
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const specsList = product.specifications
    ? product.specifications.split('\n').filter(line => line.trim() !== '')
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Top Grid: Image & Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative mb-4">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
                    isInStock ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                        activeImage === img ? 'border-orange-500 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{product.category_name}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-bold">{product.brand_name}</span>
                </div>

                <h1 className="text-2xl font-extrabold text-slate-900 mb-3 leading-snug">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Showroom Price:</span>
                  <span className="text-3xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                </div>

                {/* Prominent Direct Contact Banner (No Add to Cart requirement) */}
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Interested in this product?</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Contact us directly via WhatsApp, Phone, or visit our shop to verify stock and purchase!
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleWhatsAppInquiry}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Inquire on WhatsApp
                    </button>

                    <button
                      onClick={handlePhoneInquiry}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition active:scale-95"
                    >
                      <Phone className="w-4 h-4" />
                      Call Shop Owner
                    </button>
                  </div>
                </div>

                {/* Store Location quick link */}
                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    {contactInfo?.shop_name || 'Apex Shop'}: {contactInfo?.address || 'Tech District'}
                  </span>
                  <button
                    onClick={onNavigateContact}
                    className="text-orange-600 hover:underline font-bold flex items-center gap-1"
                  >
                    View Map <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                <span>Ref ID: #{product.id}</span>
                <button
                  onClick={handleCopyShareLink}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-900 font-medium"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copied ? 'Link Copied!' : 'Share Product'}
                </button>
              </div>
            </div>
          </div>

          {/* Description & Specifications Tabs / Sections */}
          <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-500" /> Product Overview
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" /> Key Specifications
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-2">
                {specsList.length > 0 ? (
                  specsList.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2 border-b border-slate-200/60 pb-1.5 last:border-0 last:pb-0">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No detailed specs listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Similar Products in {product.category_name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectProduct(rel);
                      setActiveImage(rel.image);
                    }}
                    className="group bg-slate-50 rounded-xl p-3 border border-slate-200 hover:border-orange-300 hover:bg-white transition cursor-pointer"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-2">
                      <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition" referrerPolicy="no-referrer" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-orange-600">
                      {rel.name}
                    </h4>
                    <p className="text-xs font-extrabold text-orange-600 mt-1">${rel.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
