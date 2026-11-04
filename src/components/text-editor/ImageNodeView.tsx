import * as React from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Maximize2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SIZE_PRESETS = ['25%', '50%', '75%', '100%']

export function ImageNodeView({
  node,
  updateAttributes,
  deleteNode,
  selected,
  editor,
  getPos,
}: NodeViewProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isSelected, setIsSelected] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const alignment = (node.attrs.alignment as 'left' | 'center' | 'right') || 'center'
  const currentWidth = (node.attrs.width as string) || '100%'

  // Combined active state (ProseMirror selected, local clicked state, or hovered)
  const isActive = selected || isSelected || isHovered

  // Click on image to select and show toolbar
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSelected(true)
    if (typeof getPos === 'function') {
      const pos = getPos()
      if (typeof pos === 'number') {
        try {
          editor.commands.setNodeSelection(pos)
        } catch {
          // ignore if selection fails
        }
      }
    }
  }

  // Click outside to deselect
  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSelected(false)
      }
    }
    document.addEventListener('mousedown', handleDocumentClick)
    return () => document.removeEventListener('mousedown', handleDocumentClick)
  }, [])

  // Size Down (Smaller by 2%)
  const handleSizeDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    const currentNum = parseInt(currentWidth, 10) || 100
    const nextSmaller = Math.max(5, currentNum - 2)
    updateAttributes({ width: `${nextSmaller}%` })
  }

  // Size Up (Larger by 2%)
  const handleSizeUp = (e: React.MouseEvent) => {
    e.stopPropagation()
    const currentNum = parseInt(currentWidth, 10) || 100
    const nextLarger = Math.min(100, currentNum + 2)
    updateAttributes({ width: `${nextLarger}%` })
  }

  // Set preset size
  const handleSetPreset = (e: React.MouseEvent, sz: string) => {
    e.stopPropagation()
    updateAttributes({ width: sz })
  }

  // Set alignment (side)
  const handleSetAlignment = (e: React.MouseEvent, align: 'left' | 'center' | 'right') => {
    e.stopPropagation()
    updateAttributes({ alignment: align })
  }

  // Move block Up in document
  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (typeof getPos !== 'function') return
    const pos = getPos()
    if (typeof pos !== 'number') return
    const { state, dispatch } = editor.view
    const $pos = state.doc.resolve(pos)
    const index = $pos.index()
    if (index <= 0) return

    const prevNode = $pos.parent.child(index - 1)
    const prevPos = pos - prevNode.nodeSize
    const currentNode = state.doc.nodeAt(pos)
    if (!currentNode) return

    const tr = state.tr
    tr.delete(pos, pos + currentNode.nodeSize)
    tr.insert(prevPos, currentNode)
    dispatch(tr)
  }

  // Move block Down in document
  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (typeof getPos !== 'function') return
    const pos = getPos()
    if (typeof pos !== 'number') return
    const { state, dispatch } = editor.view
    const $pos = state.doc.resolve(pos)
    const index = $pos.index()
    if (index >= $pos.parent.childCount - 1) return

    const nextNode = $pos.parent.child(index + 1)
    const currentNode = state.doc.nodeAt(pos)
    if (!currentNode) return

    const tr = state.tr
    tr.delete(pos, pos + currentNode.nodeSize)
    tr.insert(pos + nextNode.nodeSize, currentNode)
    dispatch(tr)
  }

  // Delete image
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNode()
  }

  // Drag to resize corner handle
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const container = containerRef.current
    if (!container) return
    const parentWidth = container.parentElement?.getBoundingClientRect().width || 600
    const initialWidthPx = container.getBoundingClientRect().width

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const newWidthPx = Math.max(120, Math.min(parentWidth, initialWidthPx + deltaX))
      const percent = Math.min(100, Math.max(15, Math.round((newWidthPx / parentWidth) * 100)))
      updateAttributes({ width: `${percent}%` })
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <NodeViewWrapper
      className={cn(
        'my-6 flex w-full transition-all',
        alignment === 'left' && 'justify-start',
        alignment === 'center' && 'justify-center',
        alignment === 'right' && 'justify-end'
      )}
    >
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative group inline-block max-w-full rounded-xl transition-all cursor-pointer select-none',
          isActive && 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg'
        )}
        style={{ width: currentWidth }}
      >
        {/* The Actual Image */}
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          className="w-full h-auto rounded-xl object-cover border border-border block"
          draggable={false}
        />

        {/* Floating Controls Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center flex-wrap gap-1 p-1.5 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-2xl transition-all duration-200 pointer-events-auto',
            isActive
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          )}
        >
          {/* 1. Side Alignment (Left, Center, Right) */}
          <div className="flex items-center gap-0.5 bg-muted/60 p-0.5 rounded-lg border border-border/50">
            <button
              type="button"
              title="Align Left (Side)"
              onClick={(e) => handleSetAlignment(e, 'left')}
              className={cn(
                'size-7 rounded-md flex items-center justify-center text-xs transition-colors cursor-pointer',
                alignment === 'left'
                  ? 'bg-primary text-primary-foreground shadow-2xs font-bold'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <AlignLeft className="size-3.5" />
            </button>
            <button
              type="button"
              title="Align Center"
              onClick={(e) => handleSetAlignment(e, 'center')}
              className={cn(
                'size-7 rounded-md flex items-center justify-center text-xs transition-colors cursor-pointer',
                alignment === 'center'
                  ? 'bg-primary text-primary-foreground shadow-2xs font-bold'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <AlignCenter className="size-3.5" />
            </button>
            <button
              type="button"
              title="Align Right (Side)"
              onClick={(e) => handleSetAlignment(e, 'right')}
              className={cn(
                'size-7 rounded-md flex items-center justify-center text-xs transition-colors cursor-pointer',
                alignment === 'right'
                  ? 'bg-primary text-primary-foreground shadow-2xs font-bold'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <AlignRight className="size-3.5" />
            </button>
          </div>

          <div className="w-px h-5 bg-border mx-0.5 shrink-0" />

          {/* 2. Size Up / Down */}
          <div className="flex items-center gap-0.5 bg-muted/60 p-0.5 rounded-lg border border-border/50">
            <button
              type="button"
              title="Size Down (Smaller)"
              onClick={handleSizeDown}
              className="size-7 rounded-md flex items-center justify-center text-xs hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="text-[11px] font-bold text-foreground px-1 select-none min-w-[36px] text-center">
              {currentWidth}
            </span>
            <button
              type="button"
              title="Size Up (Larger)"
              onClick={handleSizeUp}
              className="size-7 rounded-md flex items-center justify-center text-xs hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          {/* 3. Quick Size Presets */}
          <div className="flex items-center gap-0.5">
            {SIZE_PRESETS.map((sz) => (
              <button
                key={sz}
                type="button"
                title={`Set width to ${sz}`}
                onClick={(e) => handleSetPreset(e, sz)}
                className={cn(
                  'px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer',
                  currentWidth === sz
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {sz}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-border mx-0.5 shrink-0" />

          {/* 4. Position Move Up / Down in Blog Content */}
          <div className="flex items-center gap-0.5 bg-muted/60 p-0.5 rounded-lg border border-border/50">
            <button
              type="button"
              title="Move Image Up"
              onClick={handleMoveUp}
              className="size-7 rounded-md flex items-center justify-center text-xs hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowUp className="size-3.5" />
            </button>
            <button
              type="button"
              title="Move Image Down"
              onClick={handleMoveDown}
              className="size-7 rounded-md flex items-center justify-center text-xs hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowDown className="size-3.5" />
            </button>
          </div>

          <div className="w-px h-5 bg-border mx-0.5 shrink-0" />

          {/* 5. Delete Image */}
          <button
            type="button"
            title="Delete Image"
            onClick={handleDelete}
            className="size-7 rounded-md flex items-center justify-center text-xs hover:bg-destructive/10 text-destructive transition-colors cursor-pointer"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>

        {/* Info Badge (Bottom-Left) */}
        {isActive && (
          <div className="absolute bottom-2 left-2 z-20 px-2 py-0.5 rounded-md bg-background/90 backdrop-blur-sm border border-border text-[10px] font-semibold text-muted-foreground shadow-xs pointer-events-none capitalize">
            {currentWidth} • {alignment}
          </div>
        )}

        {/* Interactive Drag Corner Handle (Bottom-Right) */}
        {isActive && (
          <div
            onMouseDown={handleMouseDown}
            title="Drag to resize size smoothly"
            className="absolute -bottom-1.5 -right-1.5 size-5 rounded-full bg-primary border-2 border-background cursor-nwse-resize shadow-lg flex items-center justify-center z-30 hover:scale-125 transition-transform"
          >
            <Maximize2 className="size-2.5 text-primary-foreground rotate-90" />
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

export default ImageNodeView
