import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Checkbox from '@material-ui/core/Checkbox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' style={{ fill: '#FFA601' }} />

export default function CustomAutocomplete (props) {
  return (
    <Autocomplete
      multiple
      id='checkboxes-tags-demo'
      options={props.options}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      value={props.value}
      renderOption={(option, { selected }) => (
        <>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            disableRipple
            style={{ marginRight: 8, checkedColor: '#FFA601' }}
            checked={props.checked(option)}
            name={option}
          />
          <span style={{ fontSize: '.8rem' }}>{option}</span>
        </>
      )}
      fullWidth
      size='small'
      onChange={props.onChange}
      renderInput={(params) => (
        <TextField {...params} variant='standard' label='' placeholder='Select one or more...' style={{ fontSize: '.8rem' }} />
      )}
    />
  )
}
