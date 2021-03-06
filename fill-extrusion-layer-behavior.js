import "@polymer/polymer/polymer-element.js";
import "./layer-behaviour.js";

(function(MapboxGLPolymer) {
    /*
     * @polymerBehavior
     */
    MapboxGLPolymer.FillExtrusionLayerBehaviorImplementation = {
        properties: {
            /*
             * Rendering type of this layer.
             * (fill, line, symbol, circle, fill-extrusion, raster, background)
             */
            renderingType: {
                type: String,
                value: 'fill-extrusion'
            },
            /*
             * The opacity of the entire fill extrusion layer. This is rendered on
             * a per-layer, not per-feature, basis, and data-driven styling is not
             * available.
             */
            fillExtrusionOpacity: {
                type: Number,
                value: 1
            },
            /*
             * The base color of the extruded fill. The extrusion's surfaces will be
             * shaded differently based on this color in combination with the root
             * light settings. If this color is specified as rgba with an alpha
             * component, the alpha component will be ignored; use
             * fill-extrusion-opacity to set layer opacity.
             */
            fillExtrusionColor: {
                type: String,
                value: '#000000'
            },
            /*
             * The geometry's offset. Values are [x, y] where negatives indicate
             * left and up (on the flat plane), respectively.
             */
            fillExtrusionTranslate: {
                type: Array,
                value: function() {
                    return [0, 0];
                }
            },
            /*
             * Controls the translation reference point (map or viewport).
             */
            fillExtrusionTranslateAnchor: {
                type: String
            },
            /*
             * Name of image in sprite to use for drawing images on extruded fills.
             * For seamless patterns, image width and height must be a factor of
             * two (2, 4, 8, ..., 512).
             */
            fillExtrusionPattern: {
                type: String
            },
            /*
             * The height (in meters) with which to extrude this layer.
             */
            fillExtrusionHeight: {
                type: Number,
                value: 0
            },
            /*
             * The height with which to extrude the base of this layer.
             * Must be less than or equal to fill-extrusion-height
             */
            fillExtrusionBase: {
                type: Number,
                value: 0
            },
            _paint: Object
        },

        observers: [
            '_generatePaintProp(fillExtrusionOpacity, fillExtrusionColor, fillExtrusionTranslate, fillExtrusionHeight, fillExtrusionBase)',
            '_updatePaintProp("fill-extrusion-translate-anchor", fillExtrusionTranslateAnchor, _paint)',
            '_updatePaintProp("fill-extrusion-pattern", fillExtrusionPattern, _paint)'
        ],

        _generatePaintProp: function(fillExtrusionOpacity, fillExtrusionColor, fillExtrusionTranslate, fillExtrusionHeight, fillExtrusionBase) {
            var _paint = Object.create(null);
            this._updatePaintProp('fill-extrusion-opacity', fillExtrusionOpacity, _paint);
            this._updatePaintProp('fill-extrusion-color', fillExtrusionColor, _paint);
            this._updatePaintProp('fill-extrusion-translate', fillExtrusionTranslate, _paint);
            this._updatePaintProp('fill-extrusion-height', fillExtrusionHeight, _paint);
            this._updatePaintProp('fill-extrusion-base', fillExtrusionBase, _paint);
            this._paint = _paint;
        },

        _updatePaintProp: function(key, value, _paint) {
            if (!_paint || !value) return;
            if (_paint[key] === value) return;
            _paint[key] = value;
            // layer already added
            if (this._added) {
                this.map.setPaintProperty(this.layerId, key, value);
            } else {
                this.notifyPath('_paint');
            }
        }
    };

    /*
     * @polymerBehavior
     */
    MapboxGLPolymer.FillExtrusionLayerBehavior = [MapboxGLPolymer.LayerBehavior, MapboxGLPolymer.FillExtrusionLayerBehaviorImplementation]

})(window.MapboxGLPolymer = window.MapboxGLPolymer || {});