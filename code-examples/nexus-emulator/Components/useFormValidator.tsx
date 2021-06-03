import { useCallback } from "react"
import { FormSchemaType, NexusDataType } from "../types"

interface Props {
  formSchema: FormSchemaType
}

const IS_NUMERIC = (num: any) => {
  return (typeof(num) === 'number' ||
  typeof(num) === "string" && num.trim() !== '') &&
  !isNaN(num as number)
}

export default function useFormValidator(props: Props) {

  const getFieldErrors = useCallback((fieldMeta, fieldValue) => {

    let errors: string[] = []
    const ft = fieldMeta.type
    const fv = fieldMeta.validators

    // dont allow empty
    if(fv && (fieldValue === "")) {
      errors.push("This cannot be empty.")
    }

    // validate string
    if(ft === "string" && fv) {
      if(fv.min_length && fieldValue.length < fv.min_length) {
        errors.push(`This must be longer than ${fv.min_length} characters.`)
      }
      if(fv.max_length && fieldValue.length > fv.max_length) {
        errors.push(`This cannot be larger than ${fv.max_length} characters.`)
      }
    }

    // validate numbers
    if(['integer', 'decimal', 'float'].includes(ft) && fv) {
      if(fv.required && !IS_NUMERIC(fieldValue)) {
        errors.push(`This must be a number.`)
      } else {
        if(fv.min && Number(fieldValue) < fv.min) {
          errors.push(`This must be larger than ${fv.min}.`)
        }
        if(fv.max && Number(fieldValue) > fv.max) {
          errors.push(`This cannot be larger than ${fv.max}.`)
        }
      }
    }

    // validate choices
    if(['select', 'select_multiple'].includes(ft)) {
      const selected = ft === 'select_multiple' ? fieldValue : [fieldValue]
      const validChoice = selected.find((value: string) => {
        return fieldMeta.choices.find(([slug, _label]: [string, string]) => {
          return slug === value
        })
      })
      if(!validChoice) {
        errors.push(`Must be a valid choice.`)
      }
      // have to also validate required since fieldValue isn't a string
      if(fv && fv.required && selected.length === 0) {
        errors.push("Must select a choice.")
      }
    }

    return errors
    
  }, [])

  const isDataValid = useCallback((nexusData: NexusDataType) => {

    let errors: { [key: string]: string[] } = {};

    Object.entries(props.formSchema).forEach(field => {
      const fieldName: string = field[0]
      const fieldMeta = field[1]
      const fieldValue = nexusData[fieldName]
      const fieldErrors = getFieldErrors(fieldMeta, fieldValue)
      if(fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors
      }
    })

    return {
      errors: Object.keys(errors).length > 0 ? errors : false,
      valid: Object.keys(errors).length === 0 ? true : false
    }

  }, [props.formSchema])

  return {
    isDataValid
  }
}
