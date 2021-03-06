import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import { microTask } from '@polymer/polymer/lib/utils/async';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import "./layer-behaviour.js";
/**
A generic mapbox layer where the `layer-id` must be provided. You can design the
type of layer by inputing the `rendering-type` as well as the corresponding
attributes for the layer type. You can find out more by either looking at the
attribute definition at the [MapboxGLPolymer.LayerBehavior page](https://www.webcomponents.org/element/PolymerVis/mapbox-gl/behaviors/MapboxGLPolymer.LayerBehavior)
or the [mapbox-gl-js documentations](https://www.mapbox.com/mapbox-gl-js/style-spec#layers).

### Data source
The data source for the layer can be reference from a `geojson-source` through the
`source` attribute or be directly specified at the `data-source` attribute. Data
that is specified directly at `data-source` cannot be modified after initialization -
there is no 2-way binding. For data that can change after initialization, please
reference it from `geojson-source` and data-bind your variable to the `source-data`
attribute of the `geojson-source` element.

<b>Referencing from `geojson-source`</b>
```html
<mapbox-gl id="map"
  interactive
  map="{{map}}"
  map-style="mapbox://styles/mapbox/dark-v9"
  access-token="<MAPBOX_ACCESS_TOKEN>"
  latitude=1.3521
  longitude=103.8698
  zoom=2></mapbox-gl>

<mapbox-layer
  map="[[map]]"
  layer-id="coastline_fill"
  rendering-type="fill"
  source="geojsonsrc"
  color="#009688"
  opacity=0.7></mapbox-layer>

<mapbox-layer
  map="[[map]]"
  layer-id="coastline_outline"
  rendering-type="line"
  source="geojsonsrc"
  color="#eee"
  line-width=2></mapbox-layer>

<geojson-source
  map="[[map]]"
  source-id="geojsonsrc"
  source-data="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_land.geojson"></geojson-source>
```

<b>Specify at `source-data`</b>
```html
<mapbox-gl id="map"
  interactive
  map="{{map}}"
  map-style="mapbox://styles/mapbox/dark-v9"
  access-token="<MAPBOX_ACCESS_TOKEN>"
  latitude=1.3521
  longitude=103.8698
  zoom=2></mapbox-gl>

<mapbox-layer
  map="[[map]]"
  layer-id="layer_points"
  rendering-type="circle"
  source-data="[[geojson]]"
  color="#009688"
  opacity=0.7></mapbox-layer>

```

Sample of input for `source-data` for `mapbox-layer`
```javascript
{
  "type": "geojson",
  "data": {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [-77.03238901390978, 38.913188059745586]
          },
          "properties": {
              "title": "Mapbox DC",
              "icon": "monument"
          }
      }, {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [-122.414, 37.776]
          },
          "properties": {
              "title": "Mapbox SF",
              "icon": "harbor"
          }
      }]
  }
```

<b>Example 3</b>
```html
<mapbox-layer
  map="[[map]]"
  layer-id="coastline_fill"
  rendering-type="fill"
  source-data="[[geojsonsrc]]"
  color="#009688"
  opacity=0.7
  events-to-watch="click"
  on-mapbox-layer-click="handleClick"></mapbox-layer>
```

@customElement
@polymer
@demo demo/mapbox-source-data.html Loading GeoJSON into mapbox-gl
@demo demo/event-handling.html Event-handing and Dynamic styling
@demo demo/data-driven.html Data-driven Styling
*/
/**
 * @customElement
 * @polymer
 */
class MapboxLayer extends mixinBehaviors([MapboxGLPolymer.LayerBehavior], PolymerElement) {

    static get properties() {
        return {
            _mapLoaded: Boolean,
            _debouncer: {
                type: Debouncer
            }
        };
    }
    static get observers() {
        return ['_mapReady(map, _layer.id, _layer.source, _attached, _mapLoaded)'];
    }

    connectedCallback() {
        super.connectedCallback();
        this._attached = true;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._attached = false;

        if (!this.map) return;

        if (this.layerId && this.map.getLayer(this.layerId)) {
            this.map.removeLayer(this.layerId);
            this._clearListeners(this.map, this._watchEvents);
            this._added = false;
        }
    }

    _addLayer() {
        if (!this._attached) return;
        if (this._added == this.layerId) return;

        this.map.addLayer(this._layer);
        this._added = this.layerId;
        this.dispatchEvent(new CustomEvent('layer-added', { detail: this.map }));
    }

    _mapReady(map, id, source, attached, mapLoaded) {
        if (!map || !id || !source || !attached) return;
        if (!map.polymervis.parent._mapLoaded) {
            map.polymervis.parent._pendingChildren = map.polymervis.parent._pendingChildren || [];
            map.polymervis.parent._pendingChildren.push(this);
            return;
        }
        this._debouncer = Debouncer.debounce(
            this._debouncer,
            microTask,
            this._sourceReady.bind(this)
        );
    }


    _sourceReady() {
        var source = this._layer.source;
        if (!source && this._layer['source-layer']) return;

        var src = this.map.getSource(source);
        // source id
        if (typeof source === 'string' && src) {
            return this._addLayer();
        }

        if (typeof source === 'string' && !src) {
            return this.map.on(
                'sourcedata',
                () => this.map.getSource(source) && this._addLayer()
            );
        }

        // update source if exist
        if (this.map.getSource(this._layer.id)) {
            this.map.getSource(this._layer.id).setData(this._layer.source.data);
            this._layer.source = this._layer.id;
        }

        return this._addLayer();
    }
}

window.customElements.define('mapbox-layer', MapboxLayer);