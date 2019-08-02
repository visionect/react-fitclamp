# react-fitclamp

> Trims

[![NPM](https://img.shields.io/npm/v/react-fitclamp.svg)](https://www.npmjs.com/package/react-fitclamp) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-fitclamp
```

## Usage

```jsx
import React, { Component } from "react"

import FitClamp from "react-fitclamp"

class Example extends Component {
  render() {
    const containerClass = "card-medium"
    const textSizes = ["size-1", "size-2", "size-3"]
    const text = "Lorem ipsum dolor sit amet"

    return (
      <FitClamp className={containerClass} textClasses={textSizes}>
        {text}
      </FitClamp>
    )
  }
}
```

Make sure the CSS for textClasses contains line-height setting in percentages, integers or pixels. Keywords like "normal" will not work.

## License

MIT © [some1else](https://github.com/some1else)
