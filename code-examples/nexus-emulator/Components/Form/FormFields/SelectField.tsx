import * as React from 'react'
import { useMemo } from 'react'

import { FieldTypeProps } from '../Form'


const SelectField: React.FC<FieldTypeProps> = props => {

  const fieldName = useMemo(() => props.field[0], [props.field])
  const fieldInfo = useMemo(() => props.field[1], [props.field])

  return fieldInfo.choices ? (
    <select
      id={`id_${fieldName}`}
      name={fieldName}
      onChange={e => props.setValue(e.currentTarget.value)}
      value={props.value}
    >
      {fieldInfo.choices.map(choice => (
        <option key={choice[0]} value={choice[0]}>
          {choice[1]}
        </option>
      ))}
    </select>
  ) : <React.Fragment />

}

export default SelectField
