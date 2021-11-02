import union from '@turf/union'
import { featureCollection } from '@turf/helpers'
import GeoJSON from 'ol/format/GeoJSON';
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
              return union(feature.geometry, mergeFeature.geometry);
            default:
              return null;
          }
    } catch (error) {
        return ugh.error(error)
    }   
}

export function geoJsonFeatureToOlFeature(geoJsonFeature) {
  return format.readFeature(geoJsonFeature, projectionOpts);
}

export function olFeatureToGeoJsonFeature(olFeature) {
  const clonedFeature = olFeature.clone();
  clonedFeature.unset('_ol_kit_parent');
  clonedFeature.setId(olFeature.getId());
  const geoJsonFeature = format.writeFeatureObject(clonedFeature, projectionOpts);
  geoJsonFeature.properties = Object.assign({}, geoJsonFeature.properties);
  return geoJsonFeature;
}


/**
 * Takes an array of vector features and creates a new merged geometry
 * @category LayerPanel
 * @function
 * @since 1.15.1
 * @param {Layer} VectorLayer - VectorLayer with features to be merged
 * @returns {Object} Geometry
 */
export function mergeLayerFeatures (layer) {
  const features = layer.getSource().getFeatures();
  const firstFeature = features.shift();
  const { geometry: geoJsonGeom } = features.reduce((prevTarget, mergeTarget) => {
    const baseFeature = prevTarget;
    const newGeom = getNewGeoJsonGeom(olFeatureToGeoJsonFeature(baseFeature), olFeatureToGeoJsonFeature(mergeTarget));
    return helpers.feature(newGeom);
  }, olFeatureToGeoJsonFeature(firstFeature));

  return geoJsonGeomToOlGeom(geoJsonGeom)
}