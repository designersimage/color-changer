# color-changer

A zero-dependancy color modification library to convert between color types and modify color attributes for web, css, and javascript. This tool can take in a css color string or an object and convert it between several different color specifications.

    import Color from 'color-changer';

    let color = new Color('rgb(140, 200, 100)');

    console.log(color.hex.string()); // #8cc864
    console.log(color.hsl.string()); // hsl(96, 48%, 59%)
    

# Install
    $ npm install color-changer

# Usage
    import Color from 'color-changer'

# License
Copyright © 2022, Jonathan Wheeler. Licensed under the [MIT License]().