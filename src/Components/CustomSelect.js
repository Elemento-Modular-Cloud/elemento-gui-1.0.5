import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function CustomSelect (props) {
  return (
    <Autocomplete
      multi={props.multi}
      id='checkboxes-tags-demo'
      options={props.options}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      value={props.value}
      fullWidth
      size='small'
      onChange={props.onChange}
      renderInput={(params) => (
        <TextField {...params} variant='standard' label='' placeholder='Select one item...' style={{ fontSize: '.8rem' }} />
      )}
    />
  )
}
