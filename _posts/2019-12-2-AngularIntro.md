---
Category: post
title: Learning Journal for Angular Intro
---
## Angular common sense?
1. Angular has a ***Angular Json*** file for all configurations to compile the files
2. Angular has a ***Package Json*** file to build the project (not every package is needed)
3. Angular uses ***TypeScript*** 

  1.TypeScript annotation
  ```
  let decimal: number = 6;
let hex: number = 0xf00d;

function getResult(value: number) : number {
   // get result
}

  
  ```
  2. MetaData annotation/ decorations
  ```
  @Validater({
   checksum: true
})
class CardProcessor {
	…
}

  ```
  3. private modifiers (even in constructor the parameter can be ***private*** class. this way no need to declare the class out of the constructor)
  ```
  class Animal {
    private _name: string;
    constructor(name: string) { this._name = name; }
    move(meters: number) {
        alert(this._name + " moved " + meters + "m.");
    }
}

  ```
  4. Other concepts similar to Java including interfaces, Enums and Generics
  
  5.Namespace: ***Internal modules*** usually only for creating modules for legacy codes
  ![Namespace intro] (https://www.youtube.com/watch?v=4Onwa-Putv4)
![Angular structure](https://github.com/EmilyStacy-droid/EmilyStacy-droid.github.io/blob/master/images/IMG_5314.JPG)
```
namespace Shapes {
    export namespace Polygons {
        export class Triangle { }
        export class Square { }
    }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square();

```

## Angular Key Elements
1. Home.ts(usually App.ts) => Almost all logic will be listed here, including the ***@decorators***. The decorators allows us to ***bind typescript to the HTML template*** ex. creating a disabled button
2. 

## Angular Module

### Component

### Directive

### Pipes 

## Angular Decorator

## Angular Services