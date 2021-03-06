import {
    html,
    PolymerElement
} from '@polymer/polymer/polymer-element.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { afterNextRender, beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import {} from './apply-shim.js';
import { IronResizableBehavior } from "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import {} from './utils-lib.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
// [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) is a JavaScript library
// that uses WebGL to render interactive maps from vector tiles and Mapbox styles..

// `mapbox-gl` is the Polymer element that wraps around mapbox-gl-js to provide powerful
// mapping capabilities to your app as a webcomponent.

// <b>Example</b>:
// ```html
// <mapbox-gl id="map"
//   interactive
//   map="{{map}}"
//   map-style-url="mapbox://styles/mapbox/dark-v9"
//   access-token="<MAPBOX_ACCESS_TOKEN>"
//   latitude=1.3521
//   longitude=103.8698
//   zoom=16
//   pitch=45
//   bearing=0></mapbox-gl>
// ```

// ### Using a different version of `mapbox-gl-js`
// You can use a different version of mapbox-gl-js by specifying the endpoint to the corresponding library and stylesheet through the `script-src` and `css-src` properties.
// ```html
// <mapbox-gl id="map"
//   interactive
//   map="{{map}}"
//   script-src="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.js"
//   css-src="https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css"></mapbox-gl>

// ```

// ## Important Notes:
// ### Resizing of `mapbox-gl` when it is not visible
// The underlying mapbox library try to handle `resize` events automatically.

// In under certain situations (e.g. when the page has `display: none` when using
// `iron-pages` to control the visible pages) the resize will fail and fall-back
// to a default size. However when the pages is made visible again, no `resize`
// event is emitted. And hence, `mapbox-gl` will retain the incorrect size.

// To overcome this limitation, you should manually trigger `resize` when the
// `mapbox-gl` element is visible again.

// **Example**
// HTML
// ```html
// <iron-pages
//     selected="[[page]]"
//     selected-item="{{pageElement}}"
//     attr-for-selected="name"
//     fallback-selection="view404"
//     role="main">
//   <my-view1 name="view1"></my-view1>
//   <mapbox-gl name="view2"></mapbox-gl>
//   <my-view404 name="view404"></my-view404>
// </iron-pages>
// ```
// JS
// ```
// _pageElementChanged(ele) {
//   if (!ele) return;
//   // call resize if function exist
//   ele.resize && ele.resize();
// }
// ```

// ### Add geojson layer
// To add a geojson layer, you first need to create a `geojson-source` element to
// load the geojson. The data can be a JSON object or the url to a GeoJSON file.

// Alternatively, you can bind the data directly to the `mapbox-layer` via
// `source-data` attribute with the format `{type: String, data: String|Object}`.

// Then you can render the geojson via the `mapbox-layer`
// (e.g. rendering-type = line or fill).

// Note that you will need to bind the corresponding `map` object from
// `mapbox-gl` element to both `geojson-source` element and `mapbox-layer` element.

// <b>Example</b>

// ```html
// <mapbox-gl id="map"
//   interactive
//   map="{{map}}"
//   map-style-url="mapbox://styles/mapbox/dark-v9"
//   access-token="<MAPBOX_ACCESS_TOKEN>"
//   latitude=1.3521
//   longitude=103.8698
//   zoom=2></mapbox-gl>

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
//   source-data='{"type": "geojson", "data": "SOME_URL.geojson"}'
//   color="#eee"
//   line-width=2></mapbox-layer>

// <geojson-source
//   map="[[map]]"
//   source-id="geojsonsrc"
//   source-url="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_land.geojson"></geojson-source>
// ```


// ### Add building layer
// To add a building layer, just bind the corresponding `map` object from
// `mapbox-gl` selement to the `mapbox-building-layer` element.

// <b>Example</b>:
// ```html
// <mapbox-building-layer layer-id="buildings"
//   map="[[map]]"
//   fill-extrusion-opacity=0.6
//   fill-extrusion-color="#666"></mapbox-building-layer>
// ```

// ### Add marker
// To add a marker layer, just include the `mapbox-gl-marker` element as a child
// of the `mapbox-gl` element.

