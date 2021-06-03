import * as React from 'react'
import { useMemo } from 'react'

import { FieldTypeProps } from '../Form'


const StringField: React.FC<FieldTypeProps> = props => {

  const { field } = props

  const fieldName = useMemo(() => field[0], [field])
  //const fieldInfo = useMemo(() => field[1], [field])

  // keep value in sync w/ props.value
  // @ts-ignore

  const isTextArea = useMemo(() => {
    return (field[1]?.widget === "Textarea")
  }, [field])

  return isTextArea ? (
    <textarea
      id={`id_${fieldName}`}
      name={fieldName}
      onChange={e => props.setValue(e.currentTarget.value)}
      value={props.value}
    />
  ) : (
    <input
      id={`id_${fieldName}`}
      name={fieldName}
      type="text"
      onChange={e => props.setValue(e.currentTarget.value)}
      value={props.value}
    />
  )
}

export default StringField
