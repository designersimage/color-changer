/**
 * ----------------------------------------------------------------------
 * Color-Changer
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
 *  - ?lab, ?ansi, ?ansi16, ?ansai256, ?hpl, ?xyz
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

    getColorName: function() {
        let hexs, colorName, i;
        hexs = this.getColorArr('hexs');
        
        for (i = 0; i < hexs.length; i++) {
            if (this.hex.value.toLowerCase() === hexs[i].toLowerCase()) {
                colorName = this.getColorArr('names')[i];
                break;
            }
        }
        return colorName
    },

    colorObj: function(alpha = undefined, name = undefined) {
        if (this.rgb) this.rgb.alpha(alpha);
        if (this.rgb && !this.hex) {
            this.hex = new hex(this.rgb.toHex());
            this.hex.alpha(alpha);
        }
        if (this.rgb && !this.hsl) {
            this.hsl = new hsl(this.rgb.toHsl());
            this.hsl.alpha(alpha);
        }
        if (this.rgb && !this.hsv) {
            this.hsv = new hsv(this.rgb.toHsv());
            this.hsv.alpha(alpha);
        }
        if (this.rgb && !this.hwb) {
            this.hwb = new hwb(this.rgb.toHwb());
            this.hwb.alpha(alpha);
        }
        if (this.rgb && !this.cmyk) {
            this.cmyk = new cmyk(this.rgb.toCmyk());
            this.cmyk.alpha(alpha)
        }
        if (this.rgb && !this.ncol) {
            this.ncol = new ncol(this.rgb.toNcol());
            this.ncol.alpha(alpha);
        }
        if (!name) {
            name = this.getColorName();
        }
        
        this.elements = {
            hex: this.hex.value,
            red : this.rgb.r,
            green : this.rgb.g,
            blue : this.rgb.b,
            hue : this.hsl.h,
            sat : this.hsl.s,
            light : this.hsl.l,
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

    emptyObj: function() {
        this.hex = undefined;
        this.rgb = undefined;
        this.hsl = undefined;
        this.hsv = undefined;
        this.hwb = undefined;
        this.ncol = undefined;
        this.cmyk = undefined;
        this.elements = {
            hex: undefined,
            red : undefined,
            green : undefined,
            blue : undefined,
            hue : undefined,
            sat : undefined,
            light : undefined,
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

    getColorArr: function(x) {
        if (x == "names") {return ['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen']; }
        if (x == "hexs") {return ['f0f8ff','faebd7','00ffff','7fffd4','f0ffff','f5f5dc','ffe4c4','000000','ffebcd','0000ff','8a2be2','a52a2a','deb887','5f9ea0','7fff00','d2691e','ff7f50','6495ed','fff8dc','dc143c','00ffff','00008b','008b8b','b8860b','a9a9a9','a9a9a9','006400','bdb76b','8b008b','556b2f','ff8c00','9932cc','8b0000','e9967a','8fbc8f','483d8b','2f4f4f','2f4f4f','00ced1','9400d3','ff1493','00bfff','696969','696969','1e90ff','b22222','fffaf0','228b22','ff00ff','dcdcdc','f8f8ff','ffd700','daa520','808080','808080','008000','adff2f','f0fff0','ff69b4','cd5c5c','4b0082','fffff0','f0e68c','e6e6fa','fff0f5','7cfc00','fffacd','add8e6','f08080','e0ffff','fafad2','d3d3d3','d3d3d3','90ee90','ffb6c1','ffa07a','20b2aa','87cefa','778899','778899','b0c4de','ffffe0','00ff00','32cd32','faf0e6','ff00ff','800000','66cdaa','0000cd','ba55d3','9370db','3cb371','7b68ee','00fa9a','48d1cc','c71585','191970','f5fffa','ffe4e1','ffe4b5','ffdead','000080','fdf5e6','808000','6b8e23','ffa500','ff4500','da70d6','eee8aa','98fb98','afeeee','db7093','ffefd5','ffdab9','cd853f','ffc0cb','dda0dd','b0e0e6','800080','663399','ff0000','bc8f8f','4169e1','8b4513','fa8072','f4a460','2e8b57','fff5ee','a0522d','c0c0c0','87ceeb','6a5acd','708090','708090','fffafa','00ff7f','4682b4','d2b48c','008080','d8bfd8','ff6347','40e0d0','ee82ee','f5deb3','ffffff','f5f5f5','ffff00','9acd32']; }
    },

    isHex: function(value) {
        let regex6 = /[0-9A-Fa-f]{6}/g;
        let regex8 = /[0-9A-Fa-f]{8}/g;
        return value.match(regex6) || value.match(regex8);
    },

    isLight: function() {
        return this.brightness() > 50
    },

    isDark: function() {
        return this.brightness() <= 50
    },

    contrast: function(color) {
        let y1, y2, y3;
        y1 = this.luminance();
        y2 = color.luminance();
        
        //Arrange so $y1 is lightest
        if (y1 < y2) {
            y3 = y1;
            y1 = y2;
            y2 = y3;
        }
        return (y1 + 0.05) / (y2 + 0.05);
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
        rLin = this.toLinear(r);
        gLin = this.toLinear(g);
        bLin = this.toLinear(b);
        
        return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
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

    toLinear: function(value) {
        if ( value <= 0.04045 ) {
            return value / 12.92;
        } else {
            return Math.pow((( value + 0.055)/1.055),2.4);
        }
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
            
            if (!this.isHex(hexString)) {
                this.emptyObj();
                return this;
            }
            
            this.hex = new hex(hexString);
            this.rgb = new rgb(this.hex.toRgb());
            this.colorObj(this.rgb.a);
    
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
            
            if (!this.isHex(hexString)) {
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
            this.colorObj(this.rgb.a);
    
            return this;
        }
        
        let testHex = ['value','a'];
        
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
            
            if (!this.isHex(hexString)) {
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
            this.colorObj(this.rgb.a);
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
                this.rgb = new rgb({r: arr[0], g: arr[1], b: arr[2], a: alpha});
            } else {
                this.rgb = new rgb({r : arr[0], g : arr[1], b : arr[2]});
            }

            this.colorObj(alpha);
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
                this.rgb = new rgb({r: color[0], g: color[1], b: color[2], a: alpha});
            } else {
                this.rgb = new rgb({r : color[0], g : color[1], b : color[2]});
            }
            
            this.colorObj(alpha);
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
                this.rgb = new rgb({r: arr[0], g: arr[1], b: arr[2], a: alpha});
            } else {
                this.rgb = new rgb({r : arr[0], g : arr[1], b : arr[2]});
            }
            this.colorObj(alpha);

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
                this.hsl = new hsl({h: Number(arr[0]), s: Number(arr[1]), l: Number(arr[2]), a: alpha})
                this.rgb = new rgb(this.hsl.toRgb());
            } else {
                this.hsl = new hsl({h: Number(arr[0]), s: Number(arr[1]), l: Number(arr[2])})
                this.rgb = new rgb(this.hsl.toRgb());
            }

            this.colorObj(alpha);
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
                this.hsl = new hsl({h: Number(color[0]), s: Number(color[1]), l: Number(color[2]), a: alpha})
                this.rgb = new rgb(this.hsl.toRgb());
            } else {
                this.hsl = new hsl({h: Number(color[0]), s: Number(color[1]), l: Number(color[2])})
                this.rgb = new rgb(this.hsl.toRgb());
            }

            this.colorObj(alpha);
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
                this.hsl = new hsl({h: Number(arr[0]), s: Number(arr[1]), l: Number(arr[2]), a: alpha})
                this.rgb = new rgb(this.hsl.toRgb());
            } else {
                this.hsl = new hsl({h: Number(arr[0]), s: Number(arr[1]), l: Number(arr[2])})
                this.rgb = new rgb(this.hsl.toRgb());
            }

            this.colorObj(alpha);
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
                this.hsv = new hsv({h: Number(arr[0]), s: Number(arr[1]), v: Number(arr[2]), a: alpha})
                this.rgb = new rgb(this.hsv.toRgb());
            } else {
                this.hsv = new hsv({h: Number(arr[0]), s: Number(arr[1]), v: Number(arr[2])})
                this.rgb = new rgb(this.hsv.toRgb());
            }

            this.colorObj(alpha);
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
                this.hsv = new hsv({h: Number(color[0]), s: Number(color[1]), v: Number(color[2]), a: alpha})
                this.rgb = new rgb(this.hsv.toRgb());
            } else {
                this.hsv = new hsv({h: Number(color[0]), s: Number(color[1]), v: Number(color[2])})
                this.rgb = new rgb(this.hsv.toRgb());
            }

            this.colorObj(alpha);
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
                this.hsv = new hsv({h: Number(arr[0]), s: Number(arr[1]), v: Number(arr[2]), a: alpha})
                this.rgb = new rgb(this.hsv.toRgb());
            } else {
                this.hsv = new hsv({h: Number(arr[0]), s: Number(arr[1]), v: Number(arr[2])})
                this.rgb = new rgb(this.hsv.toRgb());
            }

            this.colorObj(alpha);
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
                this.hwb = new hwb({h: Number(arr[0]), w: Number(arr[1]), b: Number(arr[2]), a: alpha})
                this.rgb = new rgb(this.hwb.toRgb());
            } else {
                this.hwb = new hwb({h: Number(arr[0]), w: Number(arr[1]), b: Number(arr[2])})
                this.rgb = new rgb(this.hwb.toRgb());
            }
            
            this.colorObj(alpha);
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
                this.hwb = new hwb({h: Number(color[0]), w: Number(color[1]), b: Number(color[2]), a: alpha})
                this.rgb = new rgb(this.hwb.toRgb());
            } else {
                this.hwb = new hwb({h: Number(color[0]), w: Number(color[1]), b: Number(color[2])})
                this.rgb = new rgb(this.hwb.toRgb());
            }

            this.colorObj(alpha);
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
                this.hwb = new hwb({h: Number(arr[0]), w: Number(arr[1]), b: Number(arr[2]), a: alpha})
                this.rgb = new rgb(this.hwb.toRgb());
            } else {
                this.hwb = new hwb({h: Number(arr[0]), w: Number(arr[1]), b: Number(arr[2])})
                this.rgb = new rgb(this.hwb.toRgb());
            }

            this.colorObj(alpha);
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
                this.cmyk = new cmyk({c: Number(arr[0]), m: Number(arr[1]), y: Number(arr[2]), k: Number(arr[3]), a: alpha});
                this.rgb = new rgb(this.cmyk.toRgb());
            } else {
                this.cmyk = new cmyk({c: Number(arr[0]), m: Number(arr[1]), y: Number(arr[2]), k: Number(arr[3])});
                this.rgb = new rgb(this.cmyk.toRgb());
            }

            this.colorObj(alpha);
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
                this.cmyk = new cmyk({c: Number(color[0]), m: Number(color[1]), y: Number(color[2]), k: Number(color[3]), a: alpha});
            this.rgb = new rgb(this.cmyk.toRgb());
            } else {
                this.cmyk = new cmyk({c: Number(color[0]), m: Number(color[1]), y: Number(color[2]), k: Number(color[3])});
                this.rgb = new rgb(this.cmyk.toRgb());
            }

            this.colorObj(alpha);
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
                this.cmyk = new cmyk({c: Number(arr[0]), m: Number(arr[1]), y: Number(arr[2]), k: Number(arr[3]), a: alpha});
                this.rgb = new rgb(this.cmyk.toRgb());
            } else {
                this.cmyk = new cmyk({c: Number(arr[0]), m: Number(arr[1]), y: Number(arr[2]), k: Number(arr[3])});
                this.rgb = new rgb(this.cmyk.toRgb());
            }

            this.colorObj(alpha);
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
                this.ncol = new ncol({ncol: arr[0], w: arr[1], b: arr[2], a: alpha});
                this.rgb = new rgb(this.ncol.toRgb());
            } else {
                this.ncol = new ncol({ncol: arr[0], w: arr[1], b: arr[2]});
                this.rgb = new rgb(this.ncol.toRgb());
            }

            this.colorObj(alpha);
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
                this.ncol = new ncol({ncol: color[0], w: color[1], b: color[2], a: alpha});
                this.rgb = new rgb(this.ncol.toRgb());
            } else {
                this.ncol = new ncol({ncol: color[0], w: color[1], b: color[2]});
                this.rgb = new rgb(this.ncol.toRgb());
            }

            this.colorObj(alpha);
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
                this.ncol = new ncol({ncol: arr[0], w: arr[1], b: arr[2], a: alpha});
                this.rgb = new rgb(this.ncol.toRgb());
            } else {
                this.ncol = new ncol({ncol: arr[0], w: arr[1], b: arr[2]});
                this.rgb = new rgb(this.ncol.toRgb());
            }

            this.colorObj(alpha);
        } else {
            this.emptyObj();
        }
        return this;
    },

    setNAME: function(color) {
        // Set the NAME value from a string
        if (typeof color === 'string') {
            let i, alpha, colorName, colorhexs, result, match = false, colornames = this.getColorArr('names');

            // Search for color name
            for (i = 0; i < colornames.length; i++) {
                if (color.toLowerCase() === colornames[i].toLowerCase()) {
                    colorName = colornames[i];
                    colorhexs = this.getColorArr('hexs')[i];
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
                this.colorObj(alpha, colorName);
                return this;
            } else {
                this.emptyObj();
                return this;
            }
        }
        
        // Set the NAME value from an array
        if (Array.isArray(color)) {
            let i, alpha, opacity, colorName, colorhexs, result, match = false, colornames = this.getColorArr('names');
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
                    colorhexs = this.getColorArr('hexs')[i];
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
                this.colorObj(alpha, colorName);
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
            let arr = [], alpha, opacity, i, colorName, colorhexs, result, match = false, colornames = this.getColorArr('names');
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
                    colorhexs = this.getColorArr('hexs')[i];
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
                this.colorObj(alpha, colorName);
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
    alpha(alpha = undefined) {
        this.a = alpha;

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
                    let alpha = (this.a * 255).toFixed(3).toString(16);
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
            this.a = alpha;
        } else if (value.length === 8) {
            result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value)
            this.value = `${result[1]}${result[2]}${result[3]}`
            a = parseInt(result[4], 16)
            this.a = +(a / 255).toFixed(3);
        }
    }

    toRgb() {
        let result, alpha, arr = [];
        if (this.value.length === 6 && this.a === undefined) {
            result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.value);
            arr[0] = parseInt(result[1], 16);
            arr[1] = parseInt(result[2], 16);
            arr[2] = parseInt(result[3], 16);
            
            return {
                r : Number(arr[0].toFixed(3)),
                g : Number(arr[1].toFixed(3)),
                b : Number(arr[2].toFixed(3))
            };

        } else {
            result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.value);
            arr[0] = parseInt(result[1], 16);
            arr[1] = parseInt(result[2], 16);
            arr[2] = parseInt(result[3], 16);
            alpha = this.a;
            
            return {
                r: Number(arr[0].toFixed(3)),
                g: Number(arr[1].toFixed(3)),
                b: Number(arr[2].toFixed(3)),
                a: alpha
            };
        }
    }
}

class rgb extends ColorObject
{
    constructor({r, g, b, a = undefined}) {
        super();
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
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

        if(this.a) {
            byte4 = Math.round(this.a * 255).toString(16);
            return `${byte1}${byte2}${byte3}${byte4}`;
        }
        return `${byte1}${byte2}${byte3}`;
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
        if (this.a) return {h:Number(h.toFixed(3)), s:Number(s.toFixed(3)), l:Number(l.toFixed(3)), a: this.a};
        return {h:Number(h.toFixed(3)), s:Number(s.toFixed(3)), l:Number(l.toFixed(3))};
    }

    toHsv() {
        let {h, min, max} = this.toHue(), s, v;
        v = (min + max) / 2;
        if (min == max) {
          s = 0;
        } else {
          if (v < 0.5) {
            s = (max - min) / (max + min);
          } else {
            s = (max - min) / (2 - max - min);
          }
        }
        s = s;
        
        if (this.a) return {h:Number(h.toFixed(3)), s:Number(s.toFixed(3)), v:Number(v.toFixed(3)), a: this.a};
        return {h:Number(h.toFixed(3)), s:Number(s.toFixed(3)), v:Number(v.toFixed(3))};
    }
    
    toHwb() {
        let {h, min, max} = this.toHue(), w, bl;
        w = min;
        bl = 1 - max;

        if (this.a) return {h:Number(h.toFixed(3)), w:Number(w.toFixed(3)), b: Number(bl.toFixed(3)), a: this.a};
        return {h:Number(h.toFixed(3)), w:Number(w.toFixed(3)), b: Number(bl.toFixed(3))};
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

        if (this.a) return {c:Number(c.toFixed(3)), m:Number(m.toFixed(3)), y:Number(y.toFixed(3)), k:Number(k.toFixed(3)), a: this.a};
        return {c:Number(c.toFixed(3)), m:Number(m.toFixed(3)), y:Number(y.toFixed(3)), k:Number(k.toFixed(3))};
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
        
        if (this.a) return {ncol, w:Number(w.toFixed(3)), b: Number(bl.toFixed(3)), a: this.a};
        return {ncol, w:Number(w.toFixed(3)), b: Number(bl.toFixed(3))};
    }
}

class hsl extends ColorObject
{
    constructor({h, s, l, a = undefined}) {
        super();
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
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

        if (this.a) return {r:Number(r.toFixed(3)), g:Number(g.toFixed(3)), b:Number(b.toFixed(3)), a:this.a};
        return {r:Number(r.toFixed(3)), g:Number(g.toFixed(3)), b:Number(b.toFixed(3))};
    }
}

class hsv extends ColorObject
{
    constructor({h, s, v, a = undefined}) {
        super();
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }

    toRgb() {
        let t1, t2, r, g, b, hue;
        hue = this.h / 60;
        if ( this.v <= 0.5 ) {
          t2 = this.v * (this.s + 1);
        } else {
          t2 = this.v + this.s - (this.v * this.s);
        }
        t1 = this.v * 2 - t2;

        r = this.hueConv(t1, t2, hue + 2) * 255;
        g = this.hueConv(t1, t2, hue) * 255;
        b = this.hueConv(t1, t2, hue - 2) * 255;

        if (this.a) return {r:Number(r.toFixed(3)), g:Number(g.toFixed(3)), b:Number(b.toFixed(3)), a:this.a};
        return {r:Number(r.toFixed(3)), g:Number(g.toFixed(3)), b:Number(b.toFixed(3))};
    }
}

class hwb extends ColorObject
{
    constructor({h, w, b, a = undefined}) {
        super();
        this.h = h;
        this.w = w;
        this.b = b;
        this.a = a;
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

        if (this.a) return {r: Number(rgbArr[0].toFixed(3)), g: Number(rgbArr[1].toFixed(3)), b: Number(rgbArr[2].toFixed(3)), a: this.a };
        return {r: Number(rgbArr[0].toFixed(3)), g: Number(rgbArr[1].toFixed(3)), b: Number(rgbArr[2].toFixed(3)) };
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

        if (this.a) return {ncol, w: Number(this.w.toFixed(3)), b: Number(this.b.toFixed(3)), a: this.a};
        return {ncol, w: Number(this.w.toFixed(3)), b: Number(this.b.toFixed(3))};
    }
}

class cmyk extends ColorObject
{
    constructor({c, m, y, k, a = undefined}) {
        super();
        this.c = c;
        this.m = m;
        this.y = y;
        this.k = k;
        this.a = a;
    }

    toRgb() {
        let r, g, b;
        r = 255 - ((Math.min(1, this.c * (1 - this.k) + this.k)) * 255);
        g = 255 - ((Math.min(1, this.m * (1 - this.k) + this.k)) * 255);
        b = 255 - ((Math.min(1, this.y * (1 - this.k) + this.k)) * 255);

        if (this.a) return {r: Number(r.toFixed(3)), g: Number(g.toFixed(3)), b: Number(b.toFixed(3)), a: this.a};
        return {r:Number(r.toFixed(3)), g:Number(g.toFixed(3)), b:Number(b.toFixed(3))};
    }
}

class ncol extends ColorObject
{
    constructor({ncol, w, b, a = undefined}) {
        super();
        this.ncol = ncol;
        this.w = w;
        this.b = b;
        this.a = a;
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

        if (this.a) return new hwb({h:Number(h.toFixed(3)), w:Number(w.toFixed(3)), b:Number(b.toFixed(3)), a: this.a}).toRgb();
        return new hwb({h:Number(h.toFixed(3)), w:Number(w.toFixed(3)), b:Number(b.toFixed(3))}).toRgb();
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

function convertToDegree(value) {
    let degree;
    if (typeof value === 'string' && value.indexOf("deg") > -1) {
        degree = value.substring(0,value.length - 3);
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

export default Color;