/**
 * A color conversion tool to convert between color types for web css and javascript.
 * The available color conversion types are:
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
    if (typeof color === "object") {return color; }
    this.getColorString(color);
}

Color.prototype = {
    getColorString: function(color) {
        let x, y, type, arr = [], arrLength, i, opacity, match, result, sep, alpha, hue, sat, colorName = undefined, colornames = [], colorhexs = [];
        
        // Check if color is a ncol value
        x = color.substr(0,1).toUpperCase();
        y = color.substr(1);
        if ((x === "R" || x === "Y" || x === "G" || x === "C" || x === "B" || x === "M" || x === "W") && !isNaN(y)) {
          if (color.length === 6 && color.indexOf(",") === -1) {
          } else {
            color = "ncol(" + color + ")";
          }
        }
        if (color.length != 3 && color.length != 6 && !isNaN(color)) {color = "ncol(" + color + ")";}
        if (color.indexOf(",") > 0 && color.indexOf("(") == -1) {color = "ncol(" + color + ")";}

        // Check if color is hex value
        if (color.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)) {
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
        alpha = undefined;
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

        switch (type) {
            case 'hex':
                let hexString = color.split('#')[1];
                
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
                    this.elements = this.emptyObj();
                    return this;
                }
                
                this.hex = new hex(hexString);
                this.rgb = new rgb(this.hex.toRgb());
                alpha = this.rgb.a;
                
                break;

            case 'rgb':
            case 'rgba':
                if (arr.length != arrLength) {
                    this.elements = this.emptyObj();
                    return this
                }
                for (i = 0; i < arrLength; i++) {
                    if (arr[i] === "" || arr[i] === " ") {arr[i] = "0"; }
                    if (arr[i].indexOf("%") > -1) {
                        arr[i] = arr[i].replace("%", "");
                        arr[i] = Number(arr[i] / 100);
                        if (i < 3 ) {arr[i] = Math.round(arr[i] * 255);}
                    }
                    if (isNaN(arr[i])) {
                        this.elements = this.emptyObj();
                        return this;
                    }
                    if (parseInt(arr[i]) > 255) {arr[i] = 255; }
                    if (i < 3) {arr[i] = parseInt(arr[i]);}
                    if (i === 3 && Number(arr[i]) > 1) {arr[i] = 1;}
                }
                this.rgb = new rgb({r : arr[0], g : arr[1], b : arr[2]});
                if (opacity == true) {alpha = Number(arr[3]);}

                break;

            case 'hsl':
            case 'hsla':
            case 'hwb':
            case 'hwba':
            case 'ncol':
                while (arr.length < arrLength) {arr.push("0"); }
                if (type === "hsl" || type === "hwb") {
                    // Strip label and convert to degrees (if necessary)
                    if (arr[0].indexOf("deg") > -1) {
                        arr[0] = arr[0].substring(0,arr[0].length - 3);
                    } else if (arr[0].indexOf("rad") > -1) {
                        arr[0] = Math.round(arr[0].substring(0,arr[0].length - 3) * (180 / Math.PI));
                    } else if (arr[0].indexOf("turn") > -1) {
                        arr[0] = Math.round(arr[0].substring(0,arr[0].length - 4) * 360);
                    }

                    if (arr[0] >= 360) {
                        arr[0] %= 360;
                    }
                }
                for (i = 1; i < arrLength; i++) {
                    if (arr[i].indexOf("%") > -1) {
                        arr[i] = arr[i].replace("%", "");
                        arr[i] = Number(arr[i]);
                        if (isNaN(arr[i])) {
                            this.elements = this.emptyObj();
                            return this; 
                        }
                        arr[i] = arr[i] / 100;
                    } else {
                        arr[i] = Number(arr[i]);
                    }
                    if (Number(arr[i]) > 1) {arr[i] = 1;}
                    if (Number(arr[i]) < 0) {arr[i] = 0;}
                }
                if (type == "hsl") {
                    this.hsl = new hsl({h: Number(arr[0]), s: Number(arr[1]), l: Number(arr[2])})
                    this.rgb = new rgb(this.hsl.toRgb()); 
                    hue = this.hsl.h; 
                    sat = this.hsl.s;
                }
                if (type == "hwb") {
                    this.hwb = new hwb({h: Number(arr[0]), w: Number(arr[1]), b: Number(arr[2])})
                    this.rgb = new rgb(this.hwb.toRgb());
                }
                if (type == "ncol") {
                    this.ncol = new ncol({ncol: arr[0], w: arr[1], b: arr[2]});
                    this.rgb = new rgb(this.ncol.toRgb());
                }
                if (opacity == true) {
                    alpha = Number(arr[3]);
                }
                break;

            case 'cmyk':
                while (arr.length < arrLength) {arr.push("0"); }
                for (i = 0; i < arrLength; i++) {
                    if (arr[i].indexOf("%") > -1) {
                        arr[i] = arr[i].replace("%", "");
                        arr[i] = Number(arr[i]);
                        if (isNaN(arr[i])) {return this.emptyObj(); }
                        arr[i] = arr[i] / 100;
                    } else {
                        arr[i] = Number(arr[i]);
                    }
                    if (Number(arr[i]) > 1) {arr[i] = 1;}
                    if (Number(arr[i]) < 0) {arr[i] = 0;}
                }
                this.cmyk = new cmyk({c: Number(arr[0]), m: Number(arr[1]), y: Number(arr[2]), k: Number(arr[3])});
                this.rgb = this.cmyk.toRgb();
                if (opacity == true) {alpha = Number(arr[4]);}
                break;

            default:
                match = false;
                colornames = this.getColorArr('names');
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
                if (match == false) {
                    this.elements = this.emptyObj();
                    return this;
                }
        }
        this.colorObj(alpha, colorName);
        return this;
    },

    getColorName: function() {
        let hexs, colorName, colorHex, i;
        hexs = this.getColorArr('hexs');
        
        for (i = 0; i < hexs.length; i++) {
            if (this.hex.value.toLowerCase() === hexs[i].toLowerCase()) {
                colorHex = hexs[i];
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
        }
        if (this.hwb && !this.ncol) {
            this.ncol = new ncol(this.hwb.toNcol());
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
            lightness : this.hsl.l,
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
        return {
            hex: 0,
            red : 0,
            green : 0,
            blue : 0,
            hue : 0,
            sat : 0,
            lightness : 0,
            whiteness : 0,
            blackness : 0,
            cyan : 0,
            magenta : 0,
            yellow : 0,
            black : 0,
            opacity : undefined,
            name: undefined,
            valid : false
        };
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
        return this.lightness() > 50
    },

    isDark: function() {
        return this.lightness() <= 50
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

    lightness: function() {
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
        this.elements = {
            red : Number(this.elements.red.toFixed(0)),
            green : Number(this.elements.green.toFixed(0)),
            blue : Number(this.elements.blue.toFixed(0)),
            hue : Number(this.elements.hue.toFixed(0)),
            sat : Number(this.elements.sat.toFixed(2)),
            lightness : Number(this.elements.lightness.toFixed(2)),
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

    },

    setRGB: function(color) {

    },

    setHSL: function(color) {

    },

    setHSV: function(color) {

    },

    setHWB: function(color) {

    },

    setCMYK: function(color) {

    },

    setNCOL: function(color) {

    },

    setNAME: function(color) {

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

    toString() {
        switch (this.constructor.name){
            case 'hex':
                if (this.a) {
                    let alpha = (this.a * 255).toFixed(3).toString(16);
                    return `#${this.value}${alpha}`;
                }
                return `#${this.value}`;
            case 'rgb':
                if (this.a) return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
                return `rgb(${this.r}, ${this.g}, ${this.b})`;
            case 'hsl':
                if (this.a) return `hsla(${this.h}, ${Math.round(this.s * 100)}%, ${Math.round(this.l * 100)}%, ${this.a})`;
                return `hsl(${this.h}, ${Math.round(this.s * 100)}%, ${Math.round(this.l * 100)}%)`;
            case 'hsv':
                if (this.a) return `hsva(${this.h}, ${Math.round(this.s * 100)}%, ${Math.round(this.v * 100)}%, ${this.a})`;
                return `hsv(${this.h}, ${Math.round(this.s * 100)}%, ${Math.round(this.v * 100)}%)`;
            case 'hwb':
                if (this.a) return `hwba(${this.h}, ${Math.round(this.w * 100)}%, ${Math.round(this.b * 100)}%, ${this.a})`;
                return `hwb(${this.h}, ${Math.round(this.w * 100)}%, ${Math.round(this.b * 100)}%)`;
            case 'cmyk':
                return `cmyk(${Math.round(this.c)}%, ${Math.round(this.m)}%, ${Math.round(this.y)}%, ${Math.round(this.k)}%)`;
            case 'ncol':
                if (this.a) return `ncola(${this.ncol}, ${Math.round(this.w * 100)}%, ${Math.round(this.b * 100)}%, ${this.a})`;
                return `ncol(${this.ncol}, ${Math.round(this.w * 100)}%, ${Math.round(this.b * 100)}%)`;
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
        if (this.value.length === 6) {
            result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.value)
            arr[0] = parseInt(result[1], 16)
            arr[1] = parseInt(result[2], 16)
            arr[2] = parseInt(result[3], 16)
            
            return {
                r : arr[0],
                g : arr[1],
                b : arr[2]
            };

        } else if (this.value.length === 8) {
            result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.value)
            arr[0] = parseInt(result[1], 16)
            arr[1] = parseInt(result[2], 16)
            arr[2] = parseInt(result[3], 16)
            alpha = parseInt(result[4], 16)
            alpha = +(alpha / 255).toFixed(3);
            
            return {
                r: arr[0],
                g: arr[1],
                b: arr[2],
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

    toHex() {
        let byte1, byte2, byte3, byte4;
        byte1 = this.r.toString(16);
        byte2 = this.g.toString(16);
        byte3 = this.b.toString(16);
        if(this.a) {
            byte4 = (this.a * 255).toFixed(3).toString(16);
            return `${byte1}${byte2}${byte3}${byte4}`;
        }

        return `${byte1}${byte2}${byte3}`;
    }

    toHsl() {
        let min, max, i, l, s, maxcolor, h, rgb = [];
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
        return {h, s, l};
    }

    toHsv() {
        let min, max, i, v, s, maxcolor, h, rgb = [];
        rgb[0] = this.r / 255;
        rgb[1] = this.g / 255;
        rgb[2] = this.b / 255;
        min = rgb[0];
        max = rgb[0];
        maxcolor = 0;
        for (i = 0; i < rgb.length - 1; i++) {
          if (rgb[i + 1] <= min) {min = rgb[i + 1];}
          if (rgb[i + 1] >= max) {max = rgb[i + 1]; maxcolor = i + 1;}
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
        return {h, s, v};
    }
    
    toHwb() {
        let h, w, bl, min, max, chroma, r, g, b;
        r = this.r / 255;
        g = this.g / 255;
        b = this.b / 255;
        max = Math.max(r, g, b);
        min = Math.min(r, g, b);
        chroma = max - min;
        if (chroma == 0) {
          h = 0;
        } else if (r == max) {
          h = (((g - b) / chroma) % 6) * 360;
        } else if (g == max) {
          h = ((((b - r) / chroma) + 2) % 6) * 360;
        } else {
          h = ((((r - g) / chroma) + 4) % 6) * 360;
        }
        w = min;
        bl = 1 - max;
        return {h, w, b: bl};
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
        return {c, m, y, k};
    }

    toNcol() {
        let hue, w, bl, min, max, chroma, r, g, b, ncol;
        r = this.r / 255;
        g = this.g / 255;
        b = this.b / 255;
        max = Math.max(r, g, b);
        min = Math.min(r, g, b);
        chroma = max - min;
        if (chroma == 0) {
          hue = 0;
        } else if (r == max) {
          hue = (((g - b) / chroma) % 6) * 360;
        } else if (g == max) {
          hue = ((((b - r) / chroma) + 2) % 6) * 360;
        } else {
          hue = ((((r - g) / chroma) + 4) % 6) * 360;
        }
        w = min;
        bl = 1 - max;

        while (hue >= 360) {
            hue = hue - 360;
        }
        if (hue < 60) {ncol = "R" + (hue / 0.6); }
        if (hue < 120) {ncol = "Y" + ((hue - 60) / 0.6); }
        if (hue < 180) {ncol = "G" + ((hue - 120) / 0.6); }
        if (hue < 240) {ncol = "C" + ((hue - 180) / 0.6); }
        if (hue < 300) {ncol = "B" + ((hue - 240) / 0.6); }
        if (hue < 360) {ncol = "M" + ((hue - 300) / 0.6); }
        return {ncol, w, b: bl};
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
        return {r, g, b};
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
        return {r, g, b};
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
        let i, rgbArr = [], tot, t1, t2, r, g, b, hue, white = this.w, black = this.b, l = 1, s = 0.50;
        hue = this.h / 60;
        if ( l <= 0.5 ) {
          t2 = l * (s + 1);
        } else {
          t2 = l + s - (l * s);
        }
        t1 = l * 2 - t2;

        r = this.hueConv(t1, t2, hue + 2) * 255;
        g = this.hueConv(t1, t2, hue) * 255;
        b = this.hueConv(t1, t2, hue - 2) * 255;

        rgbArr[0] = r / 255;
        rgbArr[1] = g / 255;
        rgbArr[2] = b / 255;
        tot = white + black;
        if (tot > 1) {
          white = Number((this.w / tot).toFixed(2));
          black = Number((this.b / tot).toFixed(2));
        }
        for (i = 0; i < 3; i++) {
          rgbArr[i] *= (1 - (white) - (black));
          rgbArr[i] += (white);
          rgbArr[i] = Number(rgbArr[i] * 255);
        }
        return {r : rgbArr[0], g : rgbArr[1], b : rgbArr[2] };
    }

    toNcol() {
        let hue, ncol;
        hue = this.h;
        while (hue >= 360) {
            hue = hue - 360;
        }
        if (hue < 60) {ncol = "R" + (hue / 0.6); }
        if (hue < 120) {ncol = "Y" + ((hue - 60) / 0.6); }
        if (hue < 180) {ncol = "G" + ((hue - 120) / 0.6); }
        if (hue < 240) {ncol = "C" + ((hue - 180) / 0.6); }
        if (hue < 300) {ncol = "B" + ((hue - 240) / 0.6); }
        if (hue < 360) {ncol = "M" + ((hue - 300) / 0.6); }

        return {ncol, w: this.w, b: this.b}
    }
}

class cmyk extends ColorObject
{
    constructor({c, m, y, k}) {
        super();
        this.c = c;
        this.m = m;
        this.y = y;
        this.k = k;
    }

    toRgb() {
        let r, g, b;
        r = 255 - ((Math.min(1, this.c * (1 - this.k) + this.k)) * 255);
        g = 255 - ((Math.min(1, this.m * (1 - this.k) + this.k)) * 255);
        b = 255 - ((Math.min(1, this.y * (1 - this.k) + this.k)) * 255);
        return {r, g, b};
    }
}

class ncol extends ColorObject
{
    constructor({ncol, w, b, a = 1}) {
        super();
        this.ncol = ncol;
        this.w = w;
        this.b = b;
        this.a = a;
    }

    toRgb() {
        let letter, percent, h, hwhbl;
        h = this.ncol;
        if (isNaN(this.ncol.substr(0,1))) {
          letter = this.ncol.substr(0,1).toUpperCase();
          percent = this.ncol.substr(1);
          if (percent === "") {percent = 0;}
          percent = Number(percent);
          if (isNaN(percent)) {return false;}
          if (letter == "R") {h = 0 + (percent * 0.6);}
          if (letter == "Y") {h = 60 + (percent * 0.6);}
          if (letter == "G") {h = 120 + (percent * 0.6);}
          if (letter == "C") {h = 180 + (percent * 0.6);}
          if (letter == "B") {h = 240 + (percent * 0.6);}
          if (letter == "M") {h = 300 + (percent * 0.6);}
          if (letter == "W") {
            h = 0;
            white = 1 - (percent / 100);
            black = (percent / 100);
          }
        }

        hwhbl = new hwb(h, white, black)

        return new hwb(h, white, black).toRgb();
    }
}

export default Color;