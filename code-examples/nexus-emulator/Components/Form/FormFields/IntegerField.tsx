import * as React from 'react'
import { useMemo } from 'react'

import { FieldTypeProps } from '../Form'


const IntegerField: React.FC<FieldTypeProps> = props => {

  const fieldName = useMemo(() => props.field[0], [props.field])
  const fieldInfo = useMemo(() => props.field[1], [props.field])

  return (
    <input
      id={`id_${fieldName}`}
      name={fieldName}
      type={fieldInfo.type === 'decimal' ? 'decimal' : 'number'}
      value={props.value}
      onChange={e => props.setValue(e.currentTarget.value)}
    />
  )
}

export default IntegerField
