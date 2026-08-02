import React from 'react';
import { Category } from '../types';
import { Smartphone, Zap, Cable, BatteryCharging, Headphones, Volume2, Watch, ShieldCheck, Maximize2, Car, Layers, ArrowRight } from 'lucide-react';

interface CategoriesPageProps {
  categories: Category[];
  onSelectCategory: (categoryId: number) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories, onSelectCategory }) => {
  const getIconComponent = (name?: string) => {
    switch (name) {
      case 'Smartphone': return <Smartphone className="w-8 h-8" />;
      case 'Zap': return <Zap className="w-8 h-8" />;
      case 'Cable': return <Cable className="w-8 h-8" />;
      case 'BatteryCharging': return <BatteryCharging className="w-8 h-8" />;
      case 'Headphones': return <Headphones className="w-8 h-8" />;
      case 'Volume2': return <Volume2 className="w-8 h-8" />;
      case 'Watch': return <Watch className="w-8 h-8" />;
      case 'ShieldCheck': return <ShieldCheck className="w-8 h-8" />;
      case 'Maximize2': return <Maximize2 className="w-8 h-8" />;
      case 'Car': return <Car className="w-8 h-8" />;
      case 'Layers': return <Layers className="w-8 h-8" />;
      default: return <Smartphone className="w-8 h-8" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
          Organized Showcase
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Browse Product Categories
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Find exact mobile accessories tailored to your device requirements. Click on any category to view available stock and pricing details.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-5 group-hover:bg-orange-500 group-hover:text-white transition duration-300 shadow-sm">
                {getIconComponent(cat.iconName)}
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition mb-2">
                {cat.name}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {cat.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                {cat.product_count || 0} Products
              </span>
              <span className="text-orange-600 group-hover:translate-x-1 transition flex items-center gap-1">
                Explore Items <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
