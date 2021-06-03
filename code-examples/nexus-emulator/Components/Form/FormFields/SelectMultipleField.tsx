import * as React from 'react'
import { useCallback, useMemo } from 'react'

import { FieldTypeProps } from '../Form'


const SelectMultipleField: React.FC<FieldTypeProps> = props => {

  //const [values, setValues] = useState<string[]>([])
  const fieldName = useMemo(() => props.field[0], [props.field])
  const fieldInfo = useMemo(() => props.field[1], [props.field])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.options).filter(o => o.selected)
    props.setValue(selected.map(o => o.value))
  }, [])

  return fieldInfo.choices ? (
    <select
      id={`id_${fieldName}`}
      name={fieldName}
      multiple={true}
      value={props.value}
      onChange={handleChange}
    >
      {fieldInfo.choices.map(choice => (
        <option
          key={choice[0]}
          value={choice[0]}
        >
          {choice[1]}
        </option>
      ))}
    </select>
  ) : <React.Fragment />
}

export default SelectMultipleField
