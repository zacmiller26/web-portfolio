import * as React from 'react'
import { useMemo, useState } from 'react'

import { ComponentProps, FelstormNexusSectionType, NexusDataType } from '../types'
import FelstormNexusDev from './FelstormNexusDev'

declare global {
  interface Window {
    NEXUS_DATA: any
    NEXUS_HEIGHT?: number
    NEXUS_DATA_UPDATE: (data: { [key: string]: any }) => boolean
  }
}

interface Props {
  formSchema: any
  Component: (props: ComponentProps) => JSX.Element
  useProvidedForm?: boolean
}

export interface FelstormNexusProps extends Props {
  nexusData: NexusDataType
  setNexusData: Function
  section: FelstormNexusSectionType
  setSection: (section: FelstormNexusSectionType) => void
}

const FelstormNexus = (props: Props) => {

  const getDefaultFieldValue = React.useCallback((fieldMeta) => {
    const ft = fieldMeta.type
    if(ft === 'select') {
      return fieldMeta.choices[0][0]
    } else if(ft === 'string') {
      return ''
    } else if(ft === 'integer') {
      return ''
    } else if(ft === 'decimal') {
      return ''
    } else if(ft === 'float') {
      return ''
    } else if(ft === 'select_multiple') {
      return []
    } else if(ft === 'radio') {
      return fieldMeta.choices[0][0]
    } else if(ft === 'boolean') {
      return false
    }
    return ''
  }, [props.formSchema])

  const defaultNexusData = useMemo(() => {
    let blankData: { [key: string]: string } = {}
    Object.entries(props.formSchema).forEach((field) => {
      const fieldName: string = field[0]
      const fieldMeta = field[1]
      blankData[fieldName] = getDefaultFieldValue(fieldMeta)
      return null;
    })
    return blankData
  }, [props.formSchema])

  const [section, setSection] = useState<FelstormNexusSectionType>("render")
  const [nexusData, setNexusData] = useState(defaultNexusData)

  return (
    <FelstormNexusDev
      {...props}
      nexusData={nexusData}
      setNexusData={setNexusData}
      section={section}
      setSection={setSection}
    />
  )

}

export default FelstormNexus
