import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

/**
 * The `mapbox-gl-marker` element represents a map marker. It is used as a
child of `mapbox-gl`.

The default anchor is the CENTER of the element.

You can either style the element via CSS selector "div.mapbox-gl-marker", or attached other elements as its
child as shown in the example below.

<b>Example</b>:
```html
<mapbox-gl id="map"
  interactive
  map="{{map}}"
  map-style="mapbox://styles/mapbox/dark-v9"
  access-token="<MAPBOX_ACCESS_TOKEN>"
  latitude=1.3521
  longitude=103.8698
  zoom=16
  pitch=45
  bearing=0>

    <mapbox-gl-marker
      latitude=1.3521
      longitude=103.8698
      width=64
      height=64
      border-radius="50%"
      background-image="https://placekitten.com/g/64/64">
    </mapbox-gl-marker>

    <mapbox-gl-marker
      latitude=1.3541 longitude=103.8718
      offset-top=15>
      <div class="textbox">Some text here</div>
      <div class="arrow-down"></div>
    </mapbox-gl-marker>

</mapbox-gl>
```

See https://www.mapbox.com/mapbox-gl-js/api/#Marker for
more details.


 * @customElement
 * @polymer
 * @demo demo/markers.html Plotting map markers
 */
class MapboxGlMarker extends PolymerElement {
    static get template() {
        return html `
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
    `;
    }

    static get properties() {
        return {
            /**
             * Reference to `Mapbox.Popup` instance to display when the marker is
             * clicked.
             * @type {Mapbox.Popup}
             */
            popup: {
                type: Object,
                value: null
            },
            /* show a down pointing arrow to indicate the actual position. */
            showArrow: {
                type: Boolean,
                value: false
            },
            /* color of the arrow */
            arrowColor: {
                type: String,
                value: '#444'
            },
            /* css border-radius style */
            borderRadius: {
                type: String
            },
            height: {
                type: Number,
                value: 24
            },
            width: {
                type: Number,
                value: 24
            },
            /*
             * latitude of the marker
             */
            latitude: {
                type: Number,
                reflectToAttribute: true,
                notify: true
            },
            /*
             * longitude of the marker
             */
            longitude: {
                type: Number,
                reflectToAttribute: true,
                notify: true
            },
            /*
             * background color for the marker
             */
            backgroundColor: {
                type: String
            },
            /*
             * url to the image to use for the background of the marker
             */
            backgroundImage: {
                type: String
            },
            /*
             * POSTIVE values denotes the number of pixels to offset to the RIGHT,
             * while NEGATIVE values denotes the number of pixels to offset to the
             * LEFT.
             *
             * Equivalent to CSS left.
             */
            offsetLeft: {
                type: Number,
                value: 0
            },
            /*
             * POSTIVE values denotes the number of pixels to offset DOWNWARD,
             * while NEGATIVE values denotes the number of pixels to offset UPWARD.
             *
             * Equivalent to CSS top.
             */
            offsetTop: {
                type: Number,
                value: 0
            },
            /*
             * `map` object returned from mapbox-gl
             */
            map: {
                type: Object
            },
            /*
             * `map` object returned from mapbox-gl
             */
            draggable: {
                type: Boolean
            },
            /*
             * 'mapboxgl.Marker' object
             */
            marker: {
                type: Object,
                notify: true,
                readonly: true,
                computed: '_createMarker(map, _ele, offsetLeft, offsetTop, draggable)'
            },
            _popup: Object,
            _ele: {
                type: Object,
                computed: '_createMarkerElement(map)'
            },
            _arr: Object,

            _attached: Boolean
        };
    }

    static get observers() {
        return ['updateLatLng(marker, latitude, longitude)',
            '_updateStyle(_ele, width, height, borderRadius, backgroundColor, backgroundImage)',
            '_addDownArrow(_ele, showArrow, width, height, arrowColor)',
            'setPopup(_popup, marker)'
        ]
    }

    connectedCallback() {
        super.connectedCallback();
        this._attached = true;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._attached = false;
        if (this.marker) {
            this.marker.remove();
        }
    }

    /*
     * Updates the latitude and longitude of the marker.
     */
    updateLatLng(marker, lat, lng) {
        if (marker) {
            marker.setLngLat([lng, lat]);
        }
    }

    /**
     * Attach a `Mapbox.Popup` instance or `mapbox-gl-popup` element to this
     * marker.
     * @param {Mapbox.Popup|HTMLElement} popup
     */
    setPopup(popup) {
        if (!popup) return;
        if (!this.marker) return;
        this._popup = popup.is === 'mapbox-gl-popup' ? popup.popup : popup;
        return this.marker.setPopup(this._popup);
    }

    _createMarkerElement() {
        var children = this.shadowRoot
            .querySelector('slot')
            .assignedNodes({ flatten: true });
        var len = children.length;
        var className = ('mapbox-gl-marker ' + this.className).trim();
        var ele;
        if (len == 0) {
            ele = document.createElement('div');
            ele.className = className;
        } else {
            // if more than 1 ele, create a wrapper
            ele = document.createElement('div');
            ele.className = className;
            for (var i = 0; i < len; ++i) {
                ele.appendChild(children[i]);
            }
        }

        return ele;

    }

    _createMarker(map, ele, offsetLeft, offsetTop, draggable) {

        if (!map || !ele) return;
        /* global mapboxgl */
        var marker = new mapboxgl.Marker(ele, { draggable: draggable, offset: [offsetLeft, offsetTop] })
            .setLngLat([this.longitude, this.latitude])
            .addTo(map);
        if (draggable == undefined) {
            draggable = false;
        } else {
            marker.on("dragend", function() {
                const lngLat = marker.getLngLat();
                this.set("latitude", lngLat.lat);
                this.set("longitude", lngLat.lng);
            }.bind(this));
        }
        //console.log("dragglble", draggable);
        return marker;
    }

    _updateStyle(ele, width, height, borderRadius, backgroundColor, backgroundImage) {
        if (!ele) return;
        ele.style.height = height + 'px';
        ele.style.width = width + 'px';
        if (borderRadius)
            ele.style.borderRadius = borderRadius;
        if (backgroundColor)
            ele.style.backgroundColor = backgroundColor;
        if (backgroundImage) {
            ele.style.backgroundImage = `url(${backgroundImage})`;
        }
        if (this._arr) {
            this._arr.style.transform = `translateX(${width/2}px)`;
        }
    }

    _addDownArrow(ele, showArrow, width, height, arrowColor) {
        if (!ele) return;
        if (!showArrow) {
            if (this._arr) {
                ele.removeChild(this._arr);
                this.offsetTop = 0;
            }
            return;
        }
        var arr = this._arr || document.createElement('div');
        arr.style.transform = `translateX(${width/2}px)`;
        arr.style.marginLeft = '-8px';
        arr.style.position = 'absolute';
        arr.style.bottom = '-8px';
        arr.style.width = '0px';
        arr.style.height = '0px';
        arr.style.borderLeft = '8px solid transparent';
        arr.style.borderRight = '8px solid transparent';
        arr.style.borderTop = `8px solid ${arrowColor}`;
        this._arr = arr;
        this.offsetTop = -(0.5 * height) - 8;

        ele.appendChild(arr);
    }
}

window.customElements.define('mapbox-gl-marker', MapboxGlMarker);