// <b>Example</b>:
// ```html
// <mapbox-gl id="map"
//   interactive
//   map="{{map}}"
//   map-style="mapbox://styles/mapbox/dark-v9"
//   access-token="<MAPBOX_ACCESS_TOKEN>"
//   latitude=1.3521
//   longitude=103.8698
//   zoom=16
//   pitch=45
//   bearing=0>

//     <mapbox-gl-marker class="big_kitten"
//       latitude=1.3521 longitude=103.8698
//       offset-left=-32 offset-top=-32>
//     </mapbox-gl-marker>

//     <mapbox-gl-marker
//       latitude=1.3541 longitude=103.8718
//       offset-left=-64 offset-top=-30>
//       Some text here
//     </mapbox-gl-marker>

// </mapbox-gl>
// ```

// ### Add popup
// `mapbox-gl-popup` can be used to create a pop-up. You can either attach the popup to a `mapbox-gl-marker` or trigger it manually with the `opened` property or `show` function.

// `mapbox-gl-popup` can be styled by setting either `text` or `html` properties. Alternatively, you can also pass a `slotted` element (slot="popup-content") into the popup (as show below).

// <b>Example - Display popup on click</b>
// HTML
// ```html
// <mapbox-gl
//   interactive
//   access-token="USE_UR_OWN_TOKEN"
//   events-to-watch="click"
//   on-mapbox-gl-click="handleClick">

//   <mapbox-gl-popup close-button close-on-click
//     opened="{{opened}}"
//     latitude="[[lat]]" longitude="[[lng]]">
//     <div slot="popup-content">
//       <p><b>Hi</b></p>
//       <p>You clicked on [[lat]], [[lng]]!</p>
//     </div>
//   </mapbox-gl-popup>
// </mapbox-gl>
// ```
// JS
// ```js
// handleClick = function(e, details) {
//   var {lngLat: { lat, lng }} = details;
//   this.lat = lat.toFixed(2);
//   this.lng = lng.toFixed(2);
//   this.opened = true;
// }
// ```

// <b>Example - Attache popup to `mapbox-gl-marker`</b>
// HTML
// ```html
// <mapbox-gl id="map" interactive
//   access-token="USE_UR_OWN_TOKEN"
//   latitude=1.3521 longitude=103.8698
//   zoom=15 pitch=45 bearing=0>

//   <mapbox-gl-marker
//     id="marker"
//     latitude=1.3521 longitude=103.8698
//     width=64 height=64
//     border-radius="50%"
//     background-image="https://placekitten.com/g/64/64">
//   </mapbox-gl-marker>

//   <mapbox-gl-popup
//     for="marker"
//     bottom="[0,-32]"
//     close-button close-on-click
//     latitude=1.3521 longitude=103.8698
//     html="Hello! This is a demo of a <b>popup</b>!">
//   </mapbox-gl-popup>

// </mapbox-gl>
// ```

// ### Data-driven styling
// To create a data-driven style for a attribute, just pass in a JSON object
// instead of a constant variable.

// more details @ https://www.mapbox.com/mapbox-gl-js/style-spec/#types-function

// <b>Example</b>
// ```html

//   <mapbox-gl id="map"
//     interactive
//     map="{{map}}"
//     map-style="mapbox://styles/mapbox/dark-v9"
//     access-token="<MAPBOX_ACCESS_TOKEN>"
//     latitude=40.66995747013945
//     longitude=-103.59179687498357
//     zoom=3></mapbox-gl>

//   <mapbox-layer
//     map="[[map]]"
//     layer-id="country"
//     rendering-type="fill"
//     source="geojsonsrc"
//     color="[[color]]"
//     filter="[[filter]]"></mapbox-layer>

//   <geojson-source
//     map="[[map]]"
//     source-id="geojsonsrc"
//     source-url="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson"></geojson-source>
// ```
// color
// ```js
// {
//   property: 'continent',
//   type: 'categorical',
//   stops: [
//     ['Africa', '#FAA'],
//     ['Asia', '#AAF']
//   ]
// }
// ```
// filter
// ```js
// ['in', 'continent', 'Africa', 'Asia']
// ```


