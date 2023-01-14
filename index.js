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
 *  - hwb / hwba
 *  - cmyk
 *  - ncol
 *  - HTML Name
 *  - ryb
 *  - xyz 
 *  - lab
 *  - ansi256
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
        let x, y;
        
        // Check if color is a ncol value
        x = color.substring(0,1).toUpperCase();
        y = color.substring(1);
        if ((x === "R" || x === "Y" || x === "G" || x === "C" || x === "B" || x === "M" || x === "W") && !isNaN(y)) {
          if (color.length === 6 && color.indexOf(",") === -1) {
          } else {
            color = "ncol(" + color + ")";
          }
        }
        if (color.length != 3 && color.length != 6 && !isNaN(color)) {color = "ncol(" + color + ")";}
        if (color.indexOf(",") > 0 && color.indexOf("(") == -1) {color = "ncol(" + color + ")";}

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

            case 'hwb':
            case 'hwba':
                this.setHWB(color);
                return this;

            case 'ncol':
            case 'ncola':
                this.setNCOL(color);
                return this;

            case 'cmyk':
                this.setCMYK(color);
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
            testHwb = ['h','w','b','a'],
            testCmyk = ['c','m','y','k', 'a'],
            testNcol = ['ncol','w', 'b', 'a'],
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

            // Match HWB object
            case testHwb.contains(keys):
                if (keys.length < 3) {
                    this.emptyObj();
                    return this;
                }
                this.setHWB(color);
                return this;

            // Match CMYK object
            case testCmyk.contains(keys):
                if (keys.length < 4) {
                    this.emptyObj();
                    return this;
                }
                this.setCMYK(color);
                return this;

            // Match NCOL object
            case testNcol.contains(keys):
                if (keys.length < 3) {
                    this.emptyObj();
                    return this;
                }
                this.setNCOL(color);
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
        this.ryb = undefined;
        this.hsl = undefined;
        this.hsv = undefined;
        this.hwb = undefined;
        this.ncol = undefined;
        this.cmyk = undefined;
        this.xyz = undefined;
        this.lab = undefined;
        this.ansi256 = undefined;
        this.elements = {
            hex: undefined,
            red : undefined,
            green : undefined,
            blue : undefined,
            hue : undefined,
            sat : undefined,
            light : undefined,
            value: undefined,
            whiteness : undefined,
            blackness : undefined,
            cyan : undefined,
            magenta : undefined,
            yellow : undefined,
            black : undefined,
            opacity : undefined,
            name: undefined,
            valid : false
        };
        return this;
    },

    setObj: function(alpha = undefined, name = undefined) {
        if (this.rgb) this.rgb.setAlpha(alpha);
        if (this.rgb && !this.ryb) {
            this.ryb = new ryb(this.rgb.toRyb());
            this.ryb.setAlpha(alpha);
        }
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
        if (this.rgb && !this.hwb) {
            this.hwb = new hwb(this.rgb.toHwb());
            this.hwb.setAlpha(alpha);
        }
        if (this.rgb && !this.cmyk) {
            this.cmyk = new cmyk(this.rgb.toCmyk());
            this.cmyk.setAlpha(alpha)
        }
        if (this.rgb && !this.ncol) {
            this.ncol = new ncol(this.rgb.toNcol());
            this.ncol.setAlpha(alpha);
        }
        if (this.rgb && !this.xyz) {
            this.xyz = new xyz(this.rgb.toXyz());
            this.xyz.setAlpha(alpha);
        }
        if (this.rgb && !this.lab) {
            this.lab = new lab(this.rgb.toLab());
            this.lab.setAlpha(alpha);
        }
        if (this.rgb && !this.ansi256) {
            this.ansi256 = new ansi256(this.rgb.toAnsi256());
            this.ansi256.setAlpha(alpha);
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
            whiteness : this.hwb.w,
            blackness : this.hwb.b,
            cyan : this.cmyk.c,
            magenta : this.cmyk.m,
            yellow : this.cmyk.y,
            black : this.cmyk.k,
            ncol : this.ncol.ncol,
            opacity : alpha,
            name: name,
            valid : true
        };

        return this;
    },

    setHarmonies: function() {

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

    mix: function(color, value = 0.5) {
        if (!(color instanceof Color)) { 
            color = new Color(color); 
        }

        let color1 = this.ryb, color2 = color.ryb,
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
        this.ryb = new ryb(rybTemp);
        this.rgb = new rgb(this.ryb.toRgb())
        this.setObj(this.rgb.alpha);

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
            r: Number(this.r.toFixed(0)),
            g: Number(this.g.toFixed(0)),
            b: Number(this.b.toFixed(0)),
            a: this.a ? Number(this.a.toFixed(2)) : undefined
        }
        this.hsl = {
            h: Number(this.h.toFixed(0)),
            s: Number(this.s.toFixed(2)),
            l: Number(this.l.toFixed(2)),
            a: this.a ? Number(this.a.toFixed(2)) : undefined
        }
        this.hsv = {
            h: Number(this.h.toFixed(0)),
            s: Number(this.s.toFixed(2)),
            v: Number(this.v.toFixed(2)),
            a: this.a ? Number(this.a.toFixed(2)) : undefined
        }
        this.hwb = {
            h: Number(this.h.toFixed(0)),
            w: Number(this.w.toFixed(2)),
            b: Number(this.b.toFixed(2)),
            a: this.a ? Number(this.a.toFixed(2)) : undefined
        }
        this.cmyk = {
            c: Number(this.c.toFixed(2)),
            m: Number(this.m.toFixed(2)),
            y: Number(this.y.toFixed(2)),
            k: Number(this.k.toFixed(2))
        }
        this.ncol = {
            ncol: this.ncol.substring(0, 1) + Math.round(Number(this.elements.ncol.substring(1))),
            w: Number(this.w.toFixed(2)),
            b: Number(this.b.toFixed(2)),
            a: Number(this.a.toFixed(2))
        }
        this.elements = {
            red : Number(this.elements.red.toFixed(0)),
            green : Number(this.elements.green.toFixed(0)),
            blue : Number(this.elements.blue.toFixed(0)),
            hue : Number(this.elements.hue.toFixed(0)),
            sat : Number(this.elements.sat.toFixed(2)),
            light : Number(this.elements.light.toFixed(2)),
            whiteness : Number(this.elements.whiteness.toFixed(2)),
            blackness : Number(this.elements.blackness.toFixed(2)),
            cyan : Number(this.elements.cyan.toFixed(2)),
            magenta : Number(this.elements.magenta.toFixed(2)),
            yellow : Number(this.elements.yellow.toFixed(2)),
            black : Number(this.elements.black.toFixed(2)),
            ncol : this.elements.ncol.substring(0, 1) + Math.round(Number(this.elements.ncol.substring(1))),
            opacity : this.elements.opacity ? Number(this.elements.opacity.toFixed(2)) : undefined
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

    setHWB: function(color) {
        // Set the HWB value from a string
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
                this.hwb = new hwb({h: Number(arr[0]), w: Number(arr[1]), b: Number(arr[2]), alpha})
                this.rgb = new rgb(this.hwb.toRgb());
            } else {
                this.hwb = new hwb({h: Number(arr[0]), w: Number(arr[1]), b: Number(arr[2])})
                this.rgb = new rgb(this.hwb.toRgb());
            }
            
            this.setObj(alpha);
            return this;
        }

        // Set the HWB value from an array
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
                this.hwb = new hwb({h: Number(color[0]), w: Number(color[1]), b: Number(color[2]), alpha})
                this.rgb = new rgb(this.hwb.toRgb());
            } else {
                this.hwb = new hwb({h: Number(color[0]), w: Number(color[1]), b: Number(color[2])})
                this.rgb = new rgb(this.hwb.toRgb());
            }

            this.setObj(alpha);
            return this;
        }

        let testHwb = ['h','w','b','a'];
        
        let keys = Object.keys(color);
        if (keys.length < 3) {
            this.emptyObj();
            return this;
        }

        if (testHwb.contains(keys)){
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

            if (opacity === true) {
                alpha = percentToDecimal(arr[3]);
                this.hwb = new hwb({h: Number(arr[0]), w: Number(arr[1]), b: Number(arr[2]), alpha})
                this.rgb = new rgb(this.hwb.toRgb());
            } else {
                this.hwb = new hwb({h: Number(arr[0]), w: Number(arr[1]), b: Number(arr[2])})
                this.rgb = new rgb(this.hwb.toRgb());
            }

            this.setObj(alpha);
        } else {
            this.emptyObj();
        }
        return this;
    },

    setCMYK: function(color) {
        // Set the CMYK value from a string
        if (typeof color === 'string') {
            let i, alpha;

            let { arr, arrLength, opacity } = getBaseValues(color);
            while (arr.length < arrLength) {arr.push("1"); }
            
            // Convert percentages to decimal
            for (i = 0; i < arrLength; i++) {
                arr[i] = percentToDecimal(arr[i])
                if (arr[i] === false) {
                    this.emptyObj();
                    return this;
                }
            }

            if (opacity == true) {
                alpha = percentToDecimal(arr[4]);
                this.cmyk = new cmyk({c: Number(arr[0]), m: Number(arr[1]), y: Number(arr[2]), k: Number(arr[3]), alpha});
                this.rgb = new rgb(this.cmyk.toRgb());
            } else {
                this.cmyk = new cmyk({c: Number(arr[0]), m: Number(arr[1]), y: Number(arr[2]), k: Number(arr[3])});
                this.rgb = new rgb(this.cmyk.toRgb());
            }

            this.setObj(alpha);
            return this;
        }

        // Set the CMYK value from an array
        if (Array.isArray(color)) {
            let alpha, opacity, i;
            if (color.length < 4 || color.length > 5) {
                this.emptyObj();
                return this;
            }

            if (color.length === 5) {
                opacity = true;
            }

            // Convert percentages to decimal
            for (i = 0; i < color.length; i++) {
                color[i] = percentToDecimal(color[i])
                if (!color[i]) {
                    this.emptyObj();
                    return this;
                }
            }

            if (opacity == true) {
                alpha = percentToDecimal(color[4]);
                this.cmyk = new cmyk({c: Number(color[0]), m: Number(color[1]), y: Number(color[2]), k: Number(color[3]), alpha});
            this.rgb = new rgb(this.cmyk.toRgb());
            } else {
                this.cmyk = new cmyk({c: Number(color[0]), m: Number(color[1]), y: Number(color[2]), k: Number(color[3])});
                this.rgb = new rgb(this.cmyk.toRgb());
            }

            this.setObj(alpha);
            return this;
        }

        // Set the CMYK value from an object
        let testCmyk = ['c','m','y','k','a'];
        
        let keys = Object.keys(color);
        if (keys.length < 3) {
            this.emptyObj();
            return this;
        }

        if (testCmyk.contains(keys)){
            let arr = [], alpha, opacity, i;
            keys.forEach(key => {
                arr.push(color[key])
            })

            if (arr.length === 5) {
                opacity = true;
            }

            // Convert percentages to decimal
            for (i = 0; i < arr.length; i++) {
                arr[i] = percentToDecimal(arr[i])
                if (arr[i] === false) {
                    this.emptyObj();
                    return this;
                }
            }

            

            if (opacity == true) {
                alpha = percentToDecimal(arr[4]);
                this.cmyk = new cmyk({c: Number(arr[0]), m: Number(arr[1]), y: Number(arr[2]), k: Number(arr[3]), alpha});
                this.rgb = new rgb(this.cmyk.toRgb());
            } else {
                this.cmyk = new cmyk({c: Number(arr[0]), m: Number(arr[1]), y: Number(arr[2]), k: Number(arr[3])});
                this.rgb = new rgb(this.cmyk.toRgb());
            }

            this.setObj(alpha);
            return this;

        } else {
            this.emptyObj();
            return this;
        }


    },

    setNCOL: function(color) {
        // Set the NCOL value from a string
        if (typeof color === 'string') {
            let x, y, i, alpha;
            let { arr, arrLength, opacity } = getBaseValues(color);

            x = arr[0].substring(0,1).toUpperCase();
            y = arr[0].substring(1);

            if ((x !== "R" && x !== "Y" && x !== "G" && x !== "C" && x !== "B" && x !== "M" && x !== "W") || isNaN(y)) {
                this.emptyObj();
                return this;
            }

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
                this.ncol = new ncol({ncol: arr[0], w: arr[1], b: arr[2], alpha});
                this.rgb = new rgb(this.ncol.toRgb());
            } else {
                this.ncol = new ncol({ncol: arr[0], w: arr[1], b: arr[2]});
                this.rgb = new rgb(this.ncol.toRgb());
            }

            this.setObj(alpha);
            return this;
        }

        // Set the NCOL value from an array
        if (Array.isArray(color)) {
            let alpha, opacity, i, x, y;
            if (color.length < 3 || color.length > 4) {
                this.emptyObj();
                return this;
            }
            x = color[0].substring(0,1).toUpperCase();
            y = color[0].substring(1);

            if ((x !== "R" && x !== "Y" && x !== "G" && x !== "C" && x !== "B" && x !== "M" && x !== "W") || isNaN(y)) {
                this.emptyObj();
                return this;
            }

            if (color.length === 4) {
                opacity = true;
            }

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
                this.ncol = new ncol({ncol: color[0], w: color[1], b: color[2], alpha});
                this.rgb = new rgb(this.ncol.toRgb());
            } else {
                this.ncol = new ncol({ncol: color[0], w: color[1], b: color[2]});
                this.rgb = new rgb(this.ncol.toRgb());
            }

            this.setObj(alpha);
            return this;
        }

        let testNcol = ['ncol','w', 'b', 'a'];
        
        let keys = Object.keys(color);
        if (keys.length < 3) {
            this.emptyObj();
            return this;
        }

        if (testNcol.contains(keys)){
            let arr = [], alpha, opacity, i;
            keys.forEach(key => {
                arr.push(color[key])
            })

            if (arr.length === 4) {
                opacity = true;
            }

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
                this.ncol = new ncol({ncol: arr[0], w: arr[1], b: arr[2], alpha});
                this.rgb = new rgb(this.ncol.toRgb());
            } else {
                this.ncol = new ncol({ncol: arr[0], w: arr[1], b: arr[2]});
                this.rgb = new rgb(this.ncol.toRgb());
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
                this.a = this.a ? Number(this.a.toFixed(2)) : undefined;
                break;
            case 'hsl':
                this.h = Number(this.h.toFixed(0));
                this.s = Number(this.s.toFixed(2));
                this.l = Number(this.l.toFixed(2));
                this.a = this.a ? Number(this.a.toFixed(2)) : undefined;
                break;
            case 'hsv':
                this.h = Number(this.h.toFixed(0));
                this.s = Number(this.s.toFixed(2));
                this.v = Number(this.v.toFixed(2));
                this.a = this.a ? Number(this.a.toFixed(2)) : undefined;
                break;
            case 'hwb':
                this.h = Number(this.h.toFixed(0));
                this.w = Number(this.w.toFixed(2));
                this.b = Number(this.b.toFixed(2));
                this.a = this.a ? Number(this.a.toFixed(2)) : undefined;
                break;
            case 'cmyk':
                this.c = Number(this.c.toFixed(2));
                this.m = Number(this.m.toFixed(2));
                this.y = Number(this.y.toFixed(2));
                this.k = Number(this.k.toFixed(2));
                break;
            case 'ncol':
                this.ncol = this.ncol.substring(0, 1) + Math.round(Number(this.elements.ncol.substring(1)));
                this.w = Number(this.w.toFixed(2));
                this.b = Number(this.b.toFixed(2));
                this.a = Number(this.a.toFixed(2));
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
                    a: this.a ? Number(this.a.toFixed(2)) : undefined
                }
            case 'hsl':
                return {
                    h: Number(this.h.toFixed(0)),
                    s: Number(this.s.toFixed(2)),
                    l: Number(this.l.toFixed(2)),
                    a: this.a ? Number(this.a.toFixed(2)) : undefined
                }
            case 'hsv':
                return {
                    h: Number(this.h.toFixed(0)),
                    s: Number(this.s.toFixed(2)),
                    v: Number(this.v.toFixed(2)),
                    a: this.a ? Number(this.a.toFixed(2)) : undefined
                }
            case 'hwb':
                return {
                    h: Number(this.h.toFixed(0)),
                    w: Number(this.w.toFixed(2)),
                    b: Number(this.b.toFixed(2)),
                    a: this.a ? Number(this.a.toFixed(2)) : undefined
                }
            case 'cmyk':
                return {
                    c: Number(this.c.toFixed(2)),
                    m: Number(this.m.toFixed(2)),
                    y: Number(this.y.toFixed(2)),
                    k: Number(this.k.toFixed(2))
                }
            case 'ncol':
                return {
                    ncol: this.ncol.substring(0, 1) + Math.round(Number(this.elements.ncol.substring(1))),
                    w: Number(this.w.toFixed(2)),
                    b: Number(this.b.toFixed(2)),
                    a: Number(this.a.toFixed(2))
                }
        }
    }

    string() {
        switch (this.constructor.name){
            case 'hex':
                if (this.a) {
                    let alpha = (this.a * 255).toFixed(5).toString(16);
                    return `#${this.value}${alpha}`;
                }
                return `#${this.value}`;
            case 'rgb':
                let rgb = this.stringRound();
                if (rgb.a) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
                return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            case 'hsl':
                let hsl = this.stringRound();
                if (hsl.a) return `hsla(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%, ${hsl.a})`;
                return `hsl(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
            case 'hsv':
                let hsv = this.stringRound();
                if (hsv.a) return `hsva(${hsv.h}, ${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%, ${hsv.a})`;
                return `hsv(${hsv.h}, ${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%)`;
            case 'hwb':
                let hwb = this.stringRound();
                if (hwb.a) return `hwba(${hwb.h}, ${Math.round(hwb.w * 100)}%, ${Math.round(hwb.b * 100)}%, ${hwb.a})`;
                return `hwb(${hwb.h}, ${Math.round(hwb.w * 100)}%, ${Math.round(hwb.b * 100)}%)`;
            case 'cmyk':
                let cmyk = this.stringRound();
                return `cmyk(${Math.round(cmyk.c)}%, ${Math.round(cmyk.m)}%, ${Math.round(cmyk.y)}%, ${Math.round(cmyk.k)}%)`;
            case 'ncol':
                let ncol = this.stringRound();
                if (ncol.a) return `ncola(${ncol.ncol}, ${Math.round(ncol.w * 100)}%, ${Math.round(ncol.b * 100)}%, ${ncol.a})`;
                return `ncol(${ncol.ncol}, ${Math.round(ncol.w * 100)}%, ${Math.round(ncol.b * 100)}%)`;
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
    
    toHwb() {
        let {h, min, max} = this.toHue(), w, bl;
        w = min;
        bl = 1 - max;

        if (this.alpha) return {h:Number(h.toFixed(5)), w:Number(w.toFixed(5)), b: Number(bl.toFixed(5)), alpha: this.alpha};
        return {h:Number(h.toFixed(5)), w:Number(w.toFixed(5)), b: Number(bl.toFixed(5))};
    }

    toCmyk() {
        let c, m, y, k, r, g, b, max;
        r = this.r / 255;
        g = this.g / 255;
        b = this.b / 255;
        max = Math.max(r, g, b);
        k = 1 - max;
        if (k == 1) {
          c = 0;
          m = 0;
          y = 0;
        } else {
          c = (1 - r - k) / (1 - k);
          m = (1 - g - k) / (1 - k);
          y = (1 - b - k) / (1 - k);
        }

        if (this.alpha) return {c:Number(c.toFixed(5)), m:Number(m.toFixed(5)), y:Number(y.toFixed(5)), k:Number(k.toFixed(5)), alpha: this.alpha};
        return {c:Number(c.toFixed(5)), m:Number(m.toFixed(5)), y:Number(y.toFixed(5)), k:Number(k.toFixed(5))};
    }

    toNcol() {
        let {h, min, max} = this.toHue(), ncol, w, bl;
        w = min;
        bl = 1 - max;

        while (h >= 360) {
            h = h - 360;
        }
        
        if (h < 60) {ncol = "R" + Math.round(h / 0.6); }
        else if (h < 120) {ncol = "Y" + Math.round((h - 60) / 0.6); }
        else if (h < 180) {ncol = "G" + Math.round((h - 120) / 0.6); }
        else if (h < 240) {ncol = "C" + Math.round((h - 180) / 0.6); }
        else if (h < 300) {ncol = "B" + Math.round((h - 240) / 0.6); }
        else if (h < 360) {ncol = "M" + Math.round((h - 300) / 0.6); }
        
        if (this.alpha) return {ncol, w:Number(w.toFixed(5)), b: Number(bl.toFixed(5)), alpha: this.alpha};
        return {ncol, w:Number(w.toFixed(5)), b: Number(bl.toFixed(5))};
    }

    toXyz() {
        let r = Number(this.r/255), 
            g = Number(this.g/255), 
            b = Number(this.b/255), 
            rLin, gLin, bLin, x, y, z;

        rLin = toLinear(r) * 100;
        gLin = toLinear(g) * 100;
        bLin = toLinear(b) * 100;

        x = rLin * 0.4124 + gLin * 0.3576 + bLin * 0.1805;
        y = rLin * 0.2126 + gLin * 0.7152 + bLin * 0.0722;
        z = rLin * 0.0193 + gLin * 0.1192 + bLin * 0.9505;

        if (this.alpha) return {x:Number(x.toFixed(5)), y:Number(y.toFixed(5)), z: Number(z.toFixed(5)), alpha: this.alpha};
        return {x:Number(x.toFixed(5)), y:Number(y.toFixed(5)), z: Number(z.toFixed(5))};
    }

    toLab() {
        let xyzColor = new xyz(this.toXyz());
        let {l, a, b} = xyzColor.toLab();

        if (this.alpha) return {l:Number(l.toFixed(5)), a:Number(a.toFixed(5)), b:Number(b.toFixed(5)), alpha:this.alpha};
        return {l:Number(l.toFixed(5)), a:Number(a.toFixed(5)), b:Number(b.toFixed(5))};
    }

    toAnsi256() {
        let ansi;
        if (this.r === this.g && this.g === this.b) {
            if (this.r < 8) {
                ansi = 16;
            } else if (this.r > 248) {
                ansi = 231;
            } else {
                ansi = Math.round(((this.r - 8) / 247) * 24) + 232;
            }
        } else {
            ansi = 16 + (36 * Math.round(this.r / 255 * 5))
                      + (6 * Math.round(this.g / 255 * 5))
                      + Math.round(this.b / 255 * 5);
        }

        if (this.alpha) return {ansi:Number(ansi.toFixed(5)), alpha:this.alpha};
        return {ansi:Number(ansi.toFixed(5))};
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

class hwb extends ColorObject
{
    constructor({h, w, b, alpha = undefined}) {
        super();
        this.h = h;
        this.w = w;
        this.b = b;
        this.alpha = alpha;
    }

    toRgb() {
        let i, rgb, rgbArr = [], tot, white = this.w, black = this.b;
        rgb = new hsl({h: this.h, s:1, l:0.5}).toRgb();
        rgbArr[0] = rgb.r / 255;
        rgbArr[1] = rgb.g / 255;
        rgbArr[2] = rgb.b / 255;
        tot = white + black;
        if (tot > 1) {
          white = Number((white / tot).toFixed(2));
          black = Number((black / tot).toFixed(2));
        }
        for (i = 0; i < 3; i++) {
          rgbArr[i] *= (1 - (white) - (black));
          rgbArr[i] += (white);
          rgbArr[i] = Number(rgbArr[i] * 255);
        }

        if (this.alpha) return {r: Number(rgbArr[0].toFixed(5)), g: Number(rgbArr[1].toFixed(5)), b: Number(rgbArr[2].toFixed(5)), alpha: this.alpha };
        return {r: Number(rgbArr[0].toFixed(5)), g: Number(rgbArr[1].toFixed(5)), b: Number(rgbArr[2].toFixed(5)) };
    }

    toNcol() {
        let hue, ncol;
        hue = this.h;

        while (hue >= 360) {
            hue = hue - 360;
        }

        if (hue < 60) {ncol = "R" + Math.round(hue / 0.6); }
        else if (hue < 120) {ncol = "Y" + Math.round((hue - 60) / 0.6); }
        else if (hue < 180) {ncol = "G" + Math.round((hue - 120) / 0.6); }
        else if (hue < 240) {ncol = "C" + Math.round((hue - 180) / 0.6); }
        else if (hue < 300) {ncol = "B" + Math.round((hue - 240) / 0.6); }
        else if (hue < 360) {ncol = "M" + Math.round((hue - 300) / 0.6); }

        if (this.alpha) return {ncol, w: Number(this.w.toFixed(5)), b: Number(this.b.toFixed(5)), alpha: this.alpha};
        return {ncol, w: Number(this.w.toFixed(5)), b: Number(this.b.toFixed(5))};
    }
}

class cmyk extends ColorObject
{
    constructor({c, m, y, k, alpha = undefined}) {
        super();
        this.c = c;
        this.m = m;
        this.y = y;
        this.k = k;
        this.alpha = alpha;
    }

    toRgb() {
        let r, g, b;
        r = 255 - ((Math.min(1, this.c * (1 - this.k) + this.k)) * 255);
        g = 255 - ((Math.min(1, this.m * (1 - this.k) + this.k)) * 255);
        b = 255 - ((Math.min(1, this.y * (1 - this.k) + this.k)) * 255);

        if (this.alpha) return {r: Number(r.toFixed(5)), g: Number(g.toFixed(5)), b: Number(b.toFixed(5)), alpha: this.alpha};
        return {r:Number(r.toFixed(5)), g:Number(g.toFixed(5)), b:Number(b.toFixed(5))};
    }
}

class ncol extends ColorObject
{
    constructor({ncol, w, b, alpha = undefined}) {
        super();
        this.ncol = ncol;
        this.w = w;
        this.b = b;
        this.alpha = alpha;
    }

    toRgb() {
        let letter, percent, h= this.ncol, w = this.w, b = this.b;
        
        if (isNaN(h.substring(0,1))) {
          letter = h.substring(0,1).toUpperCase();
          percent = h.substring(1);
          if (percent === "") {percent = 0;}
          percent = Number(percent);
          
          if (isNaN(percent)) {return false;}
          if (letter == "R") {h = 0 + (percent * 0.6);}
          else if (letter == "Y") {h = 60 + (percent * 0.6);}
          else if (letter == "G") {h = 120 + (percent * 0.6);}
          else if (letter == "C") {h = 180 + (percent * 0.6);}
          else if (letter == "B") {h = 240 + (percent * 0.6);}
          else if (letter == "M") {h = 300 + (percent * 0.6);}
          else if (letter == "W") {
            h = 0;
            w = 1 - (percent / 100);
            b = (percent / 100);
          }
        }

        if (this.alpha) return new hwb({h:Number(h.toFixed(5)), w:Number(w.toFixed(5)), b:Number(b.toFixed(5)), alpha: this.alpha}).toRgb();
        return new hwb({h:Number(h.toFixed(5)), w:Number(w.toFixed(5)), b:Number(b.toFixed(5))}).toRgb();
    }
}

class xyz extends ColorObject
{
    constructor({x, y, z, alpha = undefined}) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this.alpha = alpha;
    }

    toRgb() {
        let x = this.x / 100,
            y = this.y / 100,
            z = this.z / 100,
            rgb = [], r, g, b;

        rgb[0] = x *  3.2406 + y * -1.5372 + z * -0.4986;
        rgb[1] = x * -0.9689 + y *  1.8758 + z *  0.0415;
        rgb[2] = x *  0.0557 + y * -0.2040 + z *  1.0570;

        rgb = rgb.map(channel => channel > 0.0031308
                ? 1.055 * Math.pow(channel, (1 / 2.4)) - 0.055
                : 12.92 * channel);

        rgb = rgb.map(channel => channel * 255);

        r = rgb[0];
        g = rgb[1];
        b = rgb[2];

        if (this.alpha) return {r:Number(r.toFixed(5)), g:Number(g.toFixed(5)), b:Number(b.toFixed(5)), alpha:this.alpha};
        return {r:Number(r.toFixed(5)), g:Number(g.toFixed(5)), b:Number(b.toFixed(5))};
    }

    toLab(illuminant = 'D65', observer = 2) {
        let [refX, refY, refZ] = xyzReference(illuminant, observer),
            xyz = [this.x / refX, this.y / refY, this.z / refZ],
            l, a, b;

        xyz = xyz.map(n => n > 0.008856
                    ? Math.pow(n, ( 1/3 ))
                    : ( 7.787 * n ) + ( 16 / 116 ));
        
        l = ( 116 * xyz[1] ) - 16
        a = 500 * ( xyz[0] - xyz[1] )
        b = 200 * ( xyz[1] - xyz[2] )

        if (this.alpha) return {l:Number(l.toFixed(5)), a:Number(a.toFixed(5)), b:Number(b.toFixed(5)), alpha:this.alpha};
        return {l:Number(l.toFixed(5)), a:Number(a.toFixed(5)), b:Number(b.toFixed(5))};
    }
}

class lab extends ColorObject
{
    constructor({l, a, b, alpha = undefined}) {
        super();
        this.l = l;
        this.a = a;
        this.b = b;
        this.alpha = alpha;
    }

    toRgb() {
        let xyzColor = new xyz(this.toXyz())
        return xyzColor.toRgb()
    }

    toXyz(illuminant = 'D65', observer = 2) {
        let [refX, refY, refZ] = xyzReference(illuminant, observer),
        x, y, z;

        y = ( this.l + 16 ) / 116;
        x = this.a / 500 + y;
        z = y - this.b / 200;

        if ( Math.pow(y, 3)  > 0.008856 ) {
            y = Math.pow(y, 3)
        } else {
            y = ( y - 16 / 116 ) / 7.787
        }
        if ( Math.pow(x, 3)  > 0.008856 ) {
            x = Math.pow(x, 3)
        } else {
            x = ( x - 16 / 116 ) / 7.787
        }
        if ( Math.pow(z, 3)  > 0.008856 ) {
            z = Math.pow(z, 3)
        } else {
            z = ( z - 16 / 116 ) / 7.787
        }

        x *= refX;
        y *= refY;
        z *= refZ;

        if (this.alpha) return {x:Number(x.toFixed(5)), y:Number(y.toFixed(5)), z:Number(z.toFixed(5)), alpha:this.alpha};
        return {x:Number(x.toFixed(5)), y:Number(y.toFixed(5)), z:Number(z.toFixed(5))};
    }
}

class ansi256 extends ColorObject
{
    constructor({ansi, alpha = undefined}) {
        super();
        this.ansi = ansi;
        this.alpha = alpha;
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
    } else if (type === 'ncol') {
        if (arr.length === 4) {
            arrLength = 4;
            opacity = true;
        }
    } else if (type === 'cmyk') {
        arrLength = 4;
        if (arr.length === 5) {
            arrLength = 5;
            opacity = true;
        }
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

// Return XYZ Reference values based on Observer and Luminant
function xyzReference(illuminant = 'D65', observer = 2) {
    let row, refObj;

    if (typeof illuminant !== 'string') {
        illuminant = 'D65';
    } else {
        illuminant = illuminant.toUpperCase();
    }

    refObj = {
        'A': {'x2': 109.850, 'y2': 100.000, 'z2': 35.585, 'x10': 111.144, 'y10': 100.000, 'z10': 35.200},	// Incandescent/tungsten
        'B': {'x2': 99.0927, 'y2': 100.000, 'z2': 85.313, 'x10': 99.178, 'y10': 100.000, 'z10': 84.3493},	// Old direct sunlight at noon
        'C': {'x2': 98.074, 'y2': 100.000, 'z2': 118.232, 'x10': 97.285, 'y10': 100.000, 'z10': 116.145},	// Old daylight
        'D50': {'x2': 96.422, 'y2': 100.000, 'z2': 82.521, 'x10': 96.720, 'y10': 100.000, 'z10': 81.427},	// ICC profile PCS
        'D55': {'x2': 95.682, 'y2': 100.000, 'z2': 92.149, 'x10': 95.799, 'y10': 100.000, 'z10': 90.926},	// Mid-morning daylight
        'D65': {'x2': 95.047, 'y2': 100.000, 'z2': 108.883, 'x10': 94.811, 'y10': 100.000, 'z10': 107.304},	// Daylight, sRGB, Adobe-RGB
        'D75': {'x2': 94.972, 'y2': 100.000, 'z2': 122.638, 'x10': 94.416, 'y10': 100.000, 'z10': 120.641},	// North sky daylight
        'E': {'x2': 100.000, 'y2': 100.000, 'z2': 100.000, 'x10': 100.000, 'y10': 100.000, 'z10': 100.000},	// Equal energy
        'F1': {'x2': 92.834, 'y2': 100.000, 'z2': 103.665, 'x10': 94.791, 'y10': 100.000, 'z10': 103.191},	// Daylight Fluorescent
        'F2': {'x2': 99.187, 'y2': 100.000, 'z2': 67.395, 'x10': 103.280, 'y10': 100.000, 'z10': 69.026},	// Cool fluorescent
        'F3': {'x2': 103.754, 'y2': 100.000, 'z2': 49.861, 'x10': 108.968, 'y10': 100.000, 'z10': 51.965},	// White Fluorescent
        'F4': {'x2': 109.147, 'y2': 100.000, 'z2': 38.813, 'x10': 114.961, 'y10': 100.000, 'z10': 40.963},	// Warm White Fluorescent
        'F5': {'x2': 90.872, 'y2': 100.000, 'z2': 98.723, 'x10': 93.369, 'y10': 100.000, 'z10': 98.636},	// Daylight Fluorescent
        'F6': {'x2': 97.309, 'y2': 100.000, 'z2': 60.191, 'x10': 102.148, 'y10': 100.000, 'z10': 62.074},	// Lite White Fluorescent
        'F7': {'x2': 95.044, 'y2': 100.000, 'z2': 108.755, 'x10': 95.792, 'y10': 100.000, 'z10': 107.687},	// Daylight fluorescent, D65 simulator
        'F8': {'x2': 96.413, 'y2': 100.000, 'z2': 82.333, 'x10': 97.115, 'y10': 100.000, 'z10': 81.135},	// Sylvania F40, D50 simulator
        'F9': {'x2': 100.365, 'y2': 100.000, 'z2': 67.868, 'x10': 102.116, 'y10': 100.000, 'z10': 67.826},	// Cool White Fluorescent
        'F10': {'x2': 96.174, 'y2': 100.000, 'z2': 81.712, 'x10': 99.001, 'y10': 100.000, 'z10': 83.134},	// Ultralume 50, Philips TL85
        'F11': {'x2': 100.966, 'y2': 100.000, 'z2': 64.370, 'x10': 103.866, 'y10': 100.000, 'z10': 65.627},	// Ultralume 40, Philips TL84
        'F12': {'x2': 108.046, 'y2': 100.000, 'z2': 39.228, 'x10': 111.428, 'y10': 100.000, 'z10': 40.353}	// Ultralume 30, Philips TL83
    }

    if (illuminant in refObj) {
        row = refObj[illuminant];
    } else {
        row = refObj['D65'];
    }

    if (Number(observer) === 10) {
        return [row['x10'], row['y10'], row['z10']];
    }

    return [row['x2'], row['y2'], row['z2']];
}

export default Color;