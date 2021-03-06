import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import "./utils-lib.js";
/**
 * mapbox-gl-geocoder` is a `mapbox-gl` control to search for places using Mapbox Geocoding API.
You can data-bind to `last-results` for the results for the latest query. Alternatively,
you can also listen to `results` event.

```html
<mapbox-gl interactive access-token="[accessToken]">

  <mapbox-gl-geocoder
    fly-to
    limit=5
    placeholder="Type to search"
    last-results="{{results}}"
    on-results="onResults"></mapbox-gl-geocoder>

</mapbox-gl>
```



@customElement
@polymer
@demo demo/geocoder.html Adding Geocoder control
 */
class MapboxGlGeocoder extends PolymerElement {

    static get properties() {
        return {
            /**
             * Mapbox.map
             * @type {String}
             */
            map: {
                type: Object
            },
            /**
             * Your [access token](https://www.mapbox.com/help/define-access-token/)
             * to mapbox. Will be the same as the parent `mapbox-gl` element.
             * @type {String}
             */
            accessToken: {
                type: String
            },
            /**
             * The [MapboxGeocoder](https://github.com/mapbox/mapbox-gl-geocoder)
             * object.
             * @type {MapboxGeocoder}
             */
            geocoder: {
                type: Object,
                readOnly: true,
                notify: true
            },
            /**
             * On geocoded result what zoom level should the map animate to when a
             * bbox isn't found in the response. If a bbox is found the map will fit
             * to the bbox.
             * @type {Number}
             */
            zoom: {
                type: Number,
                value: 16
            },
            /**
             * Animating the map to a selected result will be enabled if `flyTo` is
             * set.
             * @type {Boolean}
             */
            flyTo: {
                type: Boolean
            },
            /**
             * Placeholder attribute value for the input element.
             * @type {String}
             */
            placeholder: {
                type: String,
                value: 'Search'
            },
            /**
             * This is a geographical point given as an object with latitude and
             * longitude properties. Search results closer to this point will be given
             * higher priority.
             * @type {{latitude: Number, longitude: Number}}
             */
            proximity: {
                type: Object,
                value: null
            },
            /**
             * This is a bounding box given as an array in the format
             * `[minX, minY, maxX, maxY]`.
             * Search results will be limited to the bounding box.
             * @type {Array}
             */
            bbox: {
                type: String,
                value: null
            },
            /**
             * A comma separated list of
             * [types](https://www.mapbox.com/developers/api/geocoding/#filter-type)
             * that filter results to match those specified.
             * @type {String}
             */
            types: {
                type: String,
                value: null
            },
            /**
             * A comma separated list of country codes to limit results to specified
             * country or countries.
             * @type {String}
             */
            country: {
                type: String,
                value: null
            },
            /**
             * Minimum number of characters to enter before results are shown.
             * @type {Number}
             */
            minLength: {
                type: Number,
                value: 2
            },
            /**
             * Maximum number of results to show.
             * @type {Number}
             */
            limit: {
                type: Number,
                value: 5
            },
            /**
             * Specify the language to use for response text and query result
             * weighting.
             * Options are IETF language tags comprised of a mandatory ISO 639-1
             * language code and optionally one or more IETF subtags for country or
             * script. More than one value can also be specified, separated by commas.
             * @type {String}
             */
            language: {
                type: String,
                value: null
            },
            /**
             * You can enter the url to ur mapbox-gl-geocoder script if it is hosted
             * externally (e.g. cdn)
             * @type {String}
             */
            scriptSrc: {
                type: String,
                value: 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v2.1.1/mapbox-gl-geocoder.min.js'
            },
            /**
             * You can enter the url to ur mapbox-gl-geocoder stylesheet if it is
             * hosted
             * externally (e.g. cdn)
             * @type {String}
             */
            cssSrc: {
                type: String,
                value: 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v2.1.1/mapbox-gl-geocoder.css'
            },
            /**
             * The latest results returned by the query.
             * @type {{features: Array}}
             */
            lastResults: {
                type: Object,
                readOnly: true,
                notify: true
            },
            _ready: Boolean,
            _cssReady: Boolean
        };
    }

    static get observers() {
        return ['_createGeocoder(accessToken,_ready)', '_mapReady(map,geocoder,_cssReady)'];
    }
    connectedCallback() {
        super.connectedCallback();

        this._onError = this._onError.bind(this);
        this._onResults = this._onResults.bind(this);

        if (!window.MapboxGeocoder) {
            PolymerVis.loadScript(
                this.scriptSrc,
                () => {
                    this._ready = window.MapboxGeocoder && true;
                },
                this._onError,
                true
            );
        }

        if (this.parentNode.nodeName === 'MAPBOX-GL') {
            PolymerVis.insertCssIntoShadowRoot(
                this.cssSrc,
                this.parentNode.shadowRoot,
                () => { this._cssReady = true; },
                'MapboxGlGeocoder'
            );
            this.accessToken = this.parentNode.accessToken;
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.geocoder) {
            this.geocoder.off('error', this._onError);
            this.geocoder.off('results', this._onResults);
        }
    }

    _createGeocoder() {
        if (!this.accessToken || !this._ready) return;
        var _keydown = MapboxGeocoder.prototype._onKeyDown;
        // monkey patching
        MapboxGeocoder.prototype._onKeyDown = function(e) {
            // events from shadowRoot are targetted to the root element of the
            // shadowRoot instead of the actual active element
            // to prevent this retargeting, a proxy object is passed in instead
            _keydown.call(this, { target: { value: e.target.value } });
        };
        this._setGeocoder(new MapboxGeocoder({
            accessToken: this.accessToken,
            zoom: this.zoom,
            flyTo: this.flyTo || false,
            placeholder: this.placeholder,
            proximity: this.proximity,
            bbox: this.bbox,
            types: this.types,
            country: this.country,
            minLength: this.minLength,
            limit: this.limit,
            language: this.language
        }));
        this.geocoder.on('error', this._onError);
        this.geocoder.on('results', this._onResults);
    }

    /**
     * Fired when a new set of query results are available.
     *
     * @event results
     * @param {{features: Array}} results query results
     */
    _onResults(results) {
        this._setLastResults(results);
        this.dispatchEvent(new CustomEvent('results', { detail: results }));
    }

    /**
     * Fired whenever an error is encountered.
     *
     * @event results
     * @param {String} error error message
     */
    _onError(error) {
        this.dispatchEvent(new CustomEvent('error', { detail: error }));
    }

    _mapReady(map) {
        if (!this.map || !this.geocoder || !this._cssReady) return;
        if (this.parentNode.nodeName === 'MAPBOX-GL') {
            map.addControl(this.geocoder);
        }
    }
}

window.customElements.define('mapbox-gl-geocoder', MapboxGlGeocoder);