// ### Add a Geocoder control
// To add a search input to `mapbox-gl`, you can use the `mapbox-gl-geocoder` element
// which uses the Mapbox Geocoding API to search for places. You just need to ensure
// the `mapbox-gl-geocoder` is a child of `mapbox-gl`.

// <b>Example</b>
// ```html
// <mapbox-gl interactive access-token="[accessToken]">

//   <mapbox-gl-geocoder
//     fly-to
//     limit=5
//     placeholder="Type to search"></mapbox-gl-geocoder>

// </mapbox-gl>
// ```

// ### Handling events
// To handle `click` event on a specific `map-layer`, you can listen for the
// `mapbox-layer-click` event. The event will return the feature of the geometry
// that is clicked upon.
// ```html
// <mapbox-layer
//   map="[[map]]"
//   layer-id="coastline_fill"
//   rendering-type="fill"
//   source-data="[[geojsonsrc]]"
//   color="#009688"
//   opacity=0.7
//   events-to-watch="click"
//   on-mapbox-layer-click="handleClick"></mapbox-layer>
// ```
// ```js
// function handleClick(e, {features}) {
//   if (features.length > 0) {
//     alert(features[0].properties.COSTAL_NAM);
//   }
// }
// ```

// ### Create a heatmap
// To create a heatmap, create a `geojson-source` with `cluster` to loaded a
// clustered data. Then create a `mapbox-heatmap-layer` with the corresponding
// `source`.

// <b>Example</b>
// ```html

//   <mapbox-gl id="map"
//     interactive
//     map="{{map}}"
//     map-style="mapbox://styles/mapbox/dark-v9"
//     access-token="<MAPBOX_ACCESS_TOKEN>"
//     latitude=40.66995747013945
//     longitude=-103.59179687498357
//     zoom=3></mapbox-gl>

//   <mapbox-heatmap-layer
//     map="[[map]]"
//     layer-id="heatmap"
//     source="geojsonsrc"
//     radius=80
//     color="rgba(0, 200, 0, 0.3)"
//     opacity=0.2
//     levels="[[levels]]"></mapbox-heatmap-layer>

//   <geojson-source
//     cluster
//     cluster-max-zoom=15
//     cluster-radius=20
//     map="[[map]]"
//     source-id="geojsonsrc"
//     source-url="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_parks_and_protected_lands_point.geojson"></geojson-source>
// ```

// ```javascript
// levels = [{"count": 0, "color": "#EEEEEE", "radius": 2, "opacity": 0.5},
//           {"count": 5, "color": "#2196F3"},
//           {"count": 8, "color": "#FFC107"},
//           {"count": 10, "color": "#F44336"}];

// ```

// ### Add Controls
// `mapbox-gl-control` is a generic element for [mapbox controls](https://www.mapbox.com/mapbox-gl-js/api/#icontrol) which you can add to the map.

// ```html
// <mapbox-gl
//   interactive
//   access-token="USE_UR_OWN_TOKEN">

//   <mapbox-gl-control
//     icontrol-name="NavigationControl"
//     icontrol-options='{"compass": true}'
//     position="top-right">
//   </mapbox-gl-control>

// </mapbox-gl>
// ```

// You can also pass in an **instance** of any mapbox controls (i.e. the IControl interface) to the `icontrol` attribute instead.

// ```html
// <mapbox-gl
//   interactive
//   access-token="USE_UR_OWN_TOKEN">

//   <mapbox-gl-control
//     icontrol="[[someCustomIControlInstance]]"
//     position="top-right">
//   </mapbox-gl-control>

// </mapbox-gl>
// ```

// You can also create your own custom IControl by declaring it as a child of `mapbox-gl-control`. Note that you cannot style it with external stylesheets.

// ```html
// <mapbox-gl interactive access-token="USE_UR_OWN_TOKEN">

//   <mapbox-gl-control interactive position="top-right">

//     <style>
//       #icontrol {
//         color: #fff;
//         text-align: center;
//         background-color: rgba(10,10,10,0.5);
//       }
//     </style>
//     <div id="icontrol">
//       <div>I am a custom Control.</div>
//       <button>Click me!</button>
//     </div>

