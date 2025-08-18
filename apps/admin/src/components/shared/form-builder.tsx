'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Loader2 } from 'lucide-react'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'multiselect' | 'tags'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: (value: any) => string | null
  description?: string
}

interface FormBuilderProps {
  fields: FormField[]
  initialValues?: Record<string, any>
  onSubmit: (values: Record<string, any>) => Promise<void> | void
  submitLabel?: string
  loading?: boolean
  title?: string
  description?: string
}

export function FormBuilder({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = 'Submit',
  loading = false,
  title,
  description,
}: FormBuilderProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleTagAdd = (name: string, tag: string) => {
    const currentTags = values[name] || []
    if (tag.trim() && !currentTags.includes(tag.trim())) {
      handleChange(name, [...currentTags, tag.trim()])
    }
  }

  const handleTagRemove = (name: string, tagToRemove: string) => {
    const currentTags = values[name] || []
    handleChange(name, currentTags.filter((tag: string) => tag !== tagToRemove))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    fields.forEach(field => {
      const value = values[field.name]
      
      // Required field validation
      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.name] = `${field.label} is required`
        return
      }

      // Custom validation
      if (field.validation && value) {
        const error = field.validation(value)
        if (error) {
          newErrors[field.name] = error
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const value = values[field.name] || ''
    const error = errors[field.name]

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
            rows={4}
          />
        )

      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(newValue) => handleChange(field.name, newValue)}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'multiselect':
        return (
          <div className="space-y-2">
            <Select
              onValueChange={(newValue) => {
                const currentValues = values[field.name] || []
                if (!currentValues.includes(newValue)) {
                  handleChange(field.name, [...currentValues, newValue])
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {value.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {value.map((item: string) => (
                  <Badge key={item} variant="secondary" className="flex items-center gap-1">
                    {field.options?.find(opt => opt.value === item)?.label || item}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        const newValues = value.filter((v: string) => v !== item)
                        handleChange(field.name, newValues)
                      }}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )

      case 'tags':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder={field.placeholder || 'Add tag and press Enter'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const input = e.target as HTMLInputElement
                    handleTagAdd(field.name, input.value)
                    input.value = ''
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.querySelector(`input[placeholder*="Add tag"]`) as HTMLInputElement
                  if (input?.value) {
                    handleTagAdd(field.name, input.value)
                    input.value = ''
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {value.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {value.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleTagRemove(field.name, tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        )
    }
  }

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </CardHeader>
      )}
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {renderField(field)}
              
              {field.description && (
                <p className="text-sm text-gray-500">{field.description}</p>
              )}
              
              {errors[field.name] && (
                <Alert variant="destructive">
                  <AlertDescription>{errors[field.name]}</AlertDescription>
                </Alert>
              )}
            </div>
          ))}

          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}