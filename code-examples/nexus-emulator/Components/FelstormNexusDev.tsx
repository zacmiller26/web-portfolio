import * as React from 'react'
import { useEffect, useState } from 'react'

import { ViewerType } from '../types'
import { FelstormNexusProps } from './FelstormNexus'


const FelstormNexusDev = ({ ...props }: FelstormNexusProps) => {

  const {
    Component,
    formSchema,
    nexusData,
    setNexusData,
    section,
    setSection
  } = props

  const [viewer, setViewer] = useState<ViewerType>({
    platform: 'web',
    isMobile: false
  })

  useEffect(() => setViewer(p => p), [])

  useEffect(() => setSection('form'), [])

  return (
    <Component
      viewer={viewer}
      formSchema={formSchema}
      nexusData={nexusData}
      setNexusData={setNexusData}
      isEditor={section === "form"}
    />
  )

}

export default FelstormNexusDev
