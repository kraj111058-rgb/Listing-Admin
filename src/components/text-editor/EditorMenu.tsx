import React, { useState } from 'react'
import { Editor, useEditorState } from '@tiptap/react'
import { BubbleMenu as TiptapBubbleMenu, FloatingMenu as TiptapFloatingMenu } from "@tiptap/react/menus"
import {
  Ban,
  Bold,
  Code,
  Highlighter,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  Type,
  Underline as UnderlineIcon,
  Undo2,
  UnlinkIcon,
} from 'lucide-react'
import AppTooltip from '@/components/common/AppTooltip'
import PopoverMenu from '@/components/common/PopoverMenu'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

const EDITOR_COLORS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Black', value: '#000000' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Yellow', value: '#eab308' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'disable', value: '' },
]

// 1. Link Component with Popover
export function LinkComponent({
  editor,
  trigger,
}: {
  editor: Editor
  trigger: React.ReactElement
}) {
  const [linkUrl, setLinkUrl] = useState('')
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false)

  const handleSetLink = () => {
    if (linkUrl.trim()) {
      (editor.chain().focus() as any).extendMarkRange('link').setLink({ href: linkUrl.trim() }).run()
    } else {
      (editor.chain().focus() as any).extendMarkRange('link').unsetLink().run()
    }
    setIsLinkPopoverOpen(false)
    setLinkUrl('')
  }

  return (
    <PopoverMenu
      open={isLinkPopoverOpen}
      onOpenChange={setIsLinkPopoverOpen}
      trigger={<div>{trigger}</div>}
      contentClass="w-80 p-4"
    >
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-sm text-foreground">Insert Link</h3>
        <Input
          placeholder="https://example.com"
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSetLink()
            }
          }}
        />
        <div className="flex justify-between items-center pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsLinkPopoverOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSetLink}
          >
            Save
          </Button>
        </div>
      </div>
    </PopoverMenu>
  )
}

// 2. Image Component with Popover (Image upload / url menu)
export function ImageComponent({
  editor,
  trigger,
}: {
  editor: Editor
  trigger: React.ReactElement
}) {
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false)

  const handleInsertImage = () => {
    if (imageUrl.trim()) {
      (editor.chain().focus() as any).setImage({
        src: imageUrl.trim(),
        alt: altText.trim() || undefined,
      }).run()
      setImageUrl('')
      setAltText('')
      setIsImagePopoverOpen(false)
    }
  }

  return (
    <PopoverMenu
      open={isImagePopoverOpen}
      onOpenChange={setIsImagePopoverOpen}
      trigger={<div>{trigger}</div>}
      contentClass="w-80 p-4"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="size-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Insert Image URL</h3>
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Image URL *
            </label>
            <Input
              placeholder="https://example.com/image.jpg"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleInsertImage()
                }
              }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Alt Text (optional)
            </label>
            <Input
              placeholder="Image description"
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleInsertImage()
                }
              }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsImagePopoverOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!imageUrl.trim()}
            onClick={handleInsertImage}
          >
            Insert Image
          </Button>
        </div>
      </div>
    </PopoverMenu>
  )
}

