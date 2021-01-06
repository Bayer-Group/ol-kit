import React from 'react'
import PaletteIcon from '@material-ui/icons/Palette'

import {
  Controls,
  TabbedPanel,
  LayerStyler,
  TabbedPanelPage,
  LayerPanelLayersPage,
  Map,
  Popup
} from '@bayer/ol-kit'

import MVT from 'ol/format/MVT'
import VectorTileSource from 'ol/source/VectorTile'
import VectorTileLayer from 'ol/layer/VectorTile'

import Welcome from '../../Welcome'

const HeaderStyle = {
  fontFamily: '"Open Sans", sans-serif',
  textAlign: 'center'
}

const LogoStyle = {
  fontSize: '70px',
  textTransform: 'uppercase',
  color: '#00216c',
  overflow: 'hidden',
  width: '191px',
  direction: 'rtl',
  display: 'inline-block',
  marginBottom: '0'
}

const QuoteStyle = {
  padding: '15px',
  fontStyle: 'italic'
}

const MapStyle = {
  width: '100%',
  height: '400px',
  margin: '0 auto'
}

const ContentWrapper = {
  maxWidth: '700px',
  padding: '15px',
  margin: '0 auto',
  fontFamily: '"Open Sans", sans-serif',
  fontSize: '20px',
  lineHeight: '2rem'
}

const HeadingStyle = {
  fontFamily: 'Times',
  marginTop: '50px'
}

function App (props) {
  return (
    <div>
      <div style={HeaderStyle}>
        <h1 style={LogoStyle}>ATLAS</h1>
        <p style={QuoteStyle}>“Earth is a small town with many neighborhoods in a very big universe.” – Ron Garan</p>
      </div>
      <div style={MapStyle}>
        <Map>
          <Popup />
          <TabbedPanel>
            <TabbedPanelPage label='Home'>
              <Welcome title={'Inline Demo'} desc={'This demo shows how you can use ol-kit to create powerful inline/embedded maps. Click around to see how much you can do.'} />
            </TabbedPanelPage>
            <TabbedPanelPage label='Layers'>
              <LayerPanelLayersPage />
            </TabbedPanelPage>
            <TabbedPanelPage label='Styles'>
              <LayerStyler />
            </TabbedPanelPage>
          </TabbedPanel>
          <Controls variation={'dark'} />
        </Map>
      </div>
      <div style={ContentWrapper}>
        <h2 style={HeadingStyle}>Our Mission</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sodales auctor nulla id tempus. In ullamcorper urna neque, id consequat mauris porta et. Quisque luctus pretium dolor sit amet convallis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin pretium maximus purus et aliquet. Nullam eget malesuada libero, in faucibus ex. In hac habitasse platea dictumst. Proin fringilla quis sem eget bibendum. Praesent vestibulum ex dolor, vel tempor velit interdum vel. Nam tincidunt sollicitudin tempor. Praesent auctor sodales dui, id consequat dui mollis nec. Aliquam porta orci ac ipsum fringilla fermentum. Donec vel erat tristique, iaculis massa nec, commodo purus. Maecenas eu viverra ante. Proin efficitur egestas iaculis. Mauris sit amet imperdiet odio, vel blandit risus.</p>
        <h2 style={HeadingStyle}>The First Challenge</h2>
        <p>Nulla sodales neque odio, sed iaculis urna commodo at. Praesent id enim magna. Cras nec molestie erat. Etiam interdum, augue nec porttitor tincidunt, est sem pellentesque nisl, id varius mi ex non est. Proin ultrices posuere eleifend. Sed pulvinar convallis mauris. In lobortis eu leo vel gravida.</p>
        <h2 style={HeadingStyle}>The Future</h2>
        <p>Proin ultrices ex eget diam condimentum elementum. Donec id elit bibendum, laoreet nunc nec, ornare purus. Nam varius condimentum magna, non facilisis sapien vestibulum finibus. Fusce vitae dictum ex. Phasellus placerat ultricies metus sit amet laoreet. Vestibulum enim quam, condimentum ac laoreet et, rutrum quis mi. Praesent ac posuere nisi, ac hendrerit nunc. Phasellus porttitor condimentum est eget consectetur. Proin massa enim, ultrices a mi non, ullamcorper rutrum metus. Sed eleifend mattis tellus, sit amet suscipit massa auctor eget. Integer pulvinar bibendum dolor vitae suscipit. Morbi pharetra nulla at mi bibendum, et pretium odio sodales. Morbi vitae iaculis lectus. Nullam maximus velit ac blandit imperdiet. Donec sed accumsan nisi, id blandit massa. Quisque dui velit, tempor sed pulvinar eu, aliquam in mi.</p>
      </div>
    </div>
  )
}

export default App