//   </mapbox-gl-control>
// </mapbox-gl>
// ```

// ### Styling

// The following custom properties and mixins are available for styling:

// Custom property | Description | Default
// --- | --- | ---
// `--mapbox-map` | mixin applied to the map div element | `{}`
// `--mapbox-canvas` | mixin applied to the canvas element for the map | `{}`
// `--mapbox-gl-marker` | mixin applied to the marker element | `{}`


// @customElement
// @polymer
// @demo demo/index.html Data-binding to Lat, Lon, and Zoom
// @demo demo/event-handling.html Event-handing and Dynamic styling
// @demo demo/mapbox-source-data.html Loading GeoJSON into mapbox-gl
// @demo demo/markers.html Map markers and popup
// @demo demo/data-driven.html Data-driven Styling
// @demo demo/geocoder.html Adding Geocoder control
// @demo demo/heatmap.html Heatmap
// @demo demo/building.html 3D buildings
// @demo demo/centered.html Centered map
// @demo demo/controls.html Add Controls
class MapboxGL extends mixinBehaviors([IronResizableBehavior], PolymerElement) {
    static get template() {
        return html `
      <style>
        
        :host {
            width: 100%;
        height: 100%;
        display: inline-flex;
        overflow: hidden;
      }

      #map {
        position: relative;
        width: 100%;
        height: 100%;
        @apply --mapbox-map;
      }

      #map > .mapboxgl-canvas-container.mapboxgl-interactive > canvas {
        @apply --mapbox-canvas;
      }

      .mapbox-gl-marker {
        position: absolute;
        @apply --mapbox-gl-marker;
      }

      .mapboxgl-control-container .slotted-icontrol.interactive {
        pointer-events: auto;
      }
      </style>
      <div id="map"></div>
        <slot></slot>
    `;
    }
    static get properties() {
        return {
            /**
             * If the attribute is present no mouse, touch, or keyboard listeners
             * will be attached to the map, so it will not respond to interaction.
             * @type {Boolean}
             */
            interactive: Boolean,
            /**
             * Your [access token](https://www.mapbox.com/help/define-access-token/)
             * to mapbox.
             * @type {String}
             */
            accessToken: String,
            /**
             * You can enter the url to ur mapbox-gl-js script if it is hosted
             * external (e.g. cdn)
             * @type {String}
             */
            scriptSrc: {
                type: String,
                value: 'https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.js'
            },
            /**
             * You can enter the url to ur mapbox-gl-js stylesheet if it is
             * hosted external (e.g. cdn)
             * @type {String}
             */
            cssSrc: {
                type: String,
                value: 'https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css'
            },
            /**
             * A latitude to center the map on.
             * @type {Number}
             */
            latitude: {
                type: Number,
                notify: true,
                value: 1.3521
            },
            /**
             * A longitude to center the map on.
             * @type {Number}
             */
            longitude: {
                type: Number,
                notify: true,
                value: 103.8198
            },
            /**
             * The initial zoom level of the map.
             * @type {Number}
             */
            zoom: {
                type: Number,
                notify: true,
                value: 11
            },
            /**
             * The maximum zoom level of the map (1-20).
             * @type {Number}
             */
            maxZoom: {
                type: Number,
                notify: true,
                value: 20
            },
            /**
             * The minimum  zoom level of the map (1-20).
             * @type {Number}
             */
            minZoom: {
                type: Number,
                notify: true,
                value: 1
            },
            /**
             * The initial pitch (tilt) of the map, measured in degrees away from
             * the plane of the screen (0-60).
             * @type {Number}
             */
            pitch: {
                type: Number,
                notify: true,
                value: 0
            },
            /**
             * The initial bearing (rotation) of the map, measured in degrees
             * counter-clockwise from north.
             * @type {Number}
             */
            bearing: {
                type: Number,
                notify: true,
                value: 0
            },
            /**
             * The (map)[https://www.mapbox.com/mapbox-gl-js/api/#Map] instance
             * returned by mapboxgl-js.
             * @type {Mapbox.map}
             */
            map: {
                type: Object,
                notify: true,
                readonly: true
            },
            /**
             * The map's Mapbox style. This must be an a JSON object conforming to
             * the schema described in the Mapbox Style Specification.
             * @type {Object}
             */
            mapStyle: {
                type: Object
            },
            /**
             * The map's Mapbox style. This must be URL to an a JSON object
             * conforming to the schema described in the Mapbox Style
             * Specification.
             *
             * To load a style from the Mapbox API, you can use a URL of the form
             * `mapbox://styles/:owner/:style`, where :owner is your Mapbox account
             * name and :style is the style ID. Or you can use one of the following
             * the predefined Mapbox styles:
             * - mapbox://styles/mapbox/streets-v9
             * - mapbox://styles/mapbox/outdoors-v9
             * - mapbox://styles/mapbox/light-v9
             * - mapbox://styles/mapbox/dark-v9
             * - mapbox://styles/mapbox/satellite-v9
             * - mapbox://styles/mapbox/satellite-streets-v9
             *
             * Tilesets hosted with Mapbox can be style-optimized if you append
             * ?optimize=true to the end of your style URL, like
             * `mapbox://styles/mapbox/streets-v9?optimize=true`.
             * @type {String}
             */
            mapStyleUrl: {
                type: String,
                value: 'mapbox://styles/mapbox/dark-v9'
            },
            /**
             * `true` if mapboxgl-js script has been loaded
             * @type {Boolean}
             */
            loaded: {
                type: Boolean,
                notify: true,
                readOnly: true,
                value: false
            },
            /**
             * `mapbox-gl` accepts `deck-gl` element as a child.
             * @type {HTMLElement[]}
             */
            targets: {
                type: Array,
                readonly: true,
                value: function() {
                    return [];
                }
            },
            /**
             * `mapbox-gl` accepts elements with attribute `mapbox-gl-marker`
             * as a child.
             * @type {HTMLElement[]}
             */
            markers: {
                type: Array,
                readonly: true,
                value: function() {
                    return [];
                }
            },
            /**
             * A string with space delimited
             * (map events)[https://www.mapbox.com/mapbox-gl-js/api/#Map] to
             * listen to.
             * NOTE: `move` is watched by default, aka, a `mapbox-gl-move`
             * event will be fired whenever the map moves.
             * The corresponding event with be prefix with `mapbox-gl-`.
             * e.g. `move` will result with `mapbox-gl-move` event to be fired.
             *
             * ```html
             * <mapbox-gl events-to-watch="rotate zoomend"
             *  on-mapbox-gl-move="handleMove"
             *  on-mapbox-gl-rotate="handleRotate"
             *  on-mapbox-gl-zoomend="handleZoomend"></mapbox-gl>
             * ```
             * @type {String}
             *
             */
            eventsToWatch: {
                type: String,
                observer: '_eventsToWatchChanged'
            },
            /**
             * The number of milliseconds to debounce before synchronization of the
             * various state.
             * @type {Number}
             */
            debounceTime: {
                type: Number,
                value: 300
            },
            /**
             * The map element embedded inside the webcomponent.
             * @type {HTMLElement}
             */
            mapElement: {
                type: Object,
                notify: true,
                readOnly: true
            },
            _controls: Array,
            _childrenObserver: Object,
            _mapListener: Object,
            _listeners: Object,
            _clearEvents: Array,
            _watchEvents: Array,
            _mapDebouncer: Object,
            _centerDebouncer: Object,
            _zoomDebouncer: Object,
            _cssLoaded: Boolean,
            _scriptLoaded: Boolean,
            _mapLoaded: Boolean,
            _pendingChildren: Array,
            _resizeListener: Object
        };
    }
    static get observers() {
            return [
                '_updateMap(loaded, accessToken)',
                '_updateStyle(map, mapStyle)',
                '_updateStyle(map, mapStyleUrl)',
                '_setCenter(map, latitude, longitude)',
                '_setZoom(map, zoom)',
                '_clearListeners(map, _clearEvents)',
                '_forwardEvents(map, _watchEvents)'
            ];
        }
        /**
         * Called every time the element is inserted into the DOM. Useful for 
         * running setup code, such as fetching resources or rendering.
         * Generally, you should try to delay work until this time.
         */
    connectedCallback() {
        super.connectedCallback();
        this._setMapElement(this.$.map);
        afterNextRender(this, this._init);
        this._resizeListener = this.addEventListener('iron-resize', function(e) {
            console.log("resized");
        });

    }

