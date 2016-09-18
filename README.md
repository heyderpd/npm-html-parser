# HTML-PARSE-REGEX

Create tree object of html/xml raw file.
Each node have:
* tag name
* all params tag parsed to a js object
* link to inner tags

## First Steps NO MORE!
Now use es2015, don't need first steps!
Thanks for:
[npm~lucasmreis](https://www.npmjs.com/~lucasmreis)

npm install npm install html-parse-regex

## Example:
### HTML
```html
[Object1] <div id="A" align="left" style="margin-top:15px;">
  [Object2] <div id="B" class="yttre">
    [Object3] <strong>
                ASCII links
              </strong>
            </div>
          </div>
```

### MAIN DATA OBJECT
```javascript
html { ...
      map: { id:{A:[Object1], B:[Object2]} }, /* link to tag object find by id */
      List: [ /* same object's but in list mode */
        [Object1],
        [Object2],
        [Object3]
      ],
      Objs: {    /* tree view mode */
        [Object1]/* object tag of div#A, base of this example   */
      },         /* inner this you found link for children tags */
... }
```

### TAG OBJECT
```javascript
[Object1] = {
    tag: "div",
    link: {
        up: [],
      down: [[Object2]]
    },
  string: { /* char to start and end the tag in raw file */
      start: 0,
        end: 123
      }
  inner : {
    [Object2]
  }
 params : {id:"A", align:"left", style:"margin-top:15px;"}
}
```

##To create tree from raw html/xml
Example:
```javascript
import fs from 'fs';
import { parse } from 'html-parse-regex';

const htmlRaw = fs.readFileSync(`index.html`, 'utf8');
const html = parse(htmlRaw);
```
