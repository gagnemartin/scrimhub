import { useState } from 'react'

type FormInputOptions = {
  type?: string
}

const useFormInput = (defaultValue: any = '', options: FormInputOptions = {}) => {
  const { type } = options
  const [value, setValue] = useState(defaultValue)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'checkbox') {
      setValue((prevValue: boolean) => !prevValue)
    } else {
      setValue(e.target.value)
    }
  }

  return {
    value,
    onChange
  }
}

export default useFormInput
