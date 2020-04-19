import { withStyles } from '@material-ui/core/styles'
import MaterialListItem from '@material-ui/core/ListItem'
import MaterialListItemText from '@material-ui/core/ListItemText'

export const ListItem = withStyles(() => ({
  root: {
    padding: '0 16px !important', // without this, the root styles can override this and shift everything
    '&:hover': {
      cursor: 'pointer'
    }
  }
}))(MaterialListItem)

export const ListItemText = withStyles(() => ({
  root: {
    padding: '10px 30px 10px 5px',
    overflowWrap: 'break-word'
  }
}))(MaterialListItemText)
