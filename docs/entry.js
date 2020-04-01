
    window.reactComponents = {};

    window.vueComponents = {};

  
      import React from "react";

      import ReactDOM from "react-dom";


      import ReactWrapper from '../config/jsdoc/template/lib/react-wrapper.js';

      window.React = React;

      window.ReactDOM = ReactDOM;

      window.ReactWrapper = ReactWrapper;

    
    import './styles/reset.css';

    import './styles/iframe.css';

  import Component0 from '../src/Basemaps/BasemapManager.js';
reactComponents['BasemapManager'] = Component0;

import Component1 from '../src/Basemaps/BingMaps.js';
reactComponents['BingMaps'] = Component1;

import Component2 from '../src/Basemaps/BlankWhite.js';
reactComponents['BlankWhite'] = Component2;

import Component3 from '../src/Controls/Compass.js';
reactComponents['Compass'] = Component3;

import Component4 from '../src/Controls/Controls.js';
reactComponents['Controls'] = Component4;

import Component5 from '../src/Map/Map.js';
reactComponents['Map'] = Component5;

import Component6 from '../src/Basemaps/OpenStreetMap.js';
reactComponents['OpenStreetMap'] = Component6;

import Component7 from '../src/Basemaps/StamenTerrain.js';
reactComponents['StamenTerrain'] = Component7;

import Component8 from '../src/Basemaps/StamenTonerDark.js';
reactComponents['StamenTonerDark'] = Component8;

import Component9 from '../src/Basemaps/StamenTonerLite.js';
reactComponents['StamenTonerLite'] = Component9;

import Component10 from '../src/Controls/ZoomControls.js';
reactComponents['ZoomControls'] = Component10;