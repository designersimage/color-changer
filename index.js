/**
 * ----------------------------------------------------------------------
 * color-changer
 * ----------------------------------------------------------------------
 * 
 * A color conversion tool to convert between color types for web css and 
 * javascript. The available color conversion types are:
 *  - hex
 *  - rgb / rgba
 *  - hsl / hsla
 *  - hsv / hsva
 *  - HTML Name
 * 
 * @package color-changer
 * @author Jonathan Wheeler <jonathan@desginersimage.io>
 */

function Color(color)
{
    if (!(this instanceof Color)) { return new Color(color); }
    if (typeof color === "object") {
        if (color instanceof Color) return color;
        this.getColorObject(color);
    } else if (typeof color === 'string') {
        this.getColorString(color);
    } else {
        this.emptyObj();
        return this;
    }
}

Color.prototype = {
    getColorString: function(color) {
        // Get the base type
        let { type } = getBaseValues(color);

        switch (type) {
            case 'hex':
                this.setHEX(color);
                return this;

            case 'rgb':
            case 'rgba':
                this.setRGB(color);
                return this;

            case 'hsl':
            case 'hsla':
                this.setHSL(color);
                return this;

            case 'hsv':
            case 'hsva':
                this.setHSV(color);
                return this;

            case 'name':
                this.setNAME(color);
                return this;

            default:
                this.emptyObj();
                return this;
        }
    },

    getColorObject: function(color) {
        if (Array.isArray(color)) {
            this.emptyObj();
            return this;
        }

        let testHex = ['value', 'a'],
            testRgb = ['r','g','b','a'],
            testHsl = ['h','s','l','a'],
            testHsv = ['h','s','v','a'],
            testName = ['name', 'a'];
        
        let keys = Object.keys(color);

        switch(true){
            // Match HEX object
            case testHex.contains(keys):
                if (keys.length < 2) {
                    this.emptyObj();
                    return this;
                }
                this.setHEX(color);
                return this;

            // Match RGB object
            case testRgb.contains(keys):
                if (keys.length < 3) {
                    this.emptyObj();
                    return this;
                }
                this.setRGB(color);
                return this;
            
            // Match HSL object
            case testHsl.contains(keys):
                if (keys.length < 3) {
                    this.emptyObj();
                    return this;
                }
                this.setHSL(color);
                return this;

            // Match HSV object
            case testHsv.contains(keys):
               this.setHSV(color);
                return this;

            // Match NAME object
            case testName.contains(keys):
                if (keys.length < 2) {
                    this.emptyObj();
                    return this;
                }
                this.setNAME(color);
                return this;

            // No match
            default:
                this.emptyObj();
                return this;
        }
    },

    emptyObj: function() {
        this.hex = undefined;
        this.rgb = undefined;
        this.hsl = undefined;
        this.hsv = undefined;
        this.elements = {
            hex: undefined,
            red : undefined,
            green : undefined,
            blue : undefined,
            hue : undefined,
            sat : undefined,
            light : undefined,
            value: undefined,
            opacity : undefined,
            name: undefined,
            valid : false
        };
        return this;
    },

    setObj: function(alpha = undefined, name = undefined) {
        if (this.rgb) this.rgb.setAlpha(alpha);
        if (this.rgb && !this.hex) {
            this.hex = new hex(this.rgb.toHex());
            this.hex.setAlpha(alpha);
        }
        if (this.rgb && !this.hsl) {
            this.hsl = new hsl(this.rgb.toHsl());
            this.hsl.setAlpha(alpha);
        }
        if (this.rgb && !this.hsv) {
            this.hsv = new hsv(this.rgb.toHsv());
            this.hsv.setAlpha(alpha);
        }
        
        if (!name) {
            name = getColorName(this.hex.value);
        }
        
        this.elements = {
            hex: this.hex.value,
            red : this.rgb.r,
            green : this.rgb.g,
            blue : this.rgb.b,
            hue : this.hsl.h,
            sat : this.hsl.s,
            light : this.hsl.l,
            value: this.hsv.v,
            opacity : alpha,
            name: name,
            valid : true
        };

        return this;
    },

    alpha: function(value) {
        let alpha = percentToDecimal(value);

        if (this.rgb) this.rgb.setAlpha(alpha);
        if (this.hex) this.hex.setAlpha(alpha);
        if (this.hsl) this.hsl.setAlpha(alpha);
        if (this.hsv) this.hsv.setAlpha(alpha);
        if (this.hwb) this.hwb.setAlpha(alpha);
        if (this.cmyk) this.cmyk.setAlpha(alpha)
        if (this.ncol) this.ncol.setAlpha(alpha);

        this.elements.opacity = alpha;
        
        return this;
    },

    isLight: function() {
        return this.brightness() > 50
    },

    isDark: function() {
        return this.brightness() <= 50
    },

    contrast: function(color) {
        if (!(color instanceof Color)) { 
            color = new Color(color); 
        }
        try {
            let l1, l2, l3;
            l1 = this.luminance();
            l2 = color.luminance();
            
            //Arrange so $l1 is lightest
            if (l1 < l2) {
                l3 = l1;
                l1 = l2;
                l2 = l3;
            }
            return (l1 + 0.05) / (l2 + 0.05);
        } catch (e) {
            return 0;
        }
    },

    brightness: function() {
        let l = this.luminance();
        if ( l <= (216/24389)) {        // The CIE standard states 0.008856 but 216/24389 is the intent for 0.008856451679036
            return l * (24389/27);      // The CIE standard states 903.3, but 24389/27 is the intent, making 903.296296296296296
        } else {
            return Math.pow(l,(1/3)) * 116 - 16;
        }
    },

    luminance: function() {
        let r = Number(this.rgb.r/255), g = Number(this.rgb.g/255), b = Number(this.rgb.b/255), rLin, gLin, bLin;
        rLin = toLinear(r);
        gLin = toLinear(g);
        bLin = toLinear(b);
        
        return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
    },

    fade: function(value) {
        let percent = percentToDecimal(value),
            alpha = this.elements.opacity;

        if (alpha) this.alpha(alpha * percent);

        return this;
    },

    opaquer: function(value) {
        let percent = percentToDecimal(value),
            alpha = this.elements.opacity;

        if (alpha) this.alpha(alpha / percent);

        return this;
    },

    desaturate: function(value) {
        let percent = percentToDecimal(value), s;
        s = this.elements.sat *= percent;

        this.emptyObj();
        this.hsl = new hsl({h: this.elements.hue, s, l: this.elements.light});
        this.rgb = new rgb(this.hsl.toRgb());
        this.setObj(this.elements.opacity);

        return this;
    },

    saturate: function(value) {
        let percent = percentToDecimal(value), s;
        s = this.elements.sat /= percent
        if (s > 1) s = 1;

        this.emptyObj();
        this.hsl = new hsl({h: this.elements.hue, s, l: this.elements.light});
        this.rgb = new rgb(this.hsl.toRgb());
        this.setObj(this.elements.opacity);

        return this;
    },

    darken: function(value) {
        let percent = percentToDecimal(value), l;
        l = this.elements.light *= percent;

        this.emptyObj();
        this.hsl = new hsl({h: this.elements.hue, s: this.elements.sat, l});
        this.rgb = new rgb(this.hsl.toRgb());
        this.setObj(this.elements.opacity);

        return this;
    },

    lighten: function(value) {
        let percent = percentToDecimal(value), l;
        l = this.elements.light /= percent
        if (l > 1) l = 1;

        this.emptyObj();
        this.hsl = new hsl({h: this.elements.hue, s: this.elements.sat, l});
        this.rgb = new rgb(this.hsl.toRgb());
        this.setObj(this.elements.opacity);

        return this;
    },

    greyscale: function() {
        let h = this.elements.hue, l = this.elements.light;

        this.emptyObj();
        this.hsl = new hsl({h, s: 0,  l});
        this.rgb = new rgb(this.hsl.toRgb());
        this.setObj(this.elements.opacity);

        return this;
    },

    negate: function() {
        let r = 255 - this.elements.red,
            g = 255 - this.elements.green,
            b = 255 - this.elements.blue;

        this.emptyObj();
        this.rgb = new rgb({r, g, b});
        this.setObj(this.elements.opacity);

        return this;
    },

    mix: function(color, type = 'add', value = 0.5) {
        if (!(color instanceof Color)) { 
            color = new Color(color); 
        }

        if (type == 'sub') {
            let color1 = this.rgb.toRyb(), color2 = color.rgb.toRyb(),
            percent, rybTemp = {};

            percent = percentToDecimal(value);

            rybTemp.r = Math.round(((color2.r - color1.r) * percent) + color1.r);
            rybTemp.y = Math.round(((color2.y - color1.y) * percent) + color1.y);
            rybTemp.b = Math.round(((color2.b - color1.b) * percent) + color1.b);
            rybTemp.alpha = (
                color1.alpha && color2.alpha 
                    ? Math.round((((color2.alpha - color1.alpha) * percent) + color1.alpha) * 10000) / 10000
                    : color1.alpha ?? color2.alpha
            )
            
            this.emptyObj();
            let tempRyb = new ryb(rybTemp);
            this.rgb = new rgb(tempRyb.toRgb())
            this.setObj(this.rgb.alpha);
        } else {
            let color1 = this.rgb, color2 = color.rgb,
            percent, rgbTemp = {};

            percent = percentToDecimal(value);

            rgbTemp.r = Math.round(((color2.r - color1.r) * percent) + color1.r);
            rgbTemp.g = Math.round(((color2.g - color1.g) * percent) + color1.g);
            rgbTemp.b = Math.round(((color2.b - color1.b) * percent) + color1.b);
            rgbTemp.alpha = (
                color1.alpha && color2.alpha 
                    ? Math.round((((color2.alpha - color1.alpha) * percent) + color1.alpha) * 10000) / 10000
                    : color1.alpha ?? color2.alpha
            )

            this.emptyObj();
            this.rgb = new rgb(rgbTemp);
            this.setObj(this.rgb.alpha);
        }

        return this;
    },

    rotate: function(degree) {
        degree = convertToDegree(degree);

        let {h, s, l, alpha} = this.hsl;

        h += degree;

        if (Math.abs(h) > 360) h %= 360
        if (h < 0) h += 360

        this.emptyObj();
        this.hsl = new hsl({h, s, l, alpha});
        this.rgb = new rgb(this.hsl.toRgb());
        this.setObj(this.rgb.alpha);

        return this;
    },

    round: function() {
        this.rgb = {
            r: Number(this.elements.red.toFixed(0)),
            g: Number(this.elements.green.toFixed(0)),
            b: Number(this.elements.blue.toFixed(0)),
            alpha: this.elements.opacity ? Number(this.elements.opacity.toFixed(2)) : undefined
        }
        this.hsl = {
            h: Number(this.elements.hue.toFixed(0)),
            s: Number(this.elements.sat.toFixed(2)),
            l: Number(this.elements.light.toFixed(2)),
            alpha: this.elements.opacity ? Number(this.elements.opacity.toFixed(2)) : undefined
        }
        this.hsv = {
            h: Number(this.elements.hue.toFixed(0)),
            s: Number(this.elements.sat.toFixed(2)),
            v: Number(this.elements.value.toFixed(2)),
            alpha: this.elements.opacity ? Number(this.elements.opacity.toFixed(2)) : undefined
        }

        this.elements = {
            hex: this.hex.value,
            red : Number(this.elements.red.toFixed(0)),
            green : Number(this.elements.green.toFixed(0)),
            blue : Number(this.elements.blue.toFixed(0)),
            hue : Number(this.elements.hue.toFixed(0)),
            sat : Number(this.elements.sat.toFixed(2)),
            light : Number(this.elements.light.toFixed(2)),
            value: Number(this.elements.value.toFixed(2)),
            opacity : this.elements.opacity ? Number(this.elements.opacity.toFixed(2)) : undefined,
            name: this.elements.name ?? undefined,
            valid : true
        };

        return this;
    },

    setHEX: function(color) {
        // Set the HEX value from a string
        if (typeof color === 'string') {
            if (!color.match(/^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i)) {
                this.emptyObj();
                return this;
            }
    
            let hexString = color;
            if (color.indexOf('#') >= 0) {
                hexString = color.split('#')[1]
            }
            
            if (hexString.length === 3) {
                let byte1, byte2, byte3;
                byte1 = `${hexString[0]}${hexString[0]}`;
                byte2 = `${hexString[1]}${hexString[1]}`;
                byte3 = `${hexString[2]}${hexString[2]}`;
                hexString = `${byte1}${byte2}${byte3}`;
            } else if (hexString.length === 4) {
                let byte1, byte2, byte3, byte4;
                byte1 = `${hexString[0]}${hexString[0]}`;
                byte2 = `${hexString[1]}${hexString[1]}`;
                byte3 = `${hexString[2]}${hexString[2]}`;
                byte4 = `${hexString[3]}${hexString[3]}`;
                hexString = `${byte1}${byte2}${byte3}${byte4}`;
            }
            
            if (!isHex(hexString)) {
                this.emptyObj();
                return this;
            }
            
            this.hex = new hex(hexString);
            this.rgb = new rgb(this.hex.toRgb());
            this.setObj(this.rgb.alpha);
    
            return this;
        }

        // Set the HEX value from an array
        if (Array.isArray(color)) {
            let alpha, opacity;
            if (color.length < 1 || color.length > 2) {
                this.emptyObj();
                return this;
            }

            if (color.length === 2 || color[0].length === 4 || color[0].length === 8) {
                opacity = true;
            }

            if (!color[0].match(/^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i)) {
                this.emptyObj();
                return this;
            }
    
            let hexString = color[0];
            if (color.indexOf('#') >= 0) {
                hexString = color.split('#')[1]
            }
            
            if (hexString.length === 3) {
                let byte1, byte2, byte3;
                byte1 = `${hexString[0]}${hexString[0]}`;
                byte2 = `${hexString[1]}${hexString[1]}`;
                byte3 = `${hexString[2]}${hexString[2]}`;
                hexString = `${byte1}${byte2}${byte3}`;
            } else if (hexString.length === 4) {
                let byte1, byte2, byte3, byte4;
                byte1 = `${hexString[0]}${hexString[0]}`;
                byte2 = `${hexString[1]}${hexString[1]}`;
                byte3 = `${hexString[2]}${hexString[2]}`;
                byte4 = `${hexString[3]}${hexString[3]}`;
                hexString = `${byte1}${byte2}${byte3}${byte4}`;
            }
            
            if (!isHex(hexString)) {
                this.emptyObj();
                return this;
            }

            if (opacity === true) {
                if (hexString.length !== 8) {
                    alpha = percentToDecimal(color[1]);
                }
            }

            this.hex = new hex(hexString, alpha);
            this.rgb = new rgb(this.hex.toRgb());
            this.setObj(this.rgb.alpha);
    
            return this;
        }
        
        let testHex = ['value','alpha'];
        
        let keys = Object.keys(color);
        if (keys.length < 1) {
            this.emptyObj();
            return this;
        }

        if (testHex.contains(keys)){
            let arr = [], alpha, opacity, i;
            keys.forEach(key => {
                arr.push(color[key])
            })

            if (arr.length === 2 || arr[0].length === 4 || arr[0].length === 8) {
                opacity = true;
            }

            if (!arr[0].match(/^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i)) {
                this.emptyObj();
                return this;
            }
    
            let hexString = arr[0];
            if (arr.indexOf('#') >= 0) {
                hexString = arr.split('#')[1]
            }
            
            if (hexString.length === 3) {
                let byte1, byte2, byte3;
                byte1 = `${hexString[0]}${hexString[0]}`;
                byte2 = `${hexString[1]}${hexString[1]}`;
                byte3 = `${hexString[2]}${hexString[2]}`;
                hexString = `${byte1}${byte2}${byte3}`;
            } else if (hexString.length === 4) {
                let byte1, byte2, byte3, byte4;
                byte1 = `${hexString[0]}${hexString[0]}`;
                byte2 = `${hexString[1]}${hexString[1]}`;
                byte3 = `${hexString[2]}${hexString[2]}`;
                byte4 = `${hexString[3]}${hexString[3]}`;
                hexString = `${byte1}${byte2}${byte3}${byte4}`;
            }
            
            if (!isHex(hexString)) {
                this.emptyObj();
                return this;
            }

            if (opacity === true) {
                if (hexString.length !== 8) {
                    alpha = percentToDecimal(arr[1]);
                }
            }

            this.hex = new hex(hexString, alpha);
            this.rgb = new rgb(this.hex.toRgb());
            this.setObj(this.rgb.alpha);
        } else {
            this.emptyObj();
        }
        return this;
    },

    setRGB: function(color) {
        if (typeof color === 'string') {
            let i, alpha;

            let {arr, arrLength, opacity} = getBaseValues(color);

            while (arr.length < arrLength) {arr.push("1"); };

            for (i = 0; i < arrLength; i++) {
                if (i < 3) {
                    arr[i] = percentToRGBValue(arr[i]);
                    arr[i] = parseInt(arr[i]);
                }
                if (i === 3) {
                    arr[i] = percentToDecimal(arr[i]);
                }
            }
            
            if (opacity == true) {
                alpha = percentToDecimal(arr[3]);
                this.rgb = new rgb({r: arr[0], g: arr[1], b: arr[2], alpha});
            } else {
                this.rgb = new rgb({r : arr[0], g : arr[1], b : arr[2]});
            }

            this.setObj(alpha);
            return this;
        }

        if (Array.isArray(color)) {
            let i, alpha, opacity;

            if (color.length < 3 || color.length > 4) {
                this.emptyObj();
                return this;
            }

            if (color.length === 4) opacity = true;
            
            for (i = 0; i < color.length; i++) {
                if (i < 3) {
                    color[i] = percentToRGBValue(color[i]);
                    color[i] = parseInt(color[i]);
                }
                if (i === 3) {
                    color[i] = percentToDecimal(color[i]);
                }
            }
            
            if (opacity == true) {
                alpha = percentToDecimal(color[3]);
                this.rgb = new rgb({r: color[0], g: color[1], b: color[2], alpha});
            } else {
                this.rgb = new rgb({r : color[0], g : color[1], b : color[2]});
            }
            
            this.setObj(alpha);
            return this;
        }

        let testRgb = ['r','g','b','a'];
        let keys = Object.keys(color);
        if (keys.length < 3 || keys.length > 4) {
            this.emptyObj();
            return this;
        }

        if (testRgb.contains(keys)){
            let arr = [], alpha, opacity, i;
            keys.forEach(key => {
                arr.push(color[key])
            })

            if (arr.length === 4) {
                opacity = true;
            }

            for (i = 0; i < arr.length; i++) {
                if (i < 3) {
                    arr[i] = percentToRGBValue(arr[i]);
                    arr[i] = parseInt(arr[i]);
                }
                if (i === 3) {
                    arr[i] = percentToDecimal(arr[i]);
                }
            }
            
            if (opacity == true) {
                alpha = percentToDecimal(arr[3]);
                this.rgb = new rgb({r: arr[0], g: arr[1], b: arr[2], alpha});
            } else {
                this.rgb = new rgb({r : arr[0], g : arr[1], b : arr[2]});
            }
            this.setObj(alpha);

        } else {
            this.emptyObj();
        }
        return this;
    },

    setHSL: function(color) {
        // Set the HSL value from a string
        if (typeof color === 'string') {
            let i, alpha;

            let {arr, arrLength, opacity} = getBaseValues(color);
            
            // Strip label and convert to degrees (if necessary)
            arr[0] = convertToDegree(arr[0]);
            while (arr.length < arrLength) {arr.push("1"); }
        
            // Convert percentages to decimal
            for (i = 1; i < arrLength; i++) {
                arr[i] = percentToDecimal(arr[i])
                if (arr[i] === false) {
                    this.emptyObj();
                    return this;
                }
            }

            if (opacity == true) {
                alpha = percentToDecimal(arr[3]);
                this.hsl = new hsl({h: Number(arr[0]), s: Number(arr[1]), l: Number(arr[2]), alpha})
                this.rgb = new rgb(this.hsl.toRgb());
            } else {
                this.hsl = new hsl({h: Number(arr[0]), s: Number(arr[1]), l: Number(arr[2])})
                this.rgb = new rgb(this.hsl.toRgb());
            }

            this.setObj(alpha);
            return this;
        }
        
        // Set the HSL value from an array
        if (Array.isArray(color)) {
            let alpha, opacity, i;
            if (color.length < 3 || color.length > 4) {
                this.emptyObj();
                return this;
            }

            if (color.length === 4) {
                opacity = true;
            }

            // Strip label and convert to degrees (if necessary)
            color[0] = convertToDegree(color[0]);
        
            // Convert percentages to decimal
            for (i = 1; i < color.length; i++) {
                color[i] = percentToDecimal(color[i])
                if (!color[i]) {
                    this.emptyObj();
                    return this;
                }
            }

            if (opacity == true) {
                alpha = percentToDecimal(color[3]);
                this.hsl = new hsl({h: Number(color[0]), s: Number(color[1]), l: Number(color[2]), alpha})
                this.rgb = new rgb(this.hsl.toRgb());
            } else {
                this.hsl = new hsl({h: Number(color[0]), s: Number(color[1]), l: Number(color[2])})
                this.rgb = new rgb(this.hsl.toRgb());
            }

            this.setObj(alpha);
            return this;
        }

        // Set the HSL value from an object
        let testHsl = ['h','s','l','a'];
        
        let keys = Object.keys(color);
        if (keys.length < 3) {
            this.emptyObj();
            return this;
        }

        if (testHsl.contains(keys)){
            let arr = [], alpha, opacity, i;
            keys.forEach(key => {
                arr.push(color[key])
            })

            if (arr.length === 4) {
                opacity = true;
            }

            // Strip label and convert to degrees (if necessary)
            arr[0] = convertToDegree(arr[0]);
        
            // Convert percentages to decimal
            for (i = 1; i < arr.length; i++) {
                arr[i] = percentToDecimal(arr[i])
                if (arr[i] === false) {
                    this.emptyObj();
                    return this;
                }
            }

            if (opacity == true) {
                alpha = percentToDecimal(arr[3]);
                this.hsl = new hsl({h: Number(arr[0]), s: Number(arr[1]), l: Number(arr[2]), alpha})
                this.rgb = new rgb(this.hsl.toRgb());
            } else {
                this.hsl = new hsl({h: Number(arr[0]), s: Number(arr[1]), l: Number(arr[2])})
                this.rgb = new rgb(this.hsl.toRgb());
            }

            this.setObj(alpha);
        } else {
            this.emptyObj();
        }
        return this;
    },

    setHSV: function(color) {
        // Set the HSV value from a string
        if (typeof color === 'string') {
            let i, alpha;

            let {arr, arrLength, opacity} = getBaseValues(color);
            
            // Strip label and convert to degrees (if necessary)
            arr[0] = convertToDegree(arr[0]);
            while (arr.length < arrLength) {arr.push("1"); }
        
            // Convert percentages to decimal
            for (i = 1; i < arrLength; i++) {
                arr[i] = percentToDecimal(arr[i])
                if (arr[i] === false) {
                    this.emptyObj();
                    return this;
                }
            }

            if (opacity == true) {
                alpha = percentToDecimal(arr[3]);
                this.hsv = new hsv({h: Number(arr[0]), s: Number(arr[1]), v: Number(arr[2]), alpha})
                this.rgb = new rgb(this.hsv.toRgb());
            } else {
                this.hsv = new hsv({h: Number(arr[0]), s: Number(arr[1]), v: Number(arr[2])})
                this.rgb = new rgb(this.hsv.toRgb());
            }

            this.setObj(alpha);
            return this;
        }
        
        // Set the HSL value from an array
        if (Array.isArray(color)) {
            let alpha, opacity, i;
            if (color.length < 3 || color.length > 4) {
                this.emptyObj();
                return this;
            }

            if (color.length === 4) {
                opacity = true;
            }

            // Strip label and convert to degrees (if necessary)
            color[0] = convertToDegree(color[0]);
        
            // Convert percentages to decimal
            for (i = 1; i < color.length; i++) {
                color[i] = percentToDecimal(color[i])
                if (!color[i]) {
                    this.emptyObj();
                    return this;
                }
            }

            if (opacity == true) {
                alpha = percentToDecimal(color[3]);
                this.hsv = new hsv({h: Number(color[0]), s: Number(color[1]), v: Number(color[2]), alpha})
                this.rgb = new rgb(this.hsv.toRgb());
            } else {
                this.hsv = new hsv({h: Number(color[0]), s: Number(color[1]), v: Number(color[2])})
                this.rgb = new rgb(this.hsv.toRgb());
            }

            this.setObj(alpha);
            return this;
        }

        // Set the HSL value from an object
        let testHsv = ['h','s','v','a'];
        
        let keys = Object.keys(color);
        if (keys.length < 3) {
            this.emptyObj();
            return this;
        }

        if (testHsv.contains(keys)){
            let arr = [], alpha, opacity, i;
            keys.forEach(key => {
                arr.push(color[key])
            })

            if (arr.length === 4) {
                opacity = true;
            }

            // Strip label and convert to degrees (if necessary)
            arr[0] = convertToDegree(arr[0]);
        
            // Convert percentages to decimal
            for (i = 1; i < arr.length; i++) {
                arr[i] = percentToDecimal(arr[i])
                if (arr[i] === false) {
                    this.emptyObj();
                    return this;
                }
            }

            if (opacity == true) {
                alpha = percentToDecimal(arr[3]);
                this.hsv = new hsv({h: Number(arr[0]), s: Number(arr[1]), v: Number(arr[2]), alpha})
                this.rgb = new rgb(this.hsv.toRgb());
            } else {
                this.hsv = new hsv({h: Number(arr[0]), s: Number(arr[1]), v: Number(arr[2])})
                this.rgb = new rgb(this.hsv.toRgb());
            }

            this.setObj(alpha);
        } else {
            this.emptyObj();
        }
        return this;
    },

    setNAME: function(color) {
        // Set the NAME value from a string
        if (typeof color === 'string') {
            let i, alpha, colorName, colorhexs, result, match = false, colornames = getColorArr('names');

            // Search for color name
            for (i = 0; i < colornames.length; i++) {
                if (color.toLowerCase() === colornames[i].toLowerCase()) {
                    colorName = colornames[i];
                    colorhexs = getColorArr('hexs')[i];
                    result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorhexs)
                    match = true;
                    this.rgb = new rgb({
                        r : parseInt(result[1], 16),
                        g : parseInt(result[2], 16),
                        b : parseInt(result[3], 16)
                    });
                    break;
                }
            }

            if (match) {
                this.setObj(alpha, colorName);
                return this;
            } else {
                this.emptyObj();
                return this;
            }
        }
        
        // Set the NAME value from an array
        if (Array.isArray(color)) {
            let i, alpha, opacity, colorName, colorhexs, result, match = false, colornames = getColorArr('names');
            if (color.length < 1 || color.length > 2) {
                this.emptyObj();
                return this;
            }

            if (color.length === 2) {
                opacity = true;
            }

            // Search for color name
            for (i = 0; i < colornames.length; i++) {
                if (color[0].toLowerCase() === colornames[i].toLowerCase()) {
                    colorName = colornames[i];
                    colorhexs = getColorArr('hexs')[i];
                    result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorhexs)
                    match = true;
                    this.rgb = new rgb({
                        r : parseInt(result[1], 16),
                        g : parseInt(result[2], 16),
                        b : parseInt(result[3], 16)
                    });
                    break;
                }
            }

            // Convert percentages to decimal
            for (i = 1; i < color.length; i++) {
                color[i] = percentToDecimal(color[i])
                if (!color[i]) {
                    this.emptyObj();
                    return this;
                }
            }

            if (opacity === true) {
                alpha = percentToDecimal(color[1]);
            }

            if (match) {
                this.setObj(alpha, colorName);
                return this;
            } else {
                this.emptyObj();
                return this;
            }
        }

        let testName = ['name','a'];
        
        let keys = Object.keys(color);
        if (keys.length < 1) {
            this.emptyObj();
            return this;
        }

        if (testName.contains(keys)){
            let arr = [], alpha, opacity, i, colorName, colorhexs, result, match = false, colornames = getColorArr('names');
            keys.forEach(key => {
                arr.push(color[key])
            })

            if (arr.length === 2) {
                opacity = true;
            }

            // Search for color name
            for (i = 0; i < colornames.length; i++) {
                if (arr[0].toLowerCase() === colornames[i].toLowerCase()) {
                    colorName = colornames[i];
                    colorhexs = getColorArr('hexs')[i];
                    result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorhexs)
                    match = true;
                    this.rgb = new rgb({
                        r : parseInt(result[1], 16),
                        g : parseInt(result[2], 16),
                        b : parseInt(result[3], 16)
                    });
                    break;
                }
            }

            // Convert percentages to decimal
            for (i = 1; i < arr.length; i++) {
                arr[i] = percentToDecimal(arr[i])
                if (arr[i] === false) {
                    this.emptyObj();
                    return this;
                }
            }

            if (opacity === true) {
                alpha = percentToDecimal(arr[1]);
            }

            if (match) {
                this.setObj(alpha, colorName);
                return this;
            } else {
                this.emptyObj();
                return this;
            }
        } else {
            this.emptyObj();
        }
        return this;
    }
}

