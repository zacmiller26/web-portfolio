import * as React from 'react'
import { useCallback, useRef } from 'react'

import BooleanField from './FormFields/BooleanField'
import IntegerField from './FormFields/IntegerField'
import RadioField from './FormFields/RadioField'
import SelectField from './FormFields/SelectField'
import SelectMultipleField from './FormFields/SelectMultipleField'
import StringField from './FormFields/StringField'

import { FormProps, FormJsonFieldType, NexusDataType } from '../../types'

export type FieldTypeProps = {
  field: [string, FormJsonFieldType]
  value?: any
  setValue: (value: any) => void
}

export default function NexusForm(props: FormProps) {

  const ref = useRef<HTMLFormElement | null>(null)

  const handleChange = useCallback((fieldname: string, value: any) => {
    props.setNexusData((prev: NexusDataType) => ({
      ...prev,
      [fieldname]: value
    }))
  }, [props.setNexusData])

  const getFieldTypeComponent = useCallback((field) : React.ReactNode => {

    const getFieldValue = (name: string) => {
      if(props.nexusData && name in props.nexusData) return props.nexusData[name]
      return undefined
    }

    const fProps = {
      field,
      value: getFieldValue(field[0]),
      setValue: (v: any) => handleChange(field[0], v),
      handleChange
    }

    if(field[1]) {
      const t = field[1].type
      if(t === 'boolean') return <BooleanField {...fProps} />
      if(t === 'string') return <StringField {...fProps} />
      if(t === 'integer') return <IntegerField {...fProps} />
      if(t === 'decimal') return <IntegerField {...fProps} />
      if(t === 'float') return <IntegerField {...fProps} />
      if(t === 'radio') return <RadioField {...fProps} />
      if(t === 'select') return <SelectField {...fProps} />
      if(t === 'select_multiple') return <SelectMultipleField {...fProps} />
    }

    return <React.Fragment />

    /* tslint:disable-next-line */
  }, [props.nexusData])

  const getFieldErrors = useCallback((name: string) => {
    const { nexusDataErrors } = props
    if(nexusDataErrors && name in nexusDataErrors) {
      return nexusDataErrors[name].map((e) => (
        <div
          key={name + '-' + e}
          className="form--fields--error">
          {e}
        </div>
      ))
    }
    return <React.Fragment />
  }, [props.nexusDataErrors])

  const isFieldRequired = useCallback((fieldMeta) => {
    return fieldMeta?.validators?.required ? true : false
  }, [])

  return (
    <form onSubmit={e => e.preventDefault()} ref={ref} className="form--root">
      <div className="form--fields">
        {Object.entries(props.formSchema).map((field) => (
          <div key={field[0]} className="form--fields--container">
            <label className="form--fields--label">
              {field[1].label}{isFieldRequired(field[1]) ? <em>*</em> : ''}
            </label>
            {getFieldTypeComponent(field)}
            {getFieldErrors(field[0])}
          </div>
        ))}
      </div>
    </form>
  )

}
