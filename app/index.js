import { hot } from 'react-hot-loader/root'
import React from 'react'
import ReactDOM from 'react-dom'
import Router from './Router'

const HotApp = hot(Router)

ReactDOM.render(<HotApp />, document.getElementById('root'))