class ColorObject
{
    setAlpha(alpha = undefined) {
        this.alpha = alpha;

        return this;
    }

    hueConv(t1, t2, hue) {
        if (hue < 0) hue += 6;
        if (hue >= 6) hue -= 6;
        if (hue < 1) return (t2 - t1) * hue + t1;
        else if(hue < 3) return t2;
        else if(hue < 4) return (t2 - t1) * (4 - hue) + t1;
        else return t1;
    }

    round() {
        switch (this.constructor.name){
            case 'rgb':
                this.r = Number(this.r.toFixed(0));
                this.g = Number(this.g.toFixed(0));
                this.b = Number(this.b.toFixed(0));
                this.alpha = this.alpha ? Number(this.alpha.toFixed(2)) : undefined;
                break;
            case 'hsl':
                this.h = Number(this.h.toFixed(0));
                this.s = Number(this.s.toFixed(2));
                this.l = Number(this.l.toFixed(2));
                this.alpha = this.alpha ? Number(this.alpha.toFixed(2)) : undefined;
                break;
            case 'hsv':
                this.h = Number(this.h.toFixed(0));
                this.s = Number(this.s.toFixed(2));
                this.v = Number(this.v.toFixed(2));
                this.alpha = this.alpha ? Number(this.alpha.toFixed(2)) : undefined;
                break;
        }

        return this;
    }

