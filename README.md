For better integration Parse and Angular you want to check https://github.com/rafbgarcia/angular-parse-wrapper

## Get started

I. Clone the repo and execute:

`$ npm install`

`$ grunt build`

II. Change your keys in `parse/config/global.js` and Gruntfile.js

global.js
```json
"applications": {
  "_default": {
      "link": "parse_angular_bootstrap_development"
  },
  "parse_angular_bootstrap_development": {
      "applicationId": "theAppId",
      "masterKey": "theMasterKey"
  },
  ...
}
```

Gruntfile.js
```javascript
parseApps: {
  'development': 'parse_angular_bootstrap_development',
  'tests': 'parse_angular_bootstrap_tests',
  'staging': 'parse_angular_bootstrap_staging'
},
```

III. Start using

`$ npm start # will start the server`


## Tasks

### Unit tests with Karma

If you want to unit test by watching files changes

`$ grunt test_unit`

If you want to just run it

`$ grunt run_test_unit`


### e2e tests with Protractor

`$ grunt test_functional`

### Deploy

`$ grunt deploy_to_development`

`$ grunt deploy_to_tests`

`$ grunt deploy_to_staging`


## Developers

@cv, @marano, @rafbgarcia


## License

The MIT License

Copyright (c) 2014 Carlos Villela, Thiago Marano, Rafael Garcia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.