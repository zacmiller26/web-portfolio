import React from 'react';

import { FelstormNexus } from '../nexus-emulator/index'
import Tables from './Tables'
import formSchema from './form.json'


export default function BasicTables() {
  return (
    <FelstormNexus
      Component={Tables}
      formSchema={formSchema}
    />
  )
}
