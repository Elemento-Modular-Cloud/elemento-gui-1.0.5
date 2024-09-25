import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import LockIcon from '@material-ui/icons/Lock'
import PublicIcon from '@material-ui/icons/Public'

export default function StorageSelect (props) {
  return (
    <Autocomplete
      id='checkboxes-tags-demo'
      style={{ ...props.style, maxWidth: 300 }}
      multi={props.multi}
      options={props.options}
      // disableCloseOnSelect
      getOptionLabel={option => option.name}
      value={props.value}
      fullWidth
      size='small'
      onChange={props.onChange}
      renderOption={(_props, option) => {
        return (
          <div
            component='li'
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {
              _props.private
                ? <LockIcon fontSize='22' />
                : <PublicIcon fontSize='22' />
            }
            <span style={{ marginLeft: 10 }}>{_props.name}</span>
          </div>
        )
      }}
      renderInput={(params) => (
        <>
          <TextField {...params} variant='standard' label='' placeholder={props.placeholder || 'Select one item...'} style={{ fontSize: '.8rem' }} />
        </>
      )}
    />
  )
}
