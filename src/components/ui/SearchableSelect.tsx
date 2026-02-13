'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';

interface Option {
    label: string;
    value: string | number;
}

interface SearchableSelectProps {
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    className = '',
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter options
    const filteredOptions = useMemo(() => {
        return options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    // Find selected label
    const selectedLabel = options.find((opt) => opt.value === value)?.label || '';

    const handleSelect = (val: string | number) => {
        onChange(val);
        setIsOpen(false);
        setSearchTerm(''); // Reset search
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {/* Trigger Button */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center cursor-pointer transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[rgb(var(--primary))]'
                    } ${isOpen ? 'border-[rgb(var(--primary))] ring-1 ring-[rgb(var(--primary))]' : ''}`}
            >
                <span className={selectedLabel ? 'text-white' : 'text-[rgb(var(--text-muted))]'}>
                    {selectedLabel || placeholder}
                </span>
                <svg
                    className={`w-4 h-4 text-[rgb(var(--text-muted))] transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-[#2a2a2a] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
                    {/* Search Input */}
                    <div className="p-2 border-b border-white/10 sticky top-0 bg-[#2a2a2a]">
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-[rgb(var(--primary))]"
                            placeholder="ค้นหา..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`p-3 cursor-pointer text-sm transition-colors ${value === option.value
                                            ? 'bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] font-medium'
                                            : 'text-white hover:bg-white/5'
                                        }`}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-[rgb(var(--text-muted))] text-sm">
                                ไม่พบข้อมูล
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
