import { PolymerElement } from '@polymer/polymer/polymer-element.js';
// Geojson source for geojson-source.

// See https://www.mapbox.com/geojson-source-js/api/#geojsonsource for
// more details.

// <b>Example</b>

// ```html
// <geojson-source id="map"
//   interactive
//   map="{{map}}"
//   map-style="mapbox://styles/mapbox/dark-v9"
//   access-token="<MAPBOX_ACCESS_TOKEN>"
//   latitude=1.3521
//   longitude=103.8698
//   zoom=2></geojson-source>

// <mapbox-layer
//   map="[[map]]"
//   layer-id="coastline_fill"
//   rendering-type="fill"
//   source="geojsonsrc"
//   color="#009688"
//   opacity=0.7></mapbox-layer>

// <mapbox-layer
//   map="[[map]]"
//   layer-id="coastline_outline"
//   rendering-type="line"
//   source="geojsonsrc"
//   color="#eee"
//   line-width=2></mapbox-layer>

// <geojson-source
//   map="[[map]]"
//   source-id="geojsonsrc"
//   source-data="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_land.geojson"></geojson-source>
// ```
// @customElement
// @polymer
// @demo demo/mapbox-source-data.html Loading GeoJSON into geojson-source
class GeojsonSource extends PolymerElement {

    static get properties() {
        return {
            /*
             * The (map)[https://www.mapbox.com/mapbox-gl-js/api/#Map] instance
             * returned by GeojsonSource-js (`mapbox-gl` element)
             */
            map: {
                type: Object
            },
            /*
             * source id - unique id for the source layer. (Required)
             */
            sourceId: {
                type: String,
                reflectToAttribute: true
            },
            /*
             * geojson url to a geojson file.
             */
            sourceUrl: {
                type: String,
                observer: '_sourceUrlChanged'
            },
            /*
             * geojson object.
             */
            sourceData: {
                type: Object
            },
            /*
             * Optional number.  Defaults to 18.
             * Maximum zoom level at which to create vector tiles (higher means
             * greater detail at high zoom levels).
             */
            maxzoom: {
                type: Number,
                value: 18
            },
            /*
             * Optional number.  Defaults to 128.
             * Size of the tile buffer on each side. A value of 0 produces no buffer.
             * A value of 512 produces a buffer as wide as the tile itself. Larger
             * values produce fewer rendering artifacts near tile edges and slower
             * performance.
             */
            buffer: {
                type: Number,
                value: 128
            },
            /*
             * Optional number.  Defaults to 0.375.
             * Douglas-Peucker simplification tolerance (higher means simpler
             * geometries and faster performance).
             */
            tolerance: {
                type: Number,
                value: 0.375
            },
            /*
             * Optional boolean.  Defaults to false.
             * If the data is a collection of point features, setting this to true
             * clusters the points by radius into groups.
             */
            cluster: Boolean,
            /*
             * Optional number.  Defaults to 50.
             * Radius of each cluster if clustering is enabled. A value of 512
             * indicates a radius equal to the width of a tile.
             */
            clusterRadius: {
                type: Number,
                value: 50
            },
            /*
             * Optional number.
             * Max zoom on which to cluster points if clustering is enabled. Defaults
             * to one zoom less than maxzoom (so that last zoom features are not
             * clustered).
             */
            clusterMaxZoom: Number,
            _conf: Object,
            _mapLoaded: Boolean
        };
    }

    static get observers() {
        return [
            '_sourceUrlChanged(sourceUrl, _mapLoaded)',
            '_setData(sourceData, map, sourceId, _mapLoaded, sourceData.features.*)'
        ];
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.map && this.sourceId && this.map.removeSource(this.sourceId);
    }

    _sourceUrlChanged(url) {
        if (!url) return;
        if (this.map && this._mapLoaded && this.map.getSource(this.sourceId)) {
            this.map.removeSource(this.sourceId);
        }
        this.sourceData = url;
    }

    _setClusterConf(conf) {
        if (!this.cluster) return conf;
        conf.cluster = this.cluster && true;
        conf.clusterRadius = this.clusterRadius;
        conf.clusterMaxZoom = this.clusterMaxZoom || this.maxzoom - 1;
        return conf;
    }

    _setData(data, map, srcId) {
        console.log(map);
        if (!data || !map || !srcId) return;

        if (map.polymervis !== undefined && !map.polymervis.parent._mapLoaded) {
            map.polymervis.parent._pendingChildren = map.polymervis.parent._pendingChildren || [];
            map.polymervis.parent._pendingChildren.push(this);
            return;
        }

        var src = map.getSource(srcId);
        var self = this;
        if (src) {
            if (typeof data !== 'string') {
                src.setData(data);
            }
        } else {
            map.addSource(
                srcId,
                self._setClusterConf({
                    type: 'geojson',
                    data: data,
                    maxzoom: self.maxzoom,
                    buffer: self.buffer,
                    tolerance: self.tolerance
                })
            );
        }
    }
}

window.customElements.define('geojson-source', GeojsonSource);