    stringRound() {
        switch (this.constructor.name){
            case 'rgb':
                return {
                    r: Number(this.r.toFixed(0)),
                    g: Number(this.g.toFixed(0)),
                    b: Number(this.b.toFixed(0)),
                    alpha: this.alpha ? Number(this.alpha.toFixed(2)) : undefined
                }
            case 'hsl':
                return {
                    h: Number(this.h.toFixed(0)),
                    s: Number(this.s.toFixed(2)),
                    l: Number(this.l.toFixed(2)),
                    alpha: this.alpha ? Number(this.alpha.toFixed(2)) : undefined
                }
            case 'hsv':
                return {
                    h: Number(this.h.toFixed(0)),
                    s: Number(this.s.toFixed(2)),
                    v: Number(this.v.toFixed(2)),
                    alpha: this.alpha ? Number(this.alpha.toFixed(2)) : undefined
                }
        }
    }

    string() {
        switch (this.constructor.name){
            case 'hex':
                if (this.alpha) {
                    let alpha = Number((this.alpha * 255).toFixed(0)).toString(16);
                    return `#${this.value}${alpha}`;
                }
                return `#${this.value}`;
            case 'rgb':
                let rgb = this.stringRound();
                if (rgb.alpha) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.alpha})`;
                return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            case 'hsl':
                let hsl = this.stringRound();
                if (hsl.alpha) return `hsla(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%, ${hsl.alpha})`;
                return `hsl(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
            case 'hsv':
                let hsv = this.stringRound();
                if (hsv.alpha) return `hsva(${hsv.h}, ${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%, ${hsv.alpha})`;
                return `hsv(${hsv.h}, ${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%)`;
        }
    }
}

