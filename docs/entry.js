
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

  import Component0 from '../src/Basemaps/BingMaps.js';
reactComponents['BasemapBingMaps'] = Component0;

import Component1 from '../src/Basemaps/BlankWhite.js';
reactComponents['BasemapBlankWhite'] = Component1;

import Component2 from '../src/Basemaps/BasemapContainer.js';
reactComponents['BasemapContainer'] = Component2;

import Component3 from '../src/Basemaps/BasemapManager.js';
reactComponents['BasemapManager'] = Component3;

import Component4 from '../src/Basemaps/OpenStreetMap.js';
reactComponents['BasemapOpenStreetMap'] = Component4;

import Component5 from '../src/Basemaps/StamenTerrain.js';
reactComponents['BasemapStamenTerrain'] = Component5;

import Component6 from '../src/Basemaps/StamenTonerDark.js';
reactComponents['BasemapStamenTonerDark'] = Component6;

import Component7 from '../src/Basemaps/StamenTonerLite.js';
reactComponents['BasemapStamenTonerLite'] = Component7;

import Component8 from '../src/Controls/Compass.js';
reactComponents['Compass'] = Component8;

import Component9 from '../src/ContextMenu/ContextMenu.js';
reactComponents['ContextMenu'] = Component9;

import Component10 from '../src/ContextMenu/ContextMenuCoords.js';
reactComponents['ContextMenuCoords'] = Component10;

import Component11 from '../src/ContextMenu/ContextMenuListItem.js';
reactComponents['ContextMenuListItem'] = Component11;

import Component12 from '../src/Controls/ControlGroup.js';
reactComponents['ControlGroup'] = Component12;

import Component13 from '../src/Controls/ControlGroupButton.js';
reactComponents['ControlGroupButton'] = Component13;

import Component14 from '../src/Controls/Controls.js';
reactComponents['Controls'] = Component14;

import Component15 from '../src/Controls/CurrentLocation.js';
reactComponents['CurrentLocation'] = Component15;

import Component16 from '../src/Draw/Draw.js';
reactComponents['Draw'] = Component16;

import Component17 from '../src/Draw/Box.js';
reactComponents['DrawBox'] = Component17;

import Component18 from '../src/Draw/Circle.js';
reactComponents['DrawCircle'] = Component18;

import Component19 from '../src/Draw/DrawContainer.js';
reactComponents['DrawContainer'] = Component19;

import Component20 from '../src/Draw/Freehand.js';
reactComponents['DrawFreehand'] = Component20;

import Component21 from '../src/Draw/Line.js';
reactComponents['DrawLine'] = Component21;

import Component22 from '../src/Draw/Point.js';
reactComponents['DrawPoint'] = Component22;

import Component23 from '../src/Draw/Polygon.js';
reactComponents['DrawPolygon'] = Component23;

import Component24 from '../src/GooglePlacesSearch/GooglePlacesSearch.js';
reactComponents['GooglePlacesSearch'] = Component24;

import Component25 from '../src/LayerPanel/LayerPanel.js';
reactComponents['LayerPanel'] = Component25;

import Component26 from '../src/LayerPanel/LayerPanelActionExport/index.js';
reactComponents['LayerPanelActionExport'] = Component26;

import Component27 from '../src/LayerPanel/LayerPanelActionExtent/index.js';
reactComponents['LayerPanelActionExtent'] = Component27;

import Component28 from '../src/LayerPanel/LayerPanelActionImport/index.js';
reactComponents['LayerPanelActionImport'] = Component28;

import Component29 from '../src/LayerPanel/LayerPanelActionOpacity/index.js';
reactComponents['LayerPanelActionOpacity'] = Component29;

import Component30 from '../src/LayerPanel/LayerPanelActionRemove/index.js';
reactComponents['LayerPanelActionRemove'] = Component30;

import Component31 from '../src/LayerPanel/LayerPanelActions/index.js';
reactComponents['LayerPanelActions'] = Component31;

import Component32 from '../src/LayerPanel/LayerPanelBase/index.js';
reactComponents['LayerPanelBase'] = Component32;

import Component33 from '../src/LayerPanel/LayerPanelCheckbox/index.js';
reactComponents['LayerPanelCheckbox'] = Component33;

import Component34 from '../src/LayerPanel/LayerPanelContent/index.js';
reactComponents['LayerPanelContent'] = Component34;

import Component35 from '../src/LayerPanel/LayerPanelHeader/index.js';
reactComponents['LayerPanelHeader'] = Component35;

import Component36 from '../src/LayerPanel/LayerPanelLayersPage/index.js';
reactComponents['LayerPanelLayersPage'] = Component36;

import Component37 from '../src/LayerPanel/LayerPanelList/index.js';
reactComponents['LayerPanelList'] = Component37;

import Component38 from '../src/LayerPanel/LayerPanelListItem/index.js';
reactComponents['LayerPanelListItem'] = Component38;

import Component39 from '../src/LayerPanel/LayerPanelMenu/index.js';
reactComponents['LayerPanelMenu'] = Component39;

import Component40 from '../src/LayerPanel/LayerPanelPage/index.js';
reactComponents['LayerPanelPage'] = Component40;

import Component41 from '../src/LayerStyler/LayerStyler.js';
reactComponents['LayerStyler'] = Component41;

import Component42 from '../src/Map/Map.js';
reactComponents['Map'] = Component42;

import Component43 from '../src/Popup/Popup.js';
reactComponents['Popup'] = Component43;

import Component44 from '../src/Popup/PopupActions/PopupActionCopyWkt/PopupActionCopyWkt.js';
reactComponents['PopupActionCopyWkt'] = Component44;

import Component45 from '../src/Popup/PopupInsert/PopupActionGroup/index.js';
reactComponents['PopupActionGroup'] = Component45;

import Component46 from '../src/Popup/PopupInsert/PopupActionItem/index.js';
reactComponents['PopupActionItem'] = Component46;

import Component47 from '../src/Popup/PopupBase.js';
reactComponents['PopupBase'] = Component47;

import Component48 from '../src/Popup/PopupInsert/PopupDataList/index.js';
reactComponents['PopupDataList'] = Component48;

import Component49 from '../src/Popup/PopupInsert/PopupDefaultInsert.js';
reactComponents['PopupDefaultInsert'] = Component49;

import Component50 from '../src/Popup/PopupInsert/PopupDefaultPage/index.js';
reactComponents['PopupDefaultPage'] = Component50;

import Component51 from '../src/Popup/PopupInsert/PopupPageLayout/index.js';
reactComponents['PopupPageLayout'] = Component51;

import Component52 from '../src/Popup/PopupInsert/PopupPageLayoutChild/index.js';
reactComponents['PopupPageLayoutChild'] = Component52;

import Component53 from '../src/Popup/PopupInsert/PopupTabs/index.js';
reactComponents['PopupTabs'] = Component53;

import Component54 from '../src/TabbedPanel/TabbedPanel.js';
reactComponents['TabbedPanel'] = Component54;

import Component55 from '../src/TimeSlider/TimeSlider.js';
reactComponents['TimeSlider'] = Component55;

import Component56 from '../src/TimeSlider/TimeSliderBase.js';
reactComponents['TimeSliderBase'] = Component56;

import Component57 from '../src/Controls/ZoomControls.js';
reactComponents['ZoomControls'] = Component57;

import Component58 from '../src/Controls/ZoomIn.js';
reactComponents['ZoomIn'] = Component58;

import Component59 from '../src/Controls/ZoomOut.js';
reactComponents['ZoomOut'] = Component59;