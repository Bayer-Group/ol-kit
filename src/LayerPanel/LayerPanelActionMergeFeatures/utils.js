import union from '@turf/union'
import { featureCollection, feature } from '@turf/helpers'
import GeoJSON from 'ol/format/GeoJSON';
import olGeomPolygon from 'ol/geom/Polygon';
import olGeomMultiPolygon from 'ol/geom/MultiPolygon';
import olGeomPoint from 'ol/geom/Point';
import olGeomLineString from 'ol/geom/LineString';
import olGeomMultiLineString from 'ol/geom/MultiLineString';
import olGeomCircle from 'ol/geom/Circle';
import olGeomMultiPoint from 'ol/geom/MultiPoint';

import ugh from 'ugh'

const format = new GeoJSON();
const projectionOpts = {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
};


function combineGeos(geometries) {
    const collection = featureCollection(geometries);
    const fc = combine(collection);
    return fc.features[0].geometry;
  }

function getNewGeoJsonGeom(feature, mergeFeature) {
    try {
        switch (feature.geometry.type) {
            case 'Point':
            case 'MultiPoint':
              return combineGeos([feature, mergeFeature]);
            case 'LineString':
            case 'MultiLineString':
              return combineGeos([feature, mergeFeature]);
            case 'Polygon':
            case 'MultiPolygon':
              return union(feature.geometry, mergeFeature.geometry).geometry;
            default:
              return null;
          }
    } catch (error) {
        return ugh.error(error)
    }   
}

function olFeatureToGeoJsonFeature(olFeature) {
  const clonedFeature = olFeature.clone();
  clonedFeature.unset('_ol_kit_parent');
  clonedFeature.setId(olFeature.getId());
  const geoJsonFeature = format.writeFeatureObject(clonedFeature, projectionOpts);
  geoJsonFeature.properties = Object.assign({}, geoJsonFeature.properties);
  return geoJsonFeature;
}

function geoJsonGeomToOlGeom(geoJsonGeom) {
    const coordinates = geoJsonFeatureToOlFeature(geoJsonGeom).getGeometry().getCoordinates();

    return getOlGeometryByType(geoJsonGeom.type, coordinates);
  }

function geoJsonFeatureToOlFeature(geoJsonFeature) {
    return format.readFeature(geoJsonFeature, projectionOpts);
  }

function getOlGeometryByType(type, coordinateArray) {
    switch (type) {
      case 'Polygon':
        return new olGeomPolygon(coordinateArray);
      case 'LineString':
        return new olGeomLineString(coordinateArray);
      case 'MultiLineString':
        return new olGeomMultiLineString(coordinateArray);
      case 'Point':
        return new olGeomPoint(coordinateArray);
      case 'Circle':
        return new olGeomCircle(coordinateArray);
      case 'MultiPolygon':
        return new olGeomMultiPolygon(coordinateArray);
      case 'MultiPoint':
        return new olGeomMultiPoint(coordinateArray);
      default:
        return undefined;
    }
  }


/**
 * Takes an array of vector features and creates a new merged geometry
 * @category LayerPanel
 * @function
 * @since 1.15.1
 * @param {Layer} VectorLayer - VectorLayer with features to be merged
 * @returns {Feature} olFeature
 */
export function mergeLayerFeatures (layer) {
  const features = layer.getSource().getFeatures();
  const firstFeature = features.shift();
  const { geometry: geoJsonGeom } = features.reduce((prevTarget, mergeTarget) => {
    const baseFeature = prevTarget;
    const newGeom = getNewGeoJsonGeom(baseFeature, olFeatureToGeoJsonFeature(mergeTarget));
    return feature(newGeom);
  }, olFeatureToGeoJsonFeature(firstFeature));



  return geoJsonGeomToOlGeom(geoJsonGeom)
}