class hex extends ColorObject
{
    constructor(value, alpha = undefined) {
        super();
        let result, a;
        if (value.length === 6) {
            this.value = value;
            this.alpha = alpha;
        } else if (value.length === 8) {
            result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value)
            this.value = `${result[1]}${result[2]}${result[3]}`
            a = parseInt(result[4], 16)
            this.alpha = +(a / 255).toFixed(5);
        }
    }

    toRgb() {
        let result, alpha, arr = [];
        if (this.value.length === 6 && this.alpha === undefined) {
            result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.value);
            arr[0] = parseInt(result[1], 16);
            arr[1] = parseInt(result[2], 16);
            arr[2] = parseInt(result[3], 16);
            
            return {
                r : Number(arr[0].toFixed(5)),
                g : Number(arr[1].toFixed(5)),
                b : Number(arr[2].toFixed(5))
            };

        } else {
            result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.value);
            arr[0] = parseInt(result[1], 16);
            arr[1] = parseInt(result[2], 16);
            arr[2] = parseInt(result[3], 16);
            alpha = this.alpha;
            
            return {
                r: Number(arr[0].toFixed(5)),
                g: Number(arr[1].toFixed(5)),
                b: Number(arr[2].toFixed(5)),
                alpha
            };
        }
    }
}

class rgb extends ColorObject
{
    constructor({r, g, b, alpha = undefined}) {
        super();
        this.r = r;
        this.g = g;
        this.b = b;
        this.alpha = alpha;
    }

