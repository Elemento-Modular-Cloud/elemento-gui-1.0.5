import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function CustomSelect (props) {
  const _getOptionLabel = (option) => option

  return (
    <Autocomplete
      style={{ ...props.style, maxWidth: 300 }}
      multi={props.multi}
      id='checkboxes-tags-demo'
      options={props.options}
      // disableCloseOnSelect
      getOptionLabel={props.getOptionLabel || _getOptionLabel}
      value={props.value}
      fullWidth
      size='small'
      onChange={props.onChange}
      renderInput={(params) => (
        <TextField {...params} variant='standard' label='' placeholder={props.placeholder || 'Select one item...'} style={{ fontSize: '.8rem' }} />
      )}
    />
  )
}
