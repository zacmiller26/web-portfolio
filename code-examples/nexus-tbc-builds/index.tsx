import React from 'react'

import ClassicBuilds from './app/ClassicBuilds'
import formSchema from './form.json'
import { FelstormNexus } from '../nexus-emulator/index'


export default function NexusTBCBuilds() {
  return (
    <FelstormNexus
      Component={ClassicBuilds}
      formSchema={formSchema}
    />
  )
}
