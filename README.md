# HTML-PARSE-REGEX

Create tree object of html/xml raw file.
Each node have:
    tag name
    all params tag parsed to a js object
    link to inner tags

##First Steps
* install node 6
* touch .babelrc
and write in:
```javascript
{
  "presets": ["es2015"]
}
```
* npm install html-parse-regex

##To create tree from raw html/xml
Example:
```javascript
import fs from 'fs';
import { parse } from 'html-parse-regex';

const htmlRaw = fs.readFileSync(`index.html`, 'utf8');
const html = parse(htmlRaw);
```
