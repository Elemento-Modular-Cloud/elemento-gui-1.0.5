import Slider from '@material-ui/core/Slider'
import { withStyles } from '@material-ui/core/styles'

const sliderShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)'

const CustomSlider = withStyles({
  root: {
    color: '#FFA601',
    height: 2
  },
  thumb: {
    height: 14,
    width: 14,
    backgroundColor: '#0C0F13',
    boxShadow: sliderShadow,
    marginTop: -7,
    marginLeft: -7,
    '&:focus, &:hover, &$active': {
      boxShadow: sliderShadow,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: sliderShadow
      }
    }
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 12px)',
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#000'
    }
  },
  track: {
    height: 2
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: '#bfbfbf'
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    marginTop: -3
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor'
  }
})(Slider)

export default CustomSlider
