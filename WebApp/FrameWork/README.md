**TECHNOLOGIES**
- AngularJS
- Using theme: http://yukon.tzdthemes.com/

**INSTALLATION**
`
$ npm install -g gulp requirejs
$ npm install
`

**RUN APP**
`
$ gulp
`

**How to Deploy**
- Update version in package.json before deploy to prevent caching
- Local deploy

`
$ del node_modules\.bin\r.js
$ gulp deploy --open=true
`

- Production deploy

`
$ del node_modules\.bin\r.js
$ gulp deploy --prod=true --open=true
`

- NOTES: Update version in package.json before deployment to prevent caching
