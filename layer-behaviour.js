import "@polymer/polymer/polymer-element.js";
(function(MapboxGLPolymer) {
    /*
     * @polymerBehavior
     */
    MapboxGLPolymer.LayerBehavior = {
        properties: {
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
                type: String,
                observer: '_layerIdChanged'
            },
            /*
             * set layer to not visible if true.
             */
            hidden: {
                type: Boolean
            },
            /*
             * Rendering type of this layer.
             * (fill, line, symbol, circle, fill-extrusion, raster, background)
             */
            renderingType: {
                type: String
            },
            /*
             * Name of a source description to be used for this layer.
             */
            source: {
                type: String
            },
            /*
             * Define the source data directly inside this layer. `type` is usually
             * `geojson`, where `data` is the GeoJSON object or an URL to the GeoJSON.
             *
             * @type {{type: string, data: object}}
             */
            sourceData: {
                type: Object,
                observer: '_sourceDataChanged'
            },
            /*
             * Layer to use from a vector tile source. Required if the source
             * supports multiple layers.
             */
            sourceLayer: {
                type: String
            },
            /*
             * The minimum zoom level on which the layer gets parsed and appears on.
             */
            minZoom: {
                type: Number,
                value: 0
            },
            /*
             * The maximum zoom level on which the layer gets parsed and appears on.
             */
            maxZoom: {
                type: Number,
                value: 22
            },
            /*
             * A expression specifying conditions on source features. Only features
             * that match the filter are displayed.
             *
             * e.g. `["==", "$type", "Polygon"]` to render Polygon only.
             */
            filter: Array,
            /*
             * Optional number.  Defaults to 1.
             * The opacity of the layer.
             */
            opacity: Number,
            /*
             * Optional color.  Defaults to #000000. This color can be specified
             * as rgba with an alpha component and the color's opacity will not
             * affect the opacity of the 1px stroke, if it is used.
             */
            color: String,
            /*
             * Optional array.  Units in pixels. Defaults to 0,0.
             * The geometry's offset. Values are [x, y] where negatives indicate
             * left and up, respectively.
             */
            translate: Array,
            /*
             * Optional enum.  One of `map` or `viewport`. Defaults to map.
             * Requires `fill-translate`.
             * Controls the translation reference point.
             * - `map`: The fill is translated relative to the map.
             * - `viewport`: The fill is translated relative to the viewport.
             */
            translateAnchor: String,
            /*
             * Optional string.
             * Name of image in sprite to use for drawing image fills or lines. For
             * seamless patterns, image width and height must be a factor of two
             * (2, 4, 8, ..., 512).
             */
            pattern: String,
            /*
             * no antialiasing for fill if set to true.
             */
            noAntialias: Boolean,
            /*
             * The outline color of the fill. Matches the value of color if
             * unspecified.
             * Disabled if `pattern` or `no-antialias` is set.
             */
            outlineColor: String,

            /*
             * Optional enum.  One of `butt`, `round`, `square`. Defaults to `butt`.
             * The display of line endings.
             * - `butt`: A cap with a squared-off end which is drawn to the exact
             * endpoint of the line.
             * - `round`: A cap with a rounded end which is drawn beyond the endpoint
             * of the line at a radius of one-half of the line's width and centered
             * on the endpoint of the line.
             * - `square`: A cap with a squared-off end which is drawn beyond the
             * endpoint of the line at a distance of one-half of the line's width.
             *
             */
            lineCap: String,
            /*
             * Optional enum.  One of `bevel`, `round`, `miter`. Defaults to `miter`.
             * The display of lines when joining.
             * - `bevel`:
             * A join with a squared-off end which is drawn beyond the endpoint of the
             * line at a distance of one-half of the line's width.
             * - `round`:
             * A join with a rounded end which is drawn beyond the endpoint of the
             * line at a radius of one-half of the line's width and centered on the
             * endpoint of the line.
             * - `miter`:
             * A join with a sharp, angled corner which is drawn with the outer sides
             * beyond the endpoint of the path until they meet.
             */
            lineJoin: String,
            /*
             * Optional number.  Defaults to 2. Requires line-join = `miter`.
             * Used to automatically convert `miter` joins to bevel joins for sharp
             * angles.
             */
            lineMiterLimit: Number,
            /*
             * Optional number.  Defaults to 1.05. Requires line-join = `round`.
             * Used to automatically convert round joins to miter joins for shallow
             * angles.
             */
            lineRoundLimit: Number,
            /*
             * Optional number.  Units in pixels. Defaults to 1.
             * Stroke thickness.
             */
            lineWidth: Number,
            /*
             * Optional number.  Units in pixels. Defaults to 0.
             * The line's offset. For linear features, a positive value offsets the
             * line to the right, relative to the direction of the line, and a
             * negative value to the left. For polygon features, a positive value
             * results in an inset, and a negative value results in an outset.
             */
            lineOffset: Number,
            /*
             * Optional number.  Units in pixels. Defaults to 0.
             * Blur applied to the `rendering-type` = `line` or `circle`, in pixels.
             * 1 blurs the circle such that only the centerpoint is full opacity.
             */
            blur: Number,
            /*
             * Optional array.  Units in line widths. Disabled by line-pattern.
             * Specifies the lengths of the alternating dashes and gaps that form the
             * dash pattern. The lengths are later scaled by the line width. To
             * convert a dash length to pixels, multiply the length by the current
             * line width.
             */
            lineDasharray: Array,
            /*
             * Optional number.  Units in pixels. Defaults to 0.
             * Draws a line casing outside of a line's actual path. Value indicates
             * the width of the inner gap.
             */
            lineGapWidth: Number,
            /*
             * Optional number.  Units in pixels. Defaults to 5.
             * Circle radius.
             */
            radius: Number,
            /*
             * Optional enum.  One of `map` or `viewport`. Defaults to map.
             * Controls the scaling behavior of the circle when the map is pitched.
             * - `map`: Circles are scaled according to their apparent distance to
             * the camera.
             * - `viewport`: Circles are not scaled.
             */
            circlePitchScale: String,
            /*
             * Optional number.  Units in pixels. Defaults to 0.
             * The width of the circle's stroke. Strokes are placed outside of the
             * circle-radius.
             */
            circleStrokeWidth: Number,
            /*
             * Optional color.  Defaults to #000000.
             * The stroke color of the circle.
             */
            circleStrokeColor: String,
            /*
             * Optional number.  Defaults to 1.
             * The opacity of the circle's stroke.
             */
            circleStrokeOpacity: Number,
            /*
             * requires `rendering-type` to be `fill-extrusion`.
             * The opacity of the entire fill extrusion layer. This is rendered on
             * a per-layer, not per-feature, basis, and data-driven styling is not
             * available.
             */
            fillExtrusionOpacity: {
                type: Number
            },
            /*
             * requires `rendering-type` to be `fill-extrusion`.
             * The base color of the extruded fill. The extrusion's surfaces will be
             * shaded differently based on this color in combination with the root
             * light settings. If this color is specified as rgba with an alpha
             * component, the alpha component will be ignored; use
             * fill-extrusion-opacity to set layer opacity.
             */
            fillExtrusionColor: {
                type: String
            },
            /*
             * requires `rendering-type` to be `fill-extrusion`.
             * The geometry's offset. Values are [x, y] where negatives indicate
             * left and up (on the flat plane), respectively.
             */
            fillExtrusionTranslate: {
                type: Array
            },
            /*
             * requires `rendering-type` to be `fill-extrusion`.
             * Controls the translation reference point (map or viewport).
             */
            fillExtrusionTranslateAnchor: {
                type: String
            },
            /*
             * requires `rendering-type` to be `fill-extrusion`.
             * Name of image in sprite to use for drawing images on extruded fills.
             * For seamless patterns, image width and height must be a factor of
             * two (2, 4, 8, ..., 512).
             */
            fillExtrusionPattern: {
                type: String
            },
            /*
             * requires `rendering-type` to be `fill-extrusion`.
             * The height (in meters) with which to extrude this layer.
             */
            fillExtrusionHeight: {
                type: Number
            },
            /*
             * requires `rendering-type` to be `fill-extrusion`.
             * The height with which to extrude the base of this layer.
             * Must be less than or equal to fill-extrusion-height
             */
            fillExtrusionBase: {
                type: Number
            },
            /*
             * Requires renderingType to be 'symbol'. Value to use for a text label.
             * Feature properties are specified using
             * tokens like {field_name}. (Token replacement is only supported for
             * literal text-field values--not for property functions.)
             */
            textField: String,
            /*
             * Requires renderingType to be 'symbol'.
             * Font stack to use for displaying text.
             */
            textFont: String,
            /*
             * Requires renderingType to be 'symbol'.
             * Font size. Defaults to 16px;
             */
            textSize: Number,
            /*
             * Requires renderingType to be 'symbol'.
             * The maximum line width for text wrapping. Defaults to 10;
             */
            textMaxWidth: Number,
            /*
             * Requires renderingType to be 'symbol'.
             * Text leading value for multi-line text. Defaults to 1.2;
             */
            textLineHeight: Number,
            /*
             * Requires renderingType to be 'symbol'.
             * text justification options. "left", "right", or "center" (default).
             */
            textJustify: String,
            /*
             * Requires renderingType to be 'symbol'.
             * Part of the text placed closest to the anchor.
             * One of center, left, right, top, bottom, top-left, top-right,
             * bottom-left, bottom-right. Defaults to center.
             */
            textAnchor: String,
            /*
             * Requires renderingType to be 'symbol'.
             * Offset distance of text from its anchor.
             * Positive values indicate right and down, while negative values
             * indicate left and up.
             */
            textOffset: Array,
            /*
             * Requires renderingType to be 'symbol'.
             * The color with which the text will be drawn. Defaults to #000000
             */
            textColor: String,
            /*
             * A string with space delimited
             * (map events)[https://www.mapbox.com/mapbox-gl-js/api/#Map] to
             * listen to.
             * The corresponding event with be prefix with `mapbox-layer-`.
             * e.g. `click` will result with `mapbox-layer-click` event to be fired.
             *
             * ```html
             * <mapbox-gl events-to-watch="rotate zoomend"
             *  on-mapbox-gl-move="handleMove"
             *  on-mapbox-gl-rotate="handleRotate"
             *  on-mapbox-gl-zoomend="handleZoomend"></mapbox-gl>
             * ```
             *
             */
            eventsToWatch: {
                type: String,
                observer: '_eventsToWatchChanged'
            },

            _antialias: {
                type: Boolean,
                computed: '_not(noAntialias)'
            },
            _visibility: {
                type: String,
                computed: '_if(hidden, "none", "visible")'
            },
            _added: {
                type: String
            },
            _layer: Object,
            _clearEvents: Array,
            _watchEvents: Array
        },

        observers: [
            '_generateLayerProp(layerId, renderingType, minZoom, maxZoom)',
            '_updateLayerProp("source", source, _layer)',
            '_updateLayerProp("source", sourceData, _layer)',
            '_updateLayerProp("source-layer", sourceLayer, _layer)',
            '_updateLayerProp("filter", filter, _layer)',

            '_setFilter(map, layerId, filter)',

            '_setPaintProperty(map, layerId, "color", color, renderingType, _added)',
            '_setPaintProperty(map, layerId, "opacity", opacity, renderingType, _added)',
            '_setPaintProperty(map, layerId, "translate", translate, renderingType, _added)',
            '_setPaintProperty(map, layerId, "translate-anchor", translateAnchor, renderingType, _added)',
            '_setPaintProperty(map, layerId, "pattern", pattern, renderingType, _added)',
            '_setPaintProperty(map, layerId, "blur", blur, renderingType, _added)',

            '_setPaintProperty(map, layerId, "circle-radius", radius, null, _added)',
            '_setPaintProperty(map, layerId, "circle-pitch-scale", circlePitchScale, null, _added)',
            '_setPaintProperty(map, layerId, "circle-stroke-width", circleStrokeWidth, null, _added)',
            '_setPaintProperty(map, layerId, "circle-stroke-color", circleStrokeColor, null, _added)',
            '_setPaintProperty(map, layerId, "circle-stroke-opacity", circleStrokeOpacity, null, _added)',

            '_setPaintProperty(map, layerId, "line-dasharray", lineDasharray, null, _added)',
            '_setPaintProperty(map, layerId, "line-width", lineWidth, null, _added)',
            '_setPaintProperty(map, layerId, "line-gap-width", lineGapWidth, null, _added)',
            '_setPaintProperty(map, layerId, "line-offset", lineOffset, null, _added)',

            '_setPaintProperty(map, layerId, "fill-antialias", _antialias, null, _added)',
            '_setPaintProperty(map, layerId, "fill-outline-color", outlineColor, null, _added)',

            '_setPaintProperty(map, layerId, "fill-extrusion-translate-anchor", fillExtrusionTranslateAnchor, null, _added)',
            '_setPaintProperty(map, layerId, "fill-extrusion-pattern", fillExtrusionPattern, null, _added)',
            '_setPaintProperty(map, layerId, "fill-extrusion-opacity", fillExtrusionOpacity, null, _added)',
            '_setPaintProperty(map, layerId, "fill-extrusion-color", fillExtrusionColor, null, _added)',
            '_setPaintProperty(map, layerId, "fill-extrusion-translate", fillExtrusionTranslate, null, _added)',
            '_setPaintProperty(map, layerId, "fill-extrusion-height", fillExtrusionHeight, null, _added)',
            '_setPaintProperty(map, layerId, "fill-extrusion-base", fillExtrusionBase, null, _added)',

            '_setPaintProperty(map, layerId, "text-color", textColor, null, _added)',

            '_setLayoutProperty(map, layerId, "text-field", textField, null, _added)',
            '_setLayoutProperty(map, layerId, "text-font", textFont, null, _added)',
            '_setLayoutProperty(map, layerId, "text-size", textSize, null, _added)',
            '_setLayoutProperty(map, layerId, "text-line-height", textLineHeight, null, _added)',
            '_setLayoutProperty(map, layerId, "text-max-width", textMaxWidth, null, _added)',
            '_setLayoutProperty(map, layerId, "text-justify", textJustify, null, _added)',
            '_setLayoutProperty(map, layerId, "text-anchor", textAnchor, null, _added)',
            '_setLayoutProperty(map, layerId, "text-offset", textOffset, null, _added)',

            '_setLayoutProperty(map, layerId, "visibility", _visibility, null, _added)',
            '_setLayoutProperty(map, layerId, "line-cap", lineCap, null, _added)',
            '_setLayoutProperty(map, layerId, "line-join", lineJoin, null, _added)',
            '_setLayoutProperty(map, layerId, "line-miter-limit", lineMiterLimit, null, _added)',
            '_setLayoutProperty(map, layerId, "line-round-limit", lineRoundLimit, null, _added)',

            '_clearListeners(map, _clearEvents)',
            '_forwardEvents(map, _watchEvents, _added)'
        ],

        _not: function(val) {
            return !val;
        },

        _if: function(predicate, valtrue, valfalse) {
            return predicate ? valtrue : valfalse;
        },

        _setFilter: function(map, layerId, filter) {
            if (!map || !layerId || !this._added) return;
            return map.setFilter(layerId, filter);
        },

        _sourceDataChanged(v) {
            if (this.map) {
                var src = this.map.getSource(this.layerId);
                var l = this.map.getLayer(this.layerId);
                src && src.setData(v.data);
            }
        },

        _eventsToWatchChanged: function(newstr, oldstr) {
            if (oldstr) {
                this._clearEvents = oldstr.trim().split(' ');
            }

            if (newstr) {
                this._watchEvents = newstr.trim().split(' ');
            }
        },

        _clearListeners: function(map, _clearEvents) {
            if (!_clearEvents || !map) return;
            for (var i = 0, len = _clearEvents.length; i < len; ++i) {
                this._clearListener(_clearEvents[i].trim());
            }
        },

        _clearListener: function(name) {
            if (this._listeners[name]) {
                this.map.off(name, this.layerId, this._listeners[name]);
                this._listeners[name] = null;
            }
        },

        _forwardEvents: function(map, _watchEvents, _attached) {
            if (!_watchEvents || !map || !_attached) return;
            this._listeners = this._listeners || Object.create(null);
            for (var i = 0, len = _watchEvents.length; i < len; ++i) {
                this._forwardEvent(_watchEvents[i].trim());
            }
        },

        _forwardEvent: function(name, fn) {
            if (fn) {
                this._listeners[name] = function(event) {
                    fn(event);
                    this.dispatchEvent(
                        new CustomEvent('mapbox-layer-' + name, { detail: event })
                    );
                }.bind(this);
            } else {
                this._listeners[name] = function(event) {
                    this.dispatchEvent(
                        new CustomEvent('mapbox-layer-' + name, { detail: event })
                    );
                }.bind(this);
            }

            this.map.on(name, this.layerId, this._listeners[name]);
        },

        _layerIdChanged: function(curr, old) {
            if (!this.map) return;
            if (this.map.getLayer(old)) {
                this.map.removeLayer(old);
                this._added = false;
            }
        },

        _generateLayerProp: function(layerId, renderingType, minZoom, maxZoom) {
            if (!layerId || !renderingType) return;

            this._layer = {
                id: layerId,
                type: renderingType,
                minzoom: minZoom,
                maxzoom: maxZoom
            };
        },

        _setPaintProperty: function(map, layerId, field, value, prefix) {
            if (!this._added || !this.map || !value || !this.map.getLayer(layerId)) return;
            var _field = typeof prefix == 'string' ? prefix + '-' + field : field;
            this.map.setPaintProperty(layerId, _field, value);
        },

        _setLayoutProperty: function(map, layerId, field, value, prefix) {
            if (!this._added || !this.map || !value || !this.map.getLayer(layerId)) return;
            var _field = typeof prefix == 'string' ? prefix + '-' + field : field;
            this.map.setLayoutProperty(layerId, _field, value);
        },

        _updateLayerProp: function(key, value, _layer) {
            if (!_layer) return;
            if (value) {
                _layer[key] = value;
                this.notifyPath(`_layer.${key}`);
            } else if (_layer[key]) {
                delete _layer[key];
            }
        },

        _updateLayerPropField: function(key, field, value, _layer, renderingType) {
            if (!_layer) return;
            _layer[key] = _layer[key] || {};
            var _field = renderingType + '-' + field ? renderingType : field;
            if (value) {
                _layer[key][_field] = value;
            } else if (_layer[key][_field]) {
                delete _layer[key][_field];
            }
        }
    };
})((window.MapboxGLPolymer = window.MapboxGLPolymer || {}));