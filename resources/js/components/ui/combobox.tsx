import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';

export interface ComboboxOption {
    value: string;
    label: string;
    keywords?: string;
}

interface ComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    options: ComboboxOption[];
    placeholder?: string;
    emptyText?: string;
    id?: string;
    className?: string;
    disabled?: boolean;
}

export function Combobox({ value, onValueChange, options, placeholder = 'Select...', emptyText = 'No results found.', id, className, disabled }: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const selected = options.find((option) => option.value === value);

    React.useEffect(() => {
        if (!open) {
            setQuery('');
        }
    }, [open]);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = query.trim()
        ? options.filter((option) => `${option.label} ${option.keywords ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()))
        : options;

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <input
                    id={id}
                    ref={inputRef}
                    type="text"
                    disabled={disabled}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                        className,
                    )}
                    placeholder={placeholder}
                    value={open ? query : (selected?.label ?? '')}
                    onFocus={() => {
                        setOpen(true);
                        setQuery('');
                    }}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setOpen(true);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                            setOpen(false);
                            inputRef.current?.blur();
                        } else if (event.key === 'Enter' && filtered.length === 1) {
                            event.preventDefault();
                            onValueChange(filtered[0].value);
                            setOpen(false);
                            inputRef.current?.blur();
                        }
                    }}
                    autoComplete="off"
                />
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 opacity-50" />
            </div>
            {open && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                    {filtered.length === 0 && <div className="px-2 py-1.5 text-sm text-muted-foreground">{emptyText}</div>}
                    {filtered.map((option) => (
                        <div
                            key={option.value}
                            className={cn(
                                'relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm select-none outline-hidden hover:bg-accent hover:text-accent-foreground',
                                option.value === value && 'bg-accent/50',
                            )}
                            onMouseDown={(event) => {
                                event.preventDefault();
                                onValueChange(option.value);
                                setOpen(false);
                            }}
                        >
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                {option.value === value && <Check className="h-4 w-4" />}
                            </span>
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
