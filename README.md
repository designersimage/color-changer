# color-changer

A zero-dependancy color modification library to convert between color types and modify color attributes for web, css, and javascript. This tool can take in a css color string or an object and convert it between several different color specifications.

    import Color from 'color-changer';

    let color = new Color('#8cc864');

    console.log(color.rgb)              // rgb {r: 140, g: 200, b: 100}
    console.log(color.hsl.string());    // hsl(96, 48%, 59%)
    

# Install
    $ npm install color-changer

# Import
    import Color from 'color-changer';

# Instantiate
All percentage values may be represented as a decimal value 0.67 or as a percentage string '67%'.


    // Empty Color Object
    let color = new Color();

### RGB
    // String
    let color = new Color('rgb(143, 188, 143)');
    /* -- or -- */
    let color = new Color('rgba(143, 188, 143, 0.67));

    // Object
    let color = new Color({r: 143, g: 188, b: 143});
    /* -- or -- */
    let color = new Color({r: 143, g: 188, b: 143, a: 0.67});

### HEX
    // String
    let color = new Color('#8fbc8f');
    /* -- or -- */
    let color = new Color('#8fbc8fab');

    // Object
    let color = new Color({value: 8fbc8f});
    /* -- or -- */
    let color = new Color({value: 8fbc8f, a: 0.67});

### HSL
    // String
    let color = new Color('hsl(120, 25%, 65%)');
    /* -- or -- */
    let color = new Color('hsla(120, 25%, 65%, 0.67));

    // Object
    let color = new Color({h: 120, s: '25%', l: '65%'});
    /* -- or -- */
    let color = new Color({h: 120, s: '25%', l: '65%', a: 0.67});

### HSV
    // String
    let color = new Color('hsv(120, 25%, 65%)');
    /* -- or -- */
    let color = new Color('hsva(120, 25%, 65%, 0.67));

    // Object
    let color = new Color({h: 120, s: '25%', v: '65%'});
    /* -- or -- */
    let color = new Color({h: 120, s: '25%', v: '65%', a: 0.67});

### HWB
    // String
    let color = new Color('hwb(120, 56%, 26%)');
    /* -- or -- */
    let color = new Color('hwba(120, 56%, 26%, 0.67));

    // Object
    let color = new Color({h: 120, w: '56%', b: '26%'});
    /* -- or -- */
    let color = new Color({h: 120, w: '56%', b: '26%', a: 0.67});

### NCOL
    // String
    let color = new Color('ncol(G0, 56%, 26%)');
    /* -- or -- */
    let color = new Color('ncola(G0, 56%, 26%, 0.67));

    // Object
    let color = new Color({ncol: 'G0', w: '56%', b: '26%'});
    /* -- or -- */
    let color = new Color({ncol: 'G0', w: '56%', b: '26%', a: 0.67});

### CMYK
    // String
    let color = new Color('cmyk(24%, 0%, 24%, 26%)');
    /* -- or -- */
    let color = new Color('cmyk(24%, 0%, 24%, 26%, 0.67));

    // Object
    let color = new Color({c: '24%', m: '0%', y: '24%', k: '26%'});
    /* -- or -- */
    let color = new Color({c: '24%', m: '0%', y: '24%', k: '26%', a: 0.67});

### NAME
    // String
    let color = new Color('DarkSeaGreen');

    // Object = new Color({name: 'DarkSeaGreen', a: 0.67})

# Usage
    import Color from 'color-changer';

    // Instantiate Empty Color Object
    let color = new Color();

## Setters
Set the color by color specification using the following setters. CSS strings, arrays, and objects are allowed using the following format. 

    /* RGB */
    color.setRGB('rgb(143, 188, 143)');                                 // String
    color.setRGB('rgba(143, 188, 143, 0.67)')
    color.setRGB([143, 188, 143]);                                      // Array
    color.setRGB([143, 188, 143, 0.67]);
    color.setRGB({r: 143, g: 188, b: 143});                             // Object
    color.setRGB({r: 143, g: 188, b: 143, a: 0.67});

    /* HEX */
    color.setHEX('#8fbc8f');                                            // String
    color.setHEX('#8fbc8fab');
    color.setHEX(['#8fbc8f']);                                          // Array
    color.setHEX(['#8fbc8f', 0.67]);
    color.setHEX({value: '#8fbc8f'});                                   // Object
    color.setHEX({value: '#8fbc8f', a: 0.67})

    /* HSL */
    color.setHSL('hsl(120, 25%, 65%)');                                 // String
    color.setHSL('hsla(120, 25%, 65%, 0.67)');
    color.setHSL([120, '25%', '65%']);                                  // Array
    color.setHSL([120, '25%', '65%', 0.67]);
    color.setHSL({h: 120, s: '25%', l: '65%'});                         // Object
    color.setHSL({h: 120, s: '25%', l: '65%', a: 0.67});

    /* HSV */
    color.setHSV('hsv(120, 25%, 65%)');                                 // String
    color.setHSV('hsva(120, 25%, 65%, 0.67)');
    color.setHSV([120, '25%', '65%']);                                  // Array
    color.setHSV([120, '25%', '65%', 0.67]);
    color.setHSV({h: 120, s: '25%', v: '65%'});                         // Object
    color.setHSV({h: 120, s: '25%', v: '65%', a: 0.67});

    /* HWB */
    color.setHWB('hwb(120, 56%, 26%)');                                 // String
    color.setHWB('hwba(120, 56%, 26%, 0.67)');
    color.setHWB([120, '56%', '26%']);                                  // Array
    color.setHWB([120, '56%', '26%', 0.67]);
    color.setHWB({h: 120, w: '56%', b: '26%'});                         // Object
    color.setHWB({h: 120, w: '56%', b: '26%', a: 0.67});

    /* NCOL */  
    color.setNCOL('ncol('G0', 56%, 26%)');                              // String
    color.setNCOL('ncola('G0', 56%, 26%, 0.67)');
    color.setNCOL(['G0', '56%', '26%']);                                // Array
    color.setNCOL(['G0', '56%', '26%', 0.67]);
    color.setNCOL({ncol: 'G0', w: '56%', b: '26%'});                    // Object
    color.setNCOL({ncol: 'G0', w: '56%', b: '26%', a: 0.67});

    /* CMYK */
    color.setCMYK('cmyk(24%, 0%, 24%, 26%)');                           // String
    color.setCMYK('cmyk(24%, 0%, 24%, 26%, 0.67)');
    color.setCMYK(['24%', '0%', '24%', '26%']);                         // Array
    color.setCMYK(['24%', '0%', '24%', '26%', 0.67]);
    color.setCMYK({c: '24%', m: '0%', y: '24%', k: '26%'});             // Object
    color.setCMYK({c: '24%', m: '0%', y: '24%', k: '26%', a: 0.67});

    /* NAME */
    color.setNAME('DarkSeaGreen');                                      // String
    color.setNAME(['DarkSeaGreen']);                                    // Array
    color.setNAME(['DarkSeaGreen', 0.67]);
    color.setNAME({name: 'DarkSeaGreen'});                              // Object
    color.setNAME({name: 'DarkSeaGreen', a: 0.67});

## Getters
Get the specific color object or all of the color elements.

    /* Colors */
    let rgb = color.rgb;
    let hex = color.hex;
    let hsl = color.hsl;
    let hsv = color.hsv;
    let hwb = color.hwb;
    let ncol = color.ncol;
    let cmyk = color.cmyk;
    
    /* Elements */
    let elements = color.elements;

## CSS Strings
Each color object can be returned as a string with rounded values.

    console.log(color.hsl.string())     // hsl(120, 25%, 65%)

## Luminance
Get the relative luminance of the color based on the [WCAG Relative Luminance](https://www.w3.org/TR/WCAG20/#relativeluminancedef) definition. 

    let color = new Color();
    color.setHEX('#8fbc8f');

    /* (Black) 0 <-> 1 (White) */
    console.log(color.luminance()); // 0.43789249325969065

## Contrast Ratio
Get the contrast ratio of two colors base on the [WCAG Contrast Ratio](https://www.w3.org/TR/WCAG20/#contrast-ratiodef) definition.

    let color = new Color();
    color.setHEX('#8fbc8f');

    /* (Same Color) 1 <-> 21 (Black/White) */
    console.log(color.contrast(Color('black'))); // 9.757849865193812

## Dark or Light
Get a boolean return value of whether a color is dark or light.

    let color = new Color();
    color.setHEX('#8fbc8f');

    console.log(color.isDark())     // false
    console.log(color.isLight())    // true

# Credits
This library was inspired by [W3 Color Converter](http://www-db.deis.unibo.it/courses/TW/DOCS/w3schools/colors/colors_converter.asp-color=ncs(0510-G90Y).html#gsc.tab=0) and [color](https://github.com/Qix-/color).

# License
Copyright © 2022, Designer's Image. Licensed under the [MIT License](https://github.com/designersimage/color-changer/blob/main/LICENSE).