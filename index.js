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

class Color
{
    /**
     * Constructor for Color Class. Takes in a color as a css
     * formatted string and creates a color object.
     * 
     * @param String color 
     */
    constructor(color) {
        // Take in a string or object
        let type = typeof color;
        if (type === 'string') {
            this.getColorString(color);
        } else if (type === 'object') {
            this.getColorObject(color);
            // this.attachValues(this.getColorObject(color));
        }
    }

    getColorString(color) {
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
        alpha = 1;
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
                    hexString = hexString.substring(0,1) + hexString.substring(0,1) + hexString.substring(1,1) + hexString.substring(1,1) + hexString.substring(2,1) + hexString.substring(2,1);
                } else if (hexString.length === 4) {
                    hexString = hexString.substring(0,1) + hexString.substring(0,1) + hexString.substring(1,1) + hexString.substring(1,1) + hexString.substring(2,1) + hexString.substring(2,1) + hexString.substring(3,1) + hexString.substring(3,1);
                }

                for (i = 0; i < hexString.length; i++) {
                    if (!this.isHex(hexString.substr(i, 1))) {
                        this.elements = this.emptyObj();
                        return this;
                    }
                }

                if (hexString.length === 6) {
                    result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString)
                    arr[0] = parseInt(result[1], 16)
                    arr[1] = parseInt(result[2], 16)
                    arr[2] = parseInt(result[3], 16)
                    for (i = 0; i < 3; i++) {
                        if (isNaN(arr[i])) {
                            this.elements = this.emptyObj();
                            return this;
                        }
                    }
                    this.rgb = new rgb({
                        r : arr[0],
                        g : arr[1],
                        b : arr[2]
                    });
                } else if (hexString.length === 8) {
                    opacity = true;
                    result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString)
                    arr[0] = parseInt(result[1], 16)
                    arr[1] = parseInt(result[2], 16)
                    arr[2] = parseInt(result[3], 16)
                    alpha = parseInt(result[4], 16)
                    alpha = +(alpha / 255).toFixed(3);
                    for (i = 0; i < 3; i++) {
                        if (isNaN(arr[i])) {
                            this.elements = this.emptyObj();
                            return this;
                        }
                    }
                    this.rgb = new rgb({
                        r : arr[0],
                        g : arr[1],
                        b : arr[2]
                    });
                }
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
        this.elements = this.colorObj(alpha, hue, sat, colorName);
        return this;
    }

    getColorObject(color) {
        let keys = Object.keys(color);
        console.log(keys)
    }

    colorObj(alpha, name) {
        if (alpha === null) {alpha = 1;}
        this.rgb.alpha(alpha)
        this.hsl = new hsl(this.rgb.toHsl());
        this.hwb = new hwb(this.rgb.toHwb());
        this.cmyk = new cmyk(this.rgb.toCmyk());
        hue = this.hsl.h;
        sat = this.hsl.s;
        this.ncol = new ncol(this.hwb.toNcol());

        return {
            red : this.rgb.r,
            green : this.rgb.g,
            blue : this.rgb.b,
            hue : hue,
            sat : sat,
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
    }

    emptyObj() {
        return {
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
            opacity : 1,
            valid : false
        };
    }

    getColorArr(x) {
        if (x == "names") {return ['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen']; }
        if (x == "hexs") {return ['f0f8ff','faebd7','00ffff','7fffd4','f0ffff','f5f5dc','ffe4c4','000000','ffebcd','0000ff','8a2be2','a52a2a','deb887','5f9ea0','7fff00','d2691e','ff7f50','6495ed','fff8dc','dc143c','00ffff','00008b','008b8b','b8860b','a9a9a9','a9a9a9','006400','bdb76b','8b008b','556b2f','ff8c00','9932cc','8b0000','e9967a','8fbc8f','483d8b','2f4f4f','2f4f4f','00ced1','9400d3','ff1493','00bfff','696969','696969','1e90ff','b22222','fffaf0','228b22','ff00ff','dcdcdc','f8f8ff','ffd700','daa520','808080','808080','008000','adff2f','f0fff0','ff69b4','cd5c5c','4b0082','fffff0','f0e68c','e6e6fa','fff0f5','7cfc00','fffacd','add8e6','f08080','e0ffff','fafad2','d3d3d3','d3d3d3','90ee90','ffb6c1','ffa07a','20b2aa','87cefa','778899','778899','b0c4de','ffffe0','00ff00','32cd32','faf0e6','ff00ff','800000','66cdaa','0000cd','ba55d3','9370db','3cb371','7b68ee','00fa9a','48d1cc','c71585','191970','f5fffa','ffe4e1','ffe4b5','ffdead','000080','fdf5e6','808000','6b8e23','ffa500','ff4500','da70d6','eee8aa','98fb98','afeeee','db7093','ffefd5','ffdab9','cd853f','ffc0cb','dda0dd','b0e0e6','800080','663399','ff0000','bc8f8f','4169e1','8b4513','fa8072','f4a460','2e8b57','fff5ee','a0522d','c0c0c0','87ceeb','6a5acd','708090','708090','fffafa','00ff7f','4682b4','d2b48c','008080','d8bfd8','ff6347','40e0d0','ee82ee','f5deb3','ffffff','f5f5f5','ffff00','9acd32']; }
    }

    round() {

    }
}

