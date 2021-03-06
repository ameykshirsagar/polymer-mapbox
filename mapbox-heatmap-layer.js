import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import "./mapbox-layer.js";
/**
Creates a heatmap using multiple `mapbox-layers`.
More details @ https://www.mapbox.com/mapbox-gl-js/example/heatmap/
<b>Example</b>
```html
  <mapbox-gl id="map"
    interactive
    map="{{map}}"
    map-style="mapbox://styles/mapbox/dark-v9"
    access-token="<MAPBOX_ACCESS_TOKEN>"
    latitude=40.66995747013945
    longitude=-103.59179687498357
    zoom=3></mapbox-gl>
  <mapbox-heatmap-layer
    map="[[map]]"
    layer-id="heatmap"
    source="geojsonsrc"
    radius=80
    color="rgba(0, 200, 0, 0.3)"
    opacity=0.2
    levels="[[levels]]"></mapbox-heatmap-layer>
  <geojson-source
    cluster
    cluster-max-zoom=15
    cluster-radius=20
    map="[[map]]"
    source-id="geojsonsrc"
    source-data="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_parks_and_protected_lands_point.geojson"></geojson-source>
```
```javascript
levels = [{"count": 0, "color": "#EEEEEE", "radius": 2, "opacity": 0.5},
          {"count": 5, "color": "#2196F3"},
          {"count": 8, "color": "#FFC107"},
          {"count": 10, "color": "#F44336"}];
```

 * @customElement
 * @polymer
 * @demo demo/heatmap.html Heatmap
 */
class MapboxHeatmapLayer extends PolymerElement {
    static get template() {
        return html `
      <style>
        :host {
          display: block;
        }
      </style>
      <template is="dom-repeat" items="[[_layers]]">
      <mapbox-layer
        layer-id="[[item.layerId]]"
        map="[[map]]"
        source="[[source]]"
        source-layer="[[sourceLayer]]"
        rendering-type="circle"
        radius="[[item.radius]]"
        color="[[item.color]]"
        opacity="[[item.opacity]]"
        blur="[[item.blur]]"
        filter="[[item.filter]]"></mapbox-layer>
    </template>
    `;
    }
    static get properties() {
        return {
            /*
             * The (map)[https://www.mapbox.com/mapbox-gl-js/api/#Map] instance
             * returned by mapboxgl-js
             */
            map: {
                type: Object
            },
            /*
             * Unique layer name. (Required)
             */
            layerId: {
                type: String
            },
            /*
             * Name of a source description to be used for this layer.
             */
            source: {
                type: String
            },
            /*
             * Layer to use from a vector tile source. Required if the source
             * supports multiple layers.
             */
            sourceLayer: {
                type: String
            },
            /*
             * default radius of all the levels
             */
            radius: {
                type: Number,
                value: 70
            },
            /*
             * default opacity of all the levels
             */
            opacity: {
                type: Number,
                value: 1
            },
            /*
             * default color of all the levels.
             */
            color: {
                type: String,
                value: '#4CAF50'
            },
            /*
             * Array of Object describing the levels of the heatmap.
             * Each level can have the following fields:
             * - count: level should have less than this number of points
             * - radius: radius of the cluster for this level
             * - color: color of the level
             * - opacity: opacity of the level
             */
            levels: {
                type: Array
            },
            _layers: {
                type: Array,
                computed: '_createLevels(levels, map, layerId, source)'
            }
        };
    }

    _createLevels(levels) {
        if (!levels || !this.map || !this.layerId || !this.source) return;
        var len = levels.length;
        var layers = new Array(levels.length);
        for (var i = 0; i < len; ++i) {
            layers[i] = this._createLevel(levels, i);
        }
        return layers;
    }

    _createLevel(levels, i) {
        var conf = Object.create(null);
        var level = levels[i];
        var prevlevel = levels[Math.max(i - 1, 0)];
        conf.layerId = this.layerId + '_' + i;
        conf.color = level.color || this.color;
        conf.radius = level.radius || this.radius;
        conf.blur = level.blur || 1;
        conf.opacity = level.opacity || this.opacity;
        if (level.count === 0) {
            conf.filter = ['!=', 'cluster', true];
        } else if (i == levels.length - 1) {
            conf.filter = ['>', 'point_count', prevlevel.count || 0];
        } else {
            conf.filter = [
                'all', ['>', 'point_count', prevlevel.count || 0],
                ['<=', 'point_count', level.count || 0]
            ];
        }
        return conf;
    }
}

window.customElements.define('mapbox-port-app', MapboxHeatmapLayer);