    toHue() {
        let min, max, i, maxcolor, h, rgb = [];
        rgb[0] = this.r / 255;
        rgb[1] = this.g / 255;
        rgb[2] = this.b / 255;
        min = rgb[0];
        max = rgb[0];
        maxcolor = 0;
        for (i = 0; i < rgb.length - 1; i++) {
          if (rgb[i + 1] <= min) {min = rgb[i + 1];}
          if (rgb[i + 1] >= max) {max = rgb[i + 1];maxcolor = i + 1;}
        }
        if (maxcolor == 0) {
          h = (rgb[1] - rgb[2]) / (max - min);
        }
        if (maxcolor == 1) {
          h = 2 + (rgb[2] - rgb[0]) / (max - min);
        }
        if (maxcolor == 2) {
          h = 4 + (rgb[0] - rgb[1]) / (max - min);
        }
        if (isNaN(h)) {h = 0;}
        h = h * 60;
        if (h < 0) {h = h + 360; }

        return {h, min, max, maxcolor};
    }

    toHex() {
        let byte1, byte2, byte3, byte4;
        byte1 = Math.round(this.r).toString(16);
        byte2 = Math.round(this.g).toString(16);
        byte3 = Math.round(this.b).toString(16);
        if (byte1.length < 2) byte1 = "0" + byte1;
        if (byte2.length < 2) byte2 = "0" + byte2;
        if (byte3.length < 2) byte3 = "0" + byte3;

        if(this.alpha) {
            byte4 = Math.round(this.alpha * 255).toString(16);
            return `${byte1}${byte2}${byte3}${byte4}`;
        }
        return `${byte1}${byte2}${byte3}`;
    }

