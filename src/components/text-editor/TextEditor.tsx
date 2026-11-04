import * as React from 'react'
import { EditorContent, useEditor, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Image from '@tiptap/extension-image'
import { BubbleMenu, FloatingMenu, ToolBar } from '@/components/text-editor/EditorMenu'
import ImageNodeView from '@/components/text-editor/ImageNodeView'

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: (element) =>
          element.getAttribute('data-width') || element.style.width || '100%',
        renderHTML: (attributes) => ({
          'data-width': attributes.width,
          style: `width: ${attributes.width}`,
        }),
      },
      alignment: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-alignment') || 'center',
        renderHTML: (attributes) => ({
          'data-alignment': attributes.alignment,
        }),
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },
})

export type TiptapTextEditorProps = {
  isEditMode?: boolean
  id?: string
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

export const TiptapTextEditor = ({
  content,
  onChange,
  placeholder,
  id,
  isEditMode = true,
}: TiptapTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Type something...',
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:float-left before:h-0 before:pointer-events-none before:text-muted-foreground',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      ResizableImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-3 border border-border shadow-xs object-cover',
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base m-0 p-3.5 focus:outline-none max-w-none w-full min-h-[180px]',
      },
    },
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const cleanedHtml = html.replace(/<p>(<br>)?<\/p>/g, '').trim()

      if (cleanedHtml === '') {
        onChange?.('')
      } else {
        onChange?.(html)
      }
    },
    immediatelyRender: false,
  })

  // Keep editor content in sync when form initializes or resets
  React.useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      if (!editor.isFocused) {
        editor.commands.setContent(content || '', { emitUpdate: false })
      }
    }
  }, [content, editor])

  return (
    <div className="border border-input bg-background rounded-lg relative focus-within:ring-1 focus-within:ring-primary/40 focus-within:border-primary transition-all">
      {editor && (
        <>
          {/* Top-Menu */}
          <ToolBar editor={editor} />

          {isEditMode && (
            <div className="hidden md:block">
              {/* Typing-Menu */}
              <FloatingMenu editor={editor} />
              {/* Selection-Menu */}
              <BubbleMenu editor={editor} />
            </div>
          )}
        </>
      )}

      <EditorContent
        editor={editor}
        id={id}
        className="min-h-36"
      />
    </div>
  )
}

export default TiptapTextEditor
