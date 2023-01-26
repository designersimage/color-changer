# color-changer

A zero-dependancy, light-weight color modification library to convert between color types and modify color attributes for javascript. This tool can take in a css color string or an object and convert it between several different color specifications including `hex`, `rgb`, `hsl`, and `hsv`.

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

### NAME
    // String
    let color = new Color('DarkSeaGreen');

    // Object 
    let color = new Color({name: 'DarkSeaGreen', a: 0.67})

# Usage
    import Color from 'color-changer';

    // Instantiate Empty Color Object
    let color = new Color();

    // Instatiate Color Object w/ color
    let color = new Color('#3F589F');

## Setters
Set the color by color specification using the following setters. CSS strings, arrays, and objects are allowed using the following format. 

    /* RGB */
    color.setRGB('rgb(143, 188, 143)');
    color.setRGB('rgba(143, 188, 143, 0.67)')
    color.setRGB([143, 188, 143]);
    color.setRGB([143, 188, 143, 0.67]);
    color.setRGB({r: 143, g: 188, b: 143});
    color.setRGB({r: 143, g: 188, b: 143, a: 0.67});

    /* HEX */
    color.setHEX('#8fbc8f');
    color.setHEX('#8fbc8fab');
    color.setHEX(['#8fbc8f']);
    color.setHEX(['#8fbc8f', 0.67]);
    color.setHEX({value: '#8fbc8f'});
    color.setHEX({value: '#8fbc8f', a: 0.67});

    /* HSL */
    color.setHSL('hsl(120, 25%, 65%)');
    color.setHSL('hsla(120, 25%, 65%, 0.67)');
    color.setHSL([120, '25%', '65%']);
    color.setHSL([120, '25%', '65%', 0.67]);
    color.setHSL({h: 120, s: '25%', l: '65%'});
    color.setHSL({h: 120, s: '25%', l: '65%', a: 0.67});

    /* HSV */
    color.setHSV('hsv(120, 25%, 65%)');
    color.setHSV('hsva(120, 25%, 65%, 0.67)');
    color.setHSV([120, '25%', '65%']);
    color.setHSV([120, '25%', '65%', 0.67]);
    color.setHSV({h: 120, s: '25%', v: '65%'});
    color.setHSV({h: 120, s: '25%', v: '65%', a: 0.67});

    /* NAME */
    color.setNAME('DarkSeaGreen');
    color.setNAME(['DarkSeaGreen']);
    color.setNAME(['DarkSeaGreen', 0.67]);
    color.setNAME({name: 'DarkSeaGreen'});
    color.setNAME({name: 'DarkSeaGreen', a: 0.67});

## Getters
Get the specific color object or all of the color elements.

    /* Colors */
    let rgb = color.rgb;
    let hex = color.hex;
    let hsl = color.hsl;
    let hsv = color.hsv;
    
    /* Elements */
    let elements = color.elements;

## CSS Strings
Each color object can be returned as a string with rounded values.

    let color = new Color();
    color.setHEX('#8fbc8f');
    
    console.log(color.hsl.string())     // hsl(120, 25%, 65%)
    console.log(color.hsv.string())     // hsv(120, 24%, 74%)
    console.log(color.rgb.string())     // rgb(143, 188, 143)
    console.log(color.hex.string())     // #8fbc8f

    color.alpha(0.77);

    console.log(color.hsl.string())     // hsla(120, 25%, 65%, 0.77)
    console.log(color.hsv.string())     // hsva(120, 24%, 74%, 0.77)
    console.log(color.rgb.string())     // rgba(143, 188, 143, 0.77)
    console.log(color.hex.string())     // #8fbc8fc4


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
    /* or */
    console.log(color.contrast('black')); // 9.757849865193812

## Dark or Light
Get a boolean return value of whether a color is dark or light.

    let color = new Color();
    color.setHEX('#8fbc8f');

    console.log(color.isDark())     // false
    console.log(color.isLight())    // true

## Color Manipulation
Manipulate to color object directly by altering saturation, lightness, opacity, or hue, negate the color, convert to greyscale, or mix it with another color.

    let color1 = new Color('red'),
        color2 = new Color('yellow');

    /* Manipulate saturation */
    color1.saturate('22%');
    color1.desaturate(.22);

    /* Manipulate hue */
    color1.rotate(90);
    color1.rotate('-240deg');

    /* Manipulate shade & tint */
    color1.lighten(.44);
    color1.darken('44%');

    /* Manipulate opacity */
    color1.fade(0.5);
    color1.opaquer('20%');

    /* Negate color */
    color1.negate();

    /* Convert to greyscale */
    color1.greyscale();

    /* Mix another color */
    color1.mix(color2);
    color1.mix(Color('blue'));
    /* or */
    color1.mix(color2, 'add');  // Additive Mix
    color1.mix(color2, 'sub');  // Subtractive Mix
    /* or */
    color1.mix(color2, 'add', 0.6);  // Additive Mix with 60% of color2
    color1.mix(color2, 'sub', 0.6);  // Subtractive Mix with 60% of color2  

# Credits
This library was inspired by [W3 Color Converter](http://www-db.deis.unibo.it/courses/TW/DOCS/w3schools/colors/colors_converter.asp-color=ncs(0510-G90Y).html#gsc.tab=0) and [color](https://github.com/Qix-/color).

# License
Copyright © 2022, Designer's Image. Licensed under the [MIT License](https://github.com/designersimage/color-changer/blob/main/LICENSE).