// 3. Main ToolBar
export const ToolBar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        isUnderline: ctx.editor.isActive('underline') ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        isHighlight: !!ctx.editor.getAttributes('highlight')?.color,
        highlightColor: ctx.editor.getAttributes('highlight')?.color || '',
        textColor: ctx.editor.getAttributes('textStyle')?.color || '',
        isLink: ctx.editor.isActive('link') ?? false,
        isLeft: ctx.editor.isActive({ textAlign: 'left' }) ?? false,
        isCenter: ctx.editor.isActive({ textAlign: 'center' }) ?? false,
        isRight: ctx.editor.isActive({ textAlign: 'right' }) ?? false,
        isJustify: ctx.editor.isActive({ textAlign: 'justify' }) ?? false,
        canRedo: editor.can().redo(),
        canUndo: editor.can().undo(),
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
      }
    },
  })

  const handleHeadingChange = (value: string | null) => {
    if (!value) return

    if (editor.isEmpty) {
      editor.commands.clearNodes()
    }

    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run()
    } else {
      const level = Number.parseInt(value.replace('heading', '')) as 1 | 2 | 3 | 4 | 5 | 6
      editor.chain().focus().setHeading({ level }).run()
    }
  }

  const headingValue = editorState.isHeading1
    ? 'heading1'
    : editorState.isHeading2
    ? 'heading2'
    : editorState.isHeading3
    ? 'heading3'
    : editorState.isHeading4
    ? 'heading4'
    : editorState.isHeading5
    ? 'heading5'
    : editorState.isHeading6
    ? 'heading6'
    : 'paragraph'

  const headingOptions = [
    { label: 'Paragraph', value: 'paragraph' },
    { label: 'Heading 1', value: 'heading1' },
    { label: 'Heading 2', value: 'heading2' },
    { label: 'Heading 3', value: 'heading3' },
    { label: 'Heading 4', value: 'heading4' },
    { label: 'Heading 5', value: 'heading5' },
    { label: 'Heading 6', value: 'heading6' },
  ]

  return (
    <div className={cn('bg-background sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-input p-2 rounded-t-lg')}>
      {/* Headings Selector using direct Select from @/components/ui/select */}
      <Select
        value={headingValue}
        onValueChange={(val) => handleHeadingChange(val as string | null)}
        items={headingOptions}
      >
        <SelectTrigger
          size="sm"
          className="w-36 h-8 text-xs cursor-pointer justify-between bg-background"
        >
          <SelectValue placeholder="Paragraph">
            {headingOptions.find((o) => o.value === headingValue)?.label || 'Paragraph'}
          </SelectValue>
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent className="z-50 min-w-36">
            <SelectGroup>
              {headingOptions.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="cursor-pointer text-xs"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </SelectPositioner>
      </Select>

      {/* Bold */}
      <AppTooltip label="Bold">
        <Toggle
          size="sm"
          variant="outline"
          pressed={editorState.isBold}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Toggle bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
      </AppTooltip>

      {/* Italic */}
      <AppTooltip label="Italic">
        <Toggle
          size="sm"
          variant="outline"
          pressed={editorState.isItalic}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Toggle italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
      </AppTooltip>

      {/* Underline */}
      <AppTooltip label="Underline">
        <Toggle
          size="sm"
          variant="outline"
          pressed={editorState.isUnderline}
          onPressedChange={() => (editor.chain().focus() as any).toggleUnderline().run()}
          aria-label="Toggle underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
      </AppTooltip>

      {/* Strikethrough */}
      <AppTooltip label="Strike">
        <Toggle
          size="sm"
          variant="outline"
          pressed={editorState.isStrike}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Toggle strike"
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
      </AppTooltip>

      {/* Highlight Color Dropdown */}
      <AppTooltip label="Highlight">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Toggle
                size="sm"
                variant="outline"
                pressed={!!editorState.isHighlight}
                aria-label="Toggle highlight"
              >
                <Highlighter className="h-4 w-4" />
              </Toggle>
            }
          />
          <DropdownMenuContent align="center" className="w-fit min-w-fit flex flex-wrap items-center">
            {EDITOR_COLORS.map((color) => (
              <React.Fragment key={color.label}>
                {color.label === 'disable' && <div className="bg-input mx-1 h-5 w-px" />}
                <DropdownMenuItem
                  className="cursor-pointer px-1.5"
                  onClick={() =>
                    color.label === 'disable'
                      ? (editor.chain().focus() as any).unsetHighlight().run()
                      : (editor.chain().focus() as any).toggleHighlight({ color: color.value }).run()
                  }
                >
                  {color.label === 'disable' ? (
                    <Ban className="size-4" />
                  ) : (
                    <span
                      className={cn(
                        'w-4 h-4 border border-input rounded-full',
                        editorState.highlightColor === color.value &&
                          color.label !== 'disable' &&
                          'outline-2 outline-accent ring-2 ring-primary'
                      )}
                      style={{ backgroundColor: color.value }}
                    />
                  )}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </AppTooltip>

      {/* Text Color Dropdown */}
      <AppTooltip label="Color">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Toggle
                size="sm"
                variant="outline"
                pressed={!!editorState.textColor}
                aria-label="Toggle color"
              >
                <Type className="h-4 w-4" />
              </Toggle>
            }
          />
          <DropdownMenuContent align="center" className="w-fit min-w-fit flex flex-wrap items-center">
            {EDITOR_COLORS.map((color) => (
              <React.Fragment key={color.label}>
                {color.label === 'disable' && <div className="bg-input mx-1 h-5 w-px" />}
                <DropdownMenuItem
                  className="cursor-pointer px-1.5"
                  onClick={() =>
                    color.label === 'disable'
                      ? (editor.chain().focus() as any).unsetColor().run()
                      : (editor.chain().focus() as any).setColor(color.value).run()
                  }
                >
                  {color.label === 'disable' ? (
                    <Ban className="size-4" />
                  ) : (
                    <span
                      className={cn(
                        'w-4 h-4 border border-input rounded-full',
                        editorState.textColor === color.value &&
                          color.label !== 'disable' &&
                          'outline-2 outline-accent ring-2 ring-primary'
                      )}
                      style={{ backgroundColor: color.value }}
                    />
                  )}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </AppTooltip>

      {/* Code */}
      <AppTooltip label="Code">
        <Toggle
          size="sm"
          variant="outline"
          pressed={editorState.isCode}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
          aria-label="Toggle code"
        >
          <Code className="h-4 w-4" />
        </Toggle>
      </AppTooltip>

      {/* Bullet List */}
      <AppTooltip label="Bullet list">
        <Toggle
          size="sm"
          variant="outline"
          pressed={editorState.isBulletList}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Toggle bullet list"
        >
          <List className="h-4 w-4" />
        </Toggle>
      </AppTooltip>

      {/* Ordered List */}
      <AppTooltip label="Ordered list">
        <Toggle
          size="sm"
          variant="outline"
          pressed={editorState.isOrderedList}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Toggle ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
      </AppTooltip>

      {/* Blockquote */}
      <AppTooltip label="Blockquote">
        <Toggle
          size="sm"
          variant="outline"
          pressed={editorState.isBlockquote}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Toggle blockquote"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </AppTooltip>

      {/* Link / Unlink */}
      {editorState.isLink ? (
        <AppTooltip label="Unlink">
          <Toggle
            size="sm"
            variant="outline"
            pressed
            onPressedChange={() => (editor.chain().focus() as any).extendMarkRange('link').unsetLink().run()}
            aria-label="Unlink"
          >
            <UnlinkIcon className="h-4 w-4" />
          </Toggle>
        </AppTooltip>
      ) : (
        <LinkComponent
          editor={editor}
          trigger={
            <AppTooltip label="Link">
              <Toggle size="sm" variant="outline" aria-label="Toggle link">
                <LinkIcon className="h-4 w-4" />
              </Toggle>
            </AppTooltip>
          }
        />
      )}

      {/* Image Upload URL */}
      <ImageComponent
        editor={editor}
        trigger={
          <AppTooltip label="Insert Image URL">
            <Toggle size="sm" variant="outline" aria-label="Insert image">
              <ImageIcon className="h-4 w-4 text-primary" />
            </Toggle>
          </AppTooltip>
        }
      />

      <div className="bg-input mx-1 h-6 w-px shrink-0" />

      {/* Align Left */}
      <AppTooltip label="Left">
        <Toggle
          size="sm"
          variant="outline"
          pressed={editorState.isLeft}
          onPressedChange={() => (editor.chain().focus() as any).setTextAlign('left').run()}
          aria-label="Toggle left"
        >
          <TextAlignStart className="h-4 w-4" />
        </Toggle>
      </AppTooltip>

      {/* Align Center */}
      <AppTooltip label="Center">
        <Toggle
          size="sm"
          variant="outline"
          pressed={editorState.isCenter}
          onPressedChange={() => (editor.chain().focus() as any).setTextAlign('center').run()}
          aria-label="Toggle center"
        >
          <TextAlignCenter className="h-4 w-4" />
        </Toggle>
      </AppTooltip>

      {/* Align Right */}
      <AppTooltip label="Right">
        <Toggle
          size="sm"
          variant="outline"
          pressed={editorState.isRight}
          onPressedChange={() => (editor.chain().focus() as any).setTextAlign('right').run()}
          aria-label="Toggle right"
        >
          <TextAlignEnd className="h-4 w-4" />
        </Toggle>
      </AppTooltip>

      {/* Align Justify */}
      <AppTooltip label="Justify">
        <Toggle
          size="sm"
          variant="outline"
          pressed={editorState.isJustify}
          onPressedChange={() => (editor.chain().focus() as any).setTextAlign('justify').run()}
          aria-label="Toggle justify"
        >
          <TextAlignJustify className="h-4 w-4" />
        </Toggle>
      </AppTooltip>

      <div className="bg-input mx-1 h-6 w-px shrink-0" />

      {/* Undo */}
      <AppTooltip label="Undo">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          aria-label="Undo"
          className="h-8 w-8 p-0"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
      </AppTooltip>

      {/* Redo */}
      <AppTooltip label="Redo">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          aria-label="Redo"
          className="h-8 w-8 p-0"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </AppTooltip>
    </div>
  )
}

// 4. Bubble Menu
export const BubbleMenu = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        isUnderline: ctx.editor.isActive('underline') ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        isLink: ctx.editor.isActive('link') ?? false,
      }
    },
  })

  return (
    <TiptapBubbleMenu
      editor={editor}
      className="flex items-center gap-1 bg-background border border-input rounded-md shadow-md p-1"
    >
      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isBold}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isItalic}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isUnderline}
        onPressedChange={() => (editor.chain().focus() as any).toggleUnderline().run()}
        aria-label="Toggle underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isStrike}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Toggle strike through"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isCode}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        aria-label="Toggle code"
      >
        <Code className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isBulletList}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Toggle bullet list"
      >
        <List className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isOrderedList}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Toggle ordered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isBlockquote}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Toggle blockquote"
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      <div className="bg-input mx-1 h-6 w-px shrink-0" />

      {editorState.isLink ? (
        <Toggle
          size="sm"
          variant="outline"
          pressed
          onPressedChange={() => (editor.chain().focus() as any).extendMarkRange('link').unsetLink().run()}
          aria-label="Unlink"
        >
          <UnlinkIcon className="h-4 w-4" />
        </Toggle>
      ) : (
        <LinkComponent
          editor={editor}
          trigger={
            <Toggle size="sm" variant="outline" aria-label="Toggle link">
              <LinkIcon className="h-4 w-4" />
            </Toggle>
          }
        />
      )}

      <ImageComponent
        editor={editor}
        trigger={
          <Toggle size="sm" variant="outline" aria-label="Insert image">
            <ImageIcon className="h-4 w-4 text-primary" />
          </Toggle>
        }
      />
    </TiptapBubbleMenu>
  )
}

