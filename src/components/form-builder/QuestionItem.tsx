'use client'

import { useState } from 'react'
import type { Question } from '@/types/database.types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  GripVertical,
  Lock,
  Pencil,
  Trash2,
  Smile,
  Star,
  AlignLeft,
  CheckSquare,
  CircleDot,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface QuestionItemProps {
  question: Question
  onEdit: () => void
  onDelete: () => void
  disabled?: boolean
  locked?: boolean
}

const typeIcons: Record<string, typeof Smile> = {
  sentiment: Smile,
  star_rating: Star,
  open_text: AlignLeft,
  multiple_choice: CheckSquare,
  single_choice: CircleDot,
}

const typeLabels: Record<string, string> = {
  sentiment: 'Valutazione',
  star_rating: 'Stelle',
  open_text: 'Testo',
  multiple_choice: 'Scelta multipla',
  single_choice: 'Scelta singola',
}

export function QuestionItem({
  question,
  onEdit,
  onDelete,
  disabled,
  locked,
}: QuestionItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const Icon = typeIcons[question.type] || AlignLeft

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'flex items-center gap-3 p-3 border rounded-lg bg-background transition-shadow duration-200',
          isDragging && 'opacity-75 shadow-xl scale-[1.02] ring-2 ring-primary/20 z-50',
          !isDragging && 'hover:shadow-sm',
          disabled && 'opacity-50'
        )}
      >
        <button
          className="touch-none cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="p-2 bg-muted rounded-md">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{question.label}</p>
          <p className="text-xs text-muted-foreground">
            {typeLabels[question.type]}
            {question.is_required && ' • Obbligatoria'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            disabled={disabled}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {locked ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center h-9 w-9">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>La domanda di valutazione generale è obbligatoria</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Elimina domanda</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare la domanda &quot;{question.label}&quot;?
              Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Annulla
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete()
                setShowDeleteConfirm(false)
              }}
            >
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
