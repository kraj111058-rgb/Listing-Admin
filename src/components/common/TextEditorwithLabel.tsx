import { FieldWrapper } from "@/components/common/FieldWrapper"
import TiptapTextEditor from "@/components/text-editor/TextEditor"

export interface TextEditorwithLabelProps {
  id: string
  label?: string
  description?: string
  descriptionClassName?: string
  placeholder?: string
  content?: string
  onChange: (content: string) => void
  error?: string
  required?: boolean
  isEditMode?: boolean
}

export function TextEditorwithLabel({
  id,
  label,
  description,
  descriptionClassName,
  placeholder,
  content,
  onChange,
  error,
  required,
  isEditMode,
}: TextEditorwithLabelProps) {
  return (
    <FieldWrapper
      label={label}
      id={id}
      description={description}
      descriptionClassName={descriptionClassName}
      error={error}
      required={required}
    >
      <TiptapTextEditor
        id={id}
        placeholder={placeholder}
        content={content || ""}
        onChange={(val) => onChange(val)}
        isEditMode={isEditMode}
      />
    </FieldWrapper>
  )
}

export default TextEditorwithLabel

