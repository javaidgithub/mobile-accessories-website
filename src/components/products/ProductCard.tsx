import React from 'react';
import { MessageCircle, Phone, Tag, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { Product, ContactInfo } from '../../types';

interface ProductCardProps {
  product: Product;
  contactInfo: ContactInfo | null;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, contactInfo, onSelect }) => {
  const isInStock = product.stock_status === 'in_stock';

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contactInfo?.whatsapp) return;
    const cleanPhone = contactInfo.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hi ${contactInfo.owner_name || 'there'}! I am interested in purchasing: "${product.name}" ($${product.price.toFixed(2)}). Is it currently available at your shop?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handlePhoneInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contactInfo?.phone) return;
    window.location.href = `tel:${contactInfo.phone}`;
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      <div>
        {/* Product Image Header */}
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${
                isInStock
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-rose-500/90 text-white'
              }`}
            >
              {isInStock ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> In Stock
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" /> Out of Stock
                </>
              )}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className="bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs px-2.5 py-1 rounded-lg font-medium shadow-sm">
              {product.brand_name || 'Brand'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2 text-xs font-medium text-orange-600 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>{product.category_name || 'Accessory'}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer & Pricing */}
      <div className="px-5 pb-5 pt-0">
        <div className="flex items-baseline justify-between mb-4 border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-400 font-medium">Retail Price</span>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Direct Inquiry Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleWhatsAppInquiry}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
            title="Chat on WhatsApp about this product"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </button>
          <button
            onClick={handlePhoneInquiry}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
            title="Call store directly"
          >
            <Phone className="w-3.5 h-3.5" />
            Call Store
          </button>
        </div>
      </div>
    </div>
  );
};