    toRyb() {
        let r = this.r, g = this.g, b = this.b,
            w, y, mg, my, n;
        
        w = Math.min(r, g, b);
        r -= w;
        g -= w;
        b -= w;

        mg = Math.max(r, g, b);

        y = Math.min(r, g);
        r -= y;
        g -= y;

        if (b === g) {
            b /= 2;
            g /= 2;
        }

        y += g;
        b += g;

        my = Math.max(r, y, b);
        if (my) {
            n = mg / my;
            r *= n;
            y *= n;
            b *= n;
        }

        r += w;
        y += w;
        b += w;

        if (this.alpha) return {r:Number(r.toFixed(5)), y:Number(y.toFixed(5)), b:Number(b.toFixed(5)), alpha:this.alpha};
        return {r:Number(r.toFixed(5)), y:Number(y.toFixed(5)), b:Number(b.toFixed(5))};
    }

    toHsl() {
        let {h, min, max} = this.toHue(), s, l;
        l = (min + max) / 2;
        if (min == max) {
          s = 0;
        } else {
          if (l < 0.5) {
            s = (max - min) / (max + min);
          } else {
            s = (max - min) / (2 - max - min);
          }
        }
        s = s;
        if (this.alpha) return {h:Number(h.toFixed(5)), s:Number(s.toFixed(5)), l:Number(l.toFixed(5)), alpha: this.alpha};
        return {h:Number(h.toFixed(5)), s:Number(s.toFixed(5)), l:Number(l.toFixed(5))};
    }

