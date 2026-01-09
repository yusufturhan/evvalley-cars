"use client";

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children, actions }: BottomSheetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(0);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) {
      // Only allow dragging down
      setCurrentY(deltaY);
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setIsDragging(false);
    // If dragged down more than 100px, close the sheet
    if (currentY > 100) {
      onClose();
    }
    setCurrentY(0);
  };

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 md:hidden transition-transform duration-300 ease-out"
        style={{
          height: '85vh',
          transform: isDragging ? `translateY(${currentY}px)` : 'translateY(0)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable area */}
        <div className={`overflow-y-auto overscroll-contain ${actions ? 'h-[calc(85vh-224px)]' : 'h-[calc(85vh-80px)]'}`}>
          <div className="px-4 py-4">
            {children}
          </div>
        </div>

        {/* Fixed Actions (if provided) - Above bottom nav bar */}
        {actions && (
          <div className="absolute bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
            {actions}
          </div>
        )}
      </div>
    </>
  );
}