// 5. Floating Menu
export const FloatingMenu = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        isUnderline: ctx.editor.isActive('underline') ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        isLink: ctx.editor.isActive('link') ?? false,
      }
    },
  })

  return (
    <TiptapFloatingMenu
      editor={editor}
      className="flex items-center gap-1 bg-background border border-input rounded-md shadow-md p-1"
    >
      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isBold}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isItalic}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isUnderline}
        onPressedChange={() => (editor.chain().focus() as any).toggleUnderline().run()}
        aria-label="Toggle underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isStrike}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Toggle strike through"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isCode}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        aria-label="Toggle code"
      >
        <Code className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isBulletList}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Toggle bullet list"
      >
        <List className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isOrderedList}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Toggle ordered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        variant="outline"
        pressed={editorState.isBlockquote}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Toggle blockquote"
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      <div className="bg-input mx-1 h-6 w-px shrink-0" />

      {editorState.isLink ? (
        <Toggle
          size="sm"
          variant="outline"
          pressed
          onPressedChange={() => (editor.chain().focus() as any).extendMarkRange('link').unsetLink().run()}
          aria-label="Unlink"
        >
          <UnlinkIcon className="h-4 w-4" />
        </Toggle>
      ) : (
        <LinkComponent
          editor={editor}
          trigger={
            <Toggle size="sm" variant="outline" aria-label="Toggle link">
              <LinkIcon className="h-4 w-4" />
            </Toggle>
          }
        />
      )}

      <ImageComponent
        editor={editor}
        trigger={
          <Toggle size="sm" variant="outline" aria-label="Insert image">
            <ImageIcon className="h-4 w-4 text-primary" />
          </Toggle>
        }
      />
    </TiptapFloatingMenu>
  )
}