    toHsv() {
        let r = this.r / 255.0,
            g = this.g / 255.0,
            b = this.b / 255.0;
 
        let cmax = Math.max(r, Math.max(g, b)),
            cmin = Math.min(r, Math.min(g, b)),
            diff = cmax - cmin,
            h = -1, s = -1;
 
        if (cmax == cmin) h = 0;
        else if (cmax == r) h = (60 * ((g - b) / diff) + 360) % 360;
        else if (cmax == g) h = (60 * ((b - r) / diff) + 120) % 360;
        else if (cmax == b) h = (60 * ((r - g) / diff) + 240) % 360;
 
        if (cmax == 0) s = 0;
        else s = (diff / cmax) * 100;

        let v = cmax * 100;

        s /= 100;
        v /= 100;
        
        if (this.alpha) return {h:Number(h.toFixed(5)), s:Number(s.toFixed(5)), v:Number(v.toFixed(5)), alpha: this.alpha};
        return {h:Number(h.toFixed(5)), s:Number(s.toFixed(5)), v:Number(v.toFixed(5))};
    }
}

class ryb extends ColorObject
{
    constructor({r, y, b, alpha = undefined}) {
        super();
        this.r = r;
        this.y = y;
        this.b = b;
        this.alpha = alpha;
    }

    toRgb() {
        let r = this.r, y = this.y, b = this.b;
        
        let whiteness = Math.min(r, y, b);
        r -= whiteness;
        y -= whiteness;
        b -= whiteness;

        let maxYellow = Math.max(r, y, b);

        let g = Math.min(y, b);
        y -= g;
        b -= g;

        if (b && g) {
            b *= 2.0;
            g *= 2.0;
        }

        r += y;
        g += y;

        let maxGreen = Math.max(r, g, b);
        if (maxGreen) {
            let n = maxYellow / maxGreen;
            r *= n;
            g *= n;
            b *= n;
        }

        r += whiteness;
        g += whiteness;
        b += whiteness;

        if (this.alpha) return {r:Number(r.toFixed(5)), g:Number(g.toFixed(5)), b:Number(b.toFixed(5)), alpha:this.alpha};
        return {r:Number(r.toFixed(5)), g:Number(g.toFixed(5)), b:Number(b.toFixed(5))};
    }
}

class hsl extends ColorObject
{
    constructor({h, s, l, alpha = undefined}) {
        super();
        this.h = h;
        this.s = s;
        this.l = l;
        this.alpha = alpha;
    }

    toRgb() {
        let t1, t2, r, g, b, hue;
        hue = this.h / 60;
        if ( this.l <= 0.5 ) {
          t2 = this.l * (this.s + 1);
        } else {
          t2 = this.l + this.s - (this.l * this.s);
        }
        t1 = this.l * 2 - t2;

        r = this.hueConv(t1, t2, hue + 2) * 255;
        g = this.hueConv(t1, t2, hue) * 255;
        b = this.hueConv(t1, t2, hue - 2) * 255;

        if (this.alpha) return {r:Number(r.toFixed(5)), g:Number(g.toFixed(5)), b:Number(b.toFixed(5)), alpha:this.alpha};
        return {r:Number(r.toFixed(5)), g:Number(g.toFixed(5)), b:Number(b.toFixed(5))};
    }
}

class hsv extends ColorObject
{
    constructor({h, s, v, alpha = undefined}) {
        super();
        this.h = h;
        this.s = s;
        this.v = v;
        this.alpha = alpha;
    }

    toRgb() {
        let r, g, b, i, f, p, q, t,
            h = this.h, s = this.s, v = this.v;
    
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        
        r*= 255;
        g*= 255;
        b*= 255;

        if (this.alpha) return {r:Number(r.toFixed(5)), g:Number(g.toFixed(5)), b:Number(b.toFixed(5)), alpha:this.alpha};
        return {r:Number(r.toFixed(5)), g:Number(g.toFixed(5)), b:Number(b.toFixed(5))};
    }
}

