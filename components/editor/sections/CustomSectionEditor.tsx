'use client';

import { ResumeSection, CustomData, CustomItem } from '@/types';
import { useResumeStore } from '@/stores';
import { Plus, Trash2, Heart, Book, Clock, Quote } from 'lucide-react';
import { useState } from 'react';

interface CustomSectionEditorProps {
  section: ResumeSection;
}

export function CustomSectionEditor({ section }: CustomSectionEditorProps) {
  const updateSection = useResumeStore((state) => state.updateSection);
  const data = (section.data as CustomData) || { type: 'freeform', items: [] };
  const [sectionType, setSectionType] = useState<CustomData['type']>(data.type);

  const addItem = () => {
    const newItem: CustomItem = {
      id: Date.now().toString(),
      text: '',
      value: sectionType === 'timeline' ? 10 : undefined,
      color: sectionType === 'timeline' ? '#3b82f6' : undefined,
    };
    updateSection(section.id, {
      data: { ...data, items: [...data.items, newItem] },
    });
  };

  const removeItem = (id: string) => {
    updateSection(section.id, {
      data: { ...data, items: data.items.filter((item) => item.id !== id) },
    });
  };

  const updateItem = (id: string, updates: Partial<CustomItem>) => {
    updateSection(section.id, {
      data: {
        ...data,
        items: data.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      },
    });
  };

  const changeSectionType = (newType: CustomData['type']) => {
    setSectionType(newType);
    updateSection(section.id, {
      data: { ...data, type: newType } as CustomData,
    });
  };

  const iconMap = {
    hobbies: Heart,
    books: Book,
    timeline: Clock,
    philosophy: Quote,
    freeform: Plus,
  };

  const Icon = iconMap[sectionType];

  return (
    <div className="space-y-6">
      {/* Section Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Section Type
        </label>
        <select
          value={sectionType}
          onChange={(e) => changeSectionType(e.target.value as CustomData['type'])}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="freeform">Freeform Text</option>
          <option value="hobbies">Hobbies & Interests</option>
          <option value="books">Favorite Books</option>
          <option value="timeline">Time Allocation (Pie Chart)</option>
          <option value="philosophy">Life Philosophy / Quotes</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Choose how to display this custom section
        </p>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {data.items.map((item, idx) => (
          <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-2" />
              
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(item.id, { text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder={
                    sectionType === 'hobbies' ? 'e.g., Photography, Hiking' :
                    sectionType === 'books' ? 'e.g., "Atomic Habits" by James Clear' :
                    sectionType === 'timeline' ? 'e.g., Coding Projects' :
                    sectionType === 'philosophy' ? 'e.g., "Stay hungry, stay foolish"' :
                    'Enter text...'
                  }
                />

                {sectionType === 'timeline' && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-600 mb-1 block">
                        Percentage: {item.value}%
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={item.value || 10}
                        onChange={(e) => updateItem(item.id, { value: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Color</label>
                      <input
                        type="color"
                        value={item.color || '#3b82f6'}
                        onChange={(e) => updateItem(item.id, { color: e.target.value })}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Item
      </button>

      {/* Help Text */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900 font-medium mb-1">
          {sectionType === 'hobbies' && '💡 Hobbies & Interests'}
          {sectionType === 'books' && '📚 Favorite Books'}
          {sectionType === 'timeline' && '⏰ Time Allocation'}
          {sectionType === 'philosophy' && '💭 Life Philosophy'}
          {sectionType === 'freeform' && '✨ Freeform Section'}
        </p>
        <p className="text-xs text-blue-800">
          {sectionType === 'hobbies' && 'List your hobbies and interests to show personality'}
          {sectionType === 'books' && 'Share books that influenced you professionally or personally'}
          {sectionType === 'timeline' && 'Show how you allocate your time (visualized as pie chart)'}
          {sectionType === 'philosophy' && 'Share quotes or philosophies that guide your work'}
          {sectionType === 'freeform' && 'Add any custom content to make your resume unique'}
        </p>
      </div>
    </div>
  );
}
