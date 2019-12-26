# sim4me

[![npm version](https://img.shields.io/npm/v/sim4me.svg)](https://www.npmjs.com/package/sim4me)
[![install size](https://packagephobia.now.sh/badge?p=sim4me)](https://packagephobia.now.sh/result?p=sim4me)
[![Actions Status](https://github.com/shooontan/sim4me/workflows/CI/badge.svg)](https://github.com/shooontan/sim4me/actions)


This library gets the amount of traffic from `sim4.me`.

## Install

```bash
# npm
$ npm install sim4me

# or yarn
$ yarn add sim4me
```

## Usage

```js
const { traffic } = require('sim4me');

(async () => {
  try {
    const result = await traffic({
      phone: '09012345678',
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
})();
```

### API

#### traffic(options)

##### options

Type: `object`

- `options.phone`: `string`

Target phone number.

#### return

Type: `object`

- `object.total`: `number`

Total traffic.

- `object.traffic`: `number[]`

Values of daily traffic.

- `object.label`: `number[]`

Dates.





