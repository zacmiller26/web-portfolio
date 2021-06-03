export type NexusDataType = { [key:string]: string | undefined | null }

export interface FormJsonFieldType {
  type: "string" | "integer" | "decimal" | "float" | "select" |
        "select_multiple" | "radio" | "boolean"
  label: string
  choices?: [string, string][]
  default?: string | null | boolean
  widget?: "Textarea"
  validators?: {
    min_length?: number
    max_length?: number
    max?: number
    min?: number
    required?: boolean
  }
}

export interface FormSchemaType {
  [key: string]: any//FormJsonFieldType
}

export interface ViewerType {
  platform: 'web'
  isMobile: boolean
  maxWidth?: number
  maxHeight?: number
}

interface Props {
  formSchema: FormSchemaType
  nexusData: NexusDataType
  nexusDataErrors?: { [key: string]: string[] }
  setNexusData: Function // (data: FormDataType) => any
  viewer: ViewerType
  isEditor: boolean
}

export interface FormProps extends Props {}

export interface ComponentProps extends Props {}

export type FelstormNexusSectionType = "render" | "form"
