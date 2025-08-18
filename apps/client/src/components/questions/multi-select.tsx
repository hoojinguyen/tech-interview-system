'use client'

import { useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Badge,
} from '@/components/ui'
import { cn } from '@/lib/utils'

interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  searchable?: boolean
  maxDisplay?: number
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  searchable = false,
  maxDisplay = 3,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value]
    
    onChange(newSelected)
  }

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selected.filter(item => item !== value))
  }

  const displaySelected = selected.slice(0, maxDisplay)
  const remainingCount = selected.length - maxDisplay

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-[2.5rem] px-3 py-2"
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {displaySelected.map((value) => {
                  const option = options.find(opt => opt.value === value)
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="text-xs"
                    >
                      {option?.label || value}
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRemove(value, e as any)
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => handleRemove(value, e)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  )
                })}
                {remainingCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    +{remainingCount} more
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          {searchable && (
            <CommandInput placeholder="Search..." className="h-9" />
          )}
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}