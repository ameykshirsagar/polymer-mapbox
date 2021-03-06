import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import "./mapbox-layer.js";
/**
A variant of the `mapbox-fill-extrusion-layer` where the building info is
derive from the building layers in mapbox's street map.

To add a building layer, just bind the corresponding `map` object from
`mapbox-gl` selement to the `mapbox-building-layer` element.

<b>Example</b>:
```html
<mapbox-gl id="map"
  interactive
  map="{{map}}"
  script-src="https://api.mapbox.com/mapbox-gl-js/v0.32.1/mapbox-gl.js"
  map-style="mapbox://styles/mapbox/dark-v9"
  access-token="<MAPBOX_ACCESS_TOKEN>"
  latitude=1.3521
  longitude=103.8698
  zoom=16
  pitch=45
  bearing=0></mapbox-gl>


<mapbox-building-layer layer-id="buildings"
  map="[[map]]"
  fill-extrusion-opacity=0.6
  fill-extrusion-color="#666"></mapbox-building-layer>
```

See https://www.mapbox.com/mapbox-gl-js/style-spec/#layers-fill-extrusion for
more details.

@demo demo/building.html 3D buildings
*/
/**
 * @customElement
 * @polymer
 */
class MapboxBuildingLayer extends MapboxLayer {
    static get template() {
        return html `
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
    }
    static get properties() {
        return {
            renderingType: {
                type: String,
                value: 'fill-extrusion'
            },
            /*
             * Name of a source description to be used for this layer.
             */
            source: {
                type: String,
                value: 'composite'
            },
            /*
             * Layer to use from a vector tile source. Required if the source
             * supports multiple layers.
             */
            sourceLayer: {
                type: String,
                value: 'building'
            },
            /*
             * A expression specifying conditions on source features. Only features
             * that match the filter are displayed.
             *
             * @type {Array<predicate, field, condition>}
             */
            filter: {
                type: Array,
                value: function() {
                    return ['==', 'extrude', 'true'];
                }
            },

            /*
             * The height (in meters) with which to extrude this layer.
             *
             * @type {{type: string, property: string}}
             */
            fillExtrusionHeight: {
                type: Object,
                value: function() {
                    return {
                        type: 'identity',
                        property: 'height'
                    };
                }
            },
            /*
             * The height with which to extrude the base of this layer.
             * Must be less than or equal to fill-extrusion-height.
             *
             * @type {{type: string, property: string}}
             */
            fillExtrusionBase: {
                type: Object,
                value: function() {
                    return {
                        type: 'identity',
                        property: 'min_height'
                    };
                }
            }

        };
    }

}

window.customElements.define('mapbox-building-layer', MapboxBuildingLayer);