import * as React from 'react'
import { useMemo } from 'react'

import { FieldTypeProps } from '../Form'


const RadioField: React.FC<FieldTypeProps> = (props) => {

  const fieldName = useMemo(() => props.field[0], [props.field])
  const fieldInfo = useMemo(() => props.field[1], [props.field])

  return fieldInfo.choices ? (
    <ul id={fieldName}>
      {fieldInfo.choices.map((choice: [string, string], i: number) => (
        <li key={choice[0]}>
          <input
            id={`${fieldName}-${i}`}
            name={fieldName}
            type="radio"
            value={choice[0]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              props.setValue(e.target.value)
            }}
            checked={choice[0] === props.value}
          />
          <label htmlFor={`${fieldName}-${i}`}>{choice[1]}</label>
        </li>
      ))}
    </ul>
  ) : <React.Fragment />
}

export default RadioField
