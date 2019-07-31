import React, { Component } from "react"

import Trimmer from "trimmer"

import "./App.css"

export default class App extends Component {
  render() {
    const containerClass = "text-bubble"
    const textClasses = [
      "text-1",
      "text-2",
      "text-3",
      "text-4",
      "text-5",
      "text-6",
    ]
    return (
      <div>
        <Trimmer className={containerClass} textClasses={textClasses}>
          New video advertising strategy ĐŠĆŽĐĆĐŽŽŽĐ
        </Trimmer>
      </div>
    )
  }
}
