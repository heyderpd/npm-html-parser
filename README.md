# HTML-PARSE-REGEX

Create tree object of html/xml raw file.
Each node have:
    tag name
    all params tag parsed to a js object
    link to inner tags

##To create tree from raw html/xml
Example:
```javascript
import fs from 'fs';
import { parse } from 'html-parse-regex';

const htmlRaw = fs.readFileSync(`index.html`, 'utf8');
const html = parse(html);
```