    ready() {
        super.ready();
        this._setLoaded(window.mapboxgl && true);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._childrenObserver) {
            this._childrenObserver.disconnect();
            this._childrenObserver = null;
        }
        if (this._resizeListener) {
            this.removeEventListener('iron-resize', this._resizeListener);
        }
    }

    _init() {
        if (!this.loaded) {
            // listens for resize events
            this._resizeListener = this.addEventListener('iron-resize', this.resize);

            // dynamically load mapbox-gl-js
            PolymerVis.loadScript(
                this.scriptSrc,
                () => {
                    this._scriptLoaded = true;
                    this._setLoaded(this._scriptLoaded && this._cssLoaded);
                },
                null,
                true
            );
        }

        // Load the text from an external CSS file, and insert a `style` element
        PolymerVis.insertCssIntoShadowRoot(this.cssSrc, this.shadowRoot, () => {
            this._cssLoaded = true;
            this._setLoaded(this._scriptLoaded && this._cssLoaded);
        });

        var slot = this.shadowRoot.querySelector('slot');
        this._childrenObserver = new FlattenedNodesObserver(
            slot,
            this._slotChanged.bind(this)
        );

        // manually trigger resize
        this.resize();
    }

    // watch for future updates for the layers
    _observeChildren() {
        // if (this._childrenObserver) {
        //   return;
        // }
        // this._childrenObserver = new MutationObserver(
        //   this._updateChildren.bind(this)
        // );
        // this._childrenObserver.observe(this, {
        //   childList: true
        // });
    }

    _slotChanged() {
        var nodes = this.shadowRoot
            .querySelector('slot')
            .assignedNodes({ flatten: true });

        this._controls = nodes.filter(n => n.nodeName.slice(0, 6) === 'MAPBOX');
        this.markers = this._controls.filter(n => n.nodeName == 'MAPBOX-GL-MARKER');

        if (this.map && this._mapLoaded) {
            nodes.filter(n => n.nodeName.slice(0, 6) === 'MAPBOX').forEach(n => {
                n.map = this.map;
            });
        }

        if (this._pendingChildren) {
            this._pendingChildren.forEach(n => {
                n.map = this.map;
                n._mapLoaded = this._mapLoaded;
            });
            this._pendingChildren = null;
        }

    }

    _updateChildren() {
        /*
            var map = this.map;
            // update deck-gl
            var targets = Array.prototype.slice.call(
              Polymer.dom(this.$.deckgl).getDistributedNodes()
            );
            // Do not recompute if objects have not been added or removed.
            if (targets.length === this.targets.length) {
              var added = targets.filter(
                function(node) {
                  return this.targets.indexOf(node) === -1;
                }.bind(this)
              );
              if (added.length > 0) {
                this.targets = targets;
              }
            } else {
              this.targets = targets;
            }
    
            // update mapbox-gl-marker
            var markers = Array.prototype.slice.call(
              Polymer.dom(this.$.markers).getDistributedNodes()
            );
            // Do not recompute if objects have not been added or removed.
            if (markers.length === this.markers.length) {
              var added = markers.filter(
                function(node) {
                  var isNew = this.markers.indexOf(node) === -1;
                  if (isNew && map) {
                    node.map = map;
                  }
                  return isNew;
                }.bind(this)
              );
              if (added.length > 0) {
                this.markers = markers;
              }
            } else {
              this.markers = markers;
            }
            this._observeChildren();
            */
    }

    _onTap(event, detail) {
        var targets = this.targets;
        if (!targets || targets.length < 1) return;
        targets[0].dispatchEvent(new CustomEvent('tap', { detail }));
    }

    _onMouseMove(event) {
        var targets = this.targets;
        if (!targets || targets.length < 1) return;
        targets[0].dispatchEvent(new MouseEvent('mousemove', event));
    }

    _updateMap() {
        if (!this.loaded || !this.accessToken) return;
        if (this.map) return;
        this._mapDebouncer = Debouncer.debounce(
            this._mapDebouncer,
            timeOut.after(this.debounceTime),
            this._createMap.bind(this)
        );
    }

    _updateStyle(map, mapStyle) {
        if (!map || !mapStyle) return;
        map.setStyle(mapStyle);
    }

    /**
     * Wrapper function over `mapbox` resize function. Manually trigger mapbox to
     * resize the map canvas.
     */
    resize() {
        if (this.map) {
            this.map.resize();
        }
        return this;
    }

    _setCenter(map) {
        if (!map) return;
        this._centerDebouncer = Debouncer.debounce(
            this._centerDebouncer,
            timeOut.after(this.debounceTime),
            () => map.setCenter([this.longitude, this.latitude])
        );
    }

    _setZoom(map) {
        if (!map) return;
        this._zoomDebouncer = Debouncer.debounce(
            this._zoomDebouncer,
            timeOut.after(this.debounceTime),
            () => map.setZoom(this.zoom)
        );
    }

    _createMap() {
        var mod = function(value, divisor) {
            var modulus = value % divisor;
            return modulus < 0 ? divisor + modulus : modulus;
        };
        this._listeners = Object.create(null);
        /* global mapboxgl */
        mapboxgl.accessToken = this.accessToken;
        var opts = {
            container: this.$.map,
            style: this.mapStyle,
            center: [this.longitude, this.latitude],
            zoom: this.zoom,
            pitch: this.pitch,
            bearing: this.bearing,
            interactive: this.interactive && true,
            maxZoom: this.maxZoom,
            minZoom: this.minZoom
        };

        var mapMoveListener = () => {
            if (this._centerDebouncer) this._centerDebouncer.cancel();

            var transform = map.transform;
            this.latitude = transform.center.lat;
            this.longitude = mod(transform.center.lng + 180, 360) - 180;
            this.zoom = transform.zoom;
            this.pitch = transform.pitch;
            this.bearing = mod(transform.bearing + 180, 360) - 180;
        };
        var map = new mapboxgl.Map(opts);
        // secret binding for other mapbox elements
        map.polymervis = { parent: this };
        this.map = map;
        this.map.on('load', e => {
            this._mapLoaded = true;
            this._slotChanged();
        });
        this.map.on('error', e => {
            this.dispatchEvent(new CustomEvent('error', { detail: e }));
        });
        this._forwardEvent('move', mapMoveListener);
        this.dispatchEvent(
            new CustomEvent('mapbox-gl-ready', { detail: this.map })
        );
    }

    _eventsToWatchChanged(newstr, oldstr) {
        if (oldstr) {
            this._clearEvents = oldstr.trim().split(' ');
        }

        if (newstr) {
            this._watchEvents = newstr.trim().split(' ');
        }
    }

    _clearListeners(map, _clearEvents) {
        if (!_clearEvents || !map) return;
        for (var i = 0, len = _clearEvents.length; i < len; ++i) {
            this._clearListener(_clearEvents[i].trim());
        }
    }

    _clearListener(name) {
        if (this._listeners[name]) {
            this.map.off(name, this._listeners[name]);
            this._listeners[name] = null;
        }
    }

    _forwardEvents(map, _watchEvents) {
        if (!_watchEvents || !map) return;
        for (var i = 0, len = _watchEvents.length; i < len; ++i) {
            this._forwardEvent(_watchEvents[i].trim());
        }
    }

    _forwardEvent(name, fn) {
        if (fn) {
            this._listeners[name] = function(event) {
                fn(event);
                this.dispatchEvent(
                    new CustomEvent('mapbox-gl-' + name, { detail: event })
                );
            }.bind(this);
        } else {
            this._listeners[name] = function(event) {
                this.dispatchEvent(
                    new CustomEvent('mapbox-gl-' + name, { detail: event })
                );
            }.bind(this);
        }
        this.map.on(name, this._listeners[name]);
    }

}

window.customElements.define('mapbox-gl', MapboxGL);