class rgb
{
    constructor({red, blue, green, alpha = 1}) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = alpha;
    }

    alpha(alpha = 1) {
        this.a = alpha;
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
          if (l < 0.5) {
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

class hsl
{
    constructor({hue, saturation, lightness, alpha = 1}) {
        this.h = hue;
        this.s = saturation;
        this.l = lightness;
        this.a = alpha;
    }

    alpha(alpha = 1) {
        this.a = alpha;
    }

    hueConv(t1, t2, hue) {
        if (hue < 0) hue += 6;
        if (hue >= 6) hue -= 6;
        if (hue < 1) return (t2 - t1) * hue + t1;
        else if(hue < 3) return t2;
        else if(hue < 4) return (t2 - t1) * (4 - hue) + t1;
        else return t1;
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

class hsv
{
    constructor({hue, saturation, value, alpha = 1}) {
        this.h = hue;
        this.s = saturation;
        this.v = value;
        this.a = alpha;
    }

    alpha(alpha = 1) {
        this.a = alpha;
    }

    hueConv(t1, t2, hue) {
        if (hue < 0) hue += 6;
        if (hue >= 6) hue -= 6;
        if (hue < 1) return (t2 - t1) * hue + t1;
        else if(hue < 3) return t2;
        else if(hue < 4) return (t2 - t1) * (4 - hue) + t1;
        else return t1;
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

class hwb
{
    constructor({hue, whiteness, blackness, alpha = 1}) {
        this.h = hue;
        this.w = whiteness;
        this.b = blackness;
        this.a = alpha;
    }

    alpha(alpha = 1) {
        this.a = alpha
    }

    hueConv(t1, t2, hue) {
        if (hue < 0) hue += 6;
        if (hue >= 6) hue -= 6;
        if (hue < 1) return (t2 - t1) * hue + t1;
        else if(hue < 3) return t2;
        else if(hue < 4) return (t2 - t1) * (4 - hue) + t1;
        else return t1;
    }

    toRgb(hue, white, black) {
        let i, rgb, rgbArr = [], tot, t1, t2, r, g, b, hue, l = 1, s = 0.50;
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
          white = Number((white / tot).toFixed(2));
          black = Number((black / tot).toFixed(2));
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

class cmyk
{
    constructor({cyan, magenta, yellow, black}) {
        this.c =-cyan;
        this.m = magenta;
        this.y = yellow;
        this.k = black;
    }

    toRgb() {
        let r, g, b;
        r = 255 - ((Math.min(1, this.c * (1 - this.k) + this.k)) * 255);
        g = 255 - ((Math.min(1, this.m * (1 - this.k) + this.k)) * 255);
        b = 255 - ((Math.min(1, this.y * (1 - this.k) + this.k)) * 255);
        return {r, g, b};
    }

    toHsl() {}

    toHsv() {}
    
    toHwb() {}

    toNcol() {}
}

class ncol
{
    constructor({ncol, whiteness, blackness}) {
        this.ncol = ncol;
        this.w = whiteness;
        this.b = blackness;
    }
}


export default Color;