// Takes an array as argument to see if original array contains all values
Array.prototype.contains = function(values) {
    let match = false;
    for (let i = 0; i < values.length; i++) {
        let value = values[i]
        if (!this.includes(value)) {
            match = false
            break;
        }
        match = true;
    }
    return match;
}

// Converts value to degrees from string of degree, radians, or turns
function convertToDegree(value) {
    let degree;
    if (typeof value === 'string' && value.indexOf("deg") > -1) {
        degree = Number(value.substring(0,value.length - 3));
    } else if (typeof value === 'string' && value.indexOf("rad") > -1) {
        degree = Math.round(value.substring(0,value.length - 3) * (180 / Math.PI));
    } else if (typeof value === 'string' && value.indexOf("turn") > -1) {
        degree = Math.round(value.substring(0,value.length - 4) * 360);
    } else {
        degree = Number(value);
    }

    if (degree >= 360) {
        degree %= 360;
    }
    
    return degree;
}

// Converts a value to decimal from number or percentage string
function percentToDecimal(value) {
    let decimal;
    
    if (typeof value === 'string' && value.indexOf("%") > -1) {
        decimal = value.replace("%", "");
        decimal = Number(decimal);
        if (isNaN(decimal)) {
            return false;
        }
        decimal = decimal / 100;
    } else {
        decimal = Number(value);
    }
    if (Number(decimal) > 1) {decimal = 1;}
    if (Number(decimal) < 0) {decimal = 0;}
    
    return decimal;
}

// Converts a value to RGB channel value from a percentage string
function percentToRGBValue(percent) {
    let value = percent;
    if (percent === "" || percent === " ") {value = "0"; }

    if (typeof percent === 'string' && percent.indexOf("%") > -1) {
        value = value.replace("%", "");
        value = Number(value / 100);
        value = Math.round(value * 255);
    } else {
        value = Number(value);
    }
    

    if (isNaN(value)) {
        return false;
    }

    if (parseInt(value) > 255) {value = 255; }
    
    return value;
}

// Gets the type of color and details fro the color string
function getBaseValues(color) {
    let type, sep, arr, arrLength, opacity;

    // Check if color is hex value
    if (color.match(/^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i)) {
        type = 'hex';
    } else if (color.indexOf(",") === -1 && color.indexOf("(") === -1 && color.indexOf("%") === -1 && color.indexOf("#") === -1) {
        type = 'name';
    } else {
        // Otherwise set the color type preceding ()
        type = color.split('(')[0].trim().toLowerCase();
        sep = color.indexOf(",") > -1 ? "," : " ";
        arr = /\(([^)]+)\)/.exec(color)[1].split(sep)
    }

    // Intialize Base Values
    arrLength = 3;
    opacity = false

    if (type.slice(-1) === 'a') {
        arrLength = 4;
        opacity = true
    }

    return {
        type,
        arr,
        arrLength, 
        opacity
    };
}

// Converts rgb values to linear values
function toLinear(value) {
    if ( value <= 0.04045 ) {
        return value / 12.92;
    } else {
        return Math.pow((( value + 0.055)/1.055),2.4);
    }
}

// Determins if string is hex
function isHex(value) {
    let regex6 = /[0-9A-Fa-f]{6}/g;
    let regex8 = /[0-9A-Fa-f]{8}/g;
    return value.match(regex6) || value.match(regex8);
}

// Return an array of hex values and color names
function getColorArr(x) {
    if (x == "names") {return ['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen']; }
    if (x == "hexs") {return ['f0f8ff','faebd7','00ffff','7fffd4','f0ffff','f5f5dc','ffe4c4','000000','ffebcd','0000ff','8a2be2','a52a2a','deb887','5f9ea0','7fff00','d2691e','ff7f50','6495ed','fff8dc','dc143c','00ffff','00008b','008b8b','b8860b','a9a9a9','a9a9a9','006400','bdb76b','8b008b','556b2f','ff8c00','9932cc','8b0000','e9967a','8fbc8f','483d8b','2f4f4f','2f4f4f','00ced1','9400d3','ff1493','00bfff','696969','696969','1e90ff','b22222','fffaf0','228b22','ff00ff','dcdcdc','f8f8ff','ffd700','daa520','808080','808080','008000','adff2f','f0fff0','ff69b4','cd5c5c','4b0082','fffff0','f0e68c','e6e6fa','fff0f5','7cfc00','fffacd','add8e6','f08080','e0ffff','fafad2','d3d3d3','d3d3d3','90ee90','ffb6c1','ffa07a','20b2aa','87cefa','778899','778899','b0c4de','ffffe0','00ff00','32cd32','faf0e6','ff00ff','800000','66cdaa','0000cd','ba55d3','9370db','3cb371','7b68ee','00fa9a','48d1cc','c71585','191970','f5fffa','ffe4e1','ffe4b5','ffdead','000080','fdf5e6','808000','6b8e23','ffa500','ff4500','da70d6','eee8aa','98fb98','afeeee','db7093','ffefd5','ffdab9','cd853f','ffc0cb','dda0dd','b0e0e6','800080','663399','ff0000','bc8f8f','4169e1','8b4513','fa8072','f4a460','2e8b57','fff5ee','a0522d','c0c0c0','87ceeb','6a5acd','708090','708090','fffafa','00ff7f','4682b4','d2b48c','008080','d8bfd8','ff6347','40e0d0','ee82ee','f5deb3','ffffff','f5f5f5','ffff00','9acd32']; }
}

// Return a color name from a hex value
function getColorName(hex) {
    let hexs, colorName, i;
    hexs = getColorArr('hexs');
    
    for (i = 0; i < hexs.length; i++) {
        if (hex.toLowerCase() === hexs[i].toLowerCase()) {
            colorName = getColorArr('names')[i];
            break;
        }
    }
    return colorName
}

export default Color;