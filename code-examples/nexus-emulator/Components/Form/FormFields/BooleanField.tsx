import * as React from 'react'
import { useMemo } from 'react'

import { FieldTypeProps } from '../Form'


const BooleanField: React.FC<FieldTypeProps> = props => {

  const { field } = props

  /*const defaultValue = useMemo(() => {
    if(typeof field[1].default === 'boolean' && field[1].default)
      return true
    return false
  }, [field])*/

  //const [value, setValue] = useState<boolean>(defaultValue)
  const fieldName = useMemo(() => field[0], [field])

  return (
    <input
      id={`id_${fieldName}`}
      name={fieldName}
      type="checkbox"
      onChange={() => props.setValue((p: boolean) => !p)}
      checked={props.value}
    />
  )
}

export default BooleanField
