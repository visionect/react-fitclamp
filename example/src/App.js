import React, { Component } from "react"

import FitClamp from "react-fitclamp"

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
        <FitClamp className={containerClass} textClasses={textClasses}>
          Booked
        </FitClamp>
        <FitClamp className={containerClass} textClasses={textClasses}>
          Vacant
        </FitClamp>
        <FitClamp className={containerClass} textClasses={textClasses}>
          Advertising sync: Budget
        </FitClamp>
        <FitClamp className={containerClass} textClasses={textClasses}>
          Joan - Sprinte planning
        </FitClamp>
        <FitClamp className={containerClass} textClasses={textClasses}>
          Worst case scenario plan
        </FitClamp>
        <FitClamp className={containerClass} textClasses={textClasses}>
          Email marketing automation
        </FitClamp>
        <FitClamp className={containerClass} textClasses={textClasses}>
          Visionect &lt;&gt; Petrol: Intro video conference call
        </FitClamp>
        <FitClamp className={containerClass} textClasses={textClasses}>
          New videos advertising strategy for Eastern Europe
        </FitClamp>
        <FitClamp className={containerClass} textClasses={textClasses}>
          New videos advertising strategy for Eastern European markets
        </FitClamp>
        <FitClamp className={containerClass} textClasses={textClasses}>
          Lorem ipsum dolor sit amet adipiscig line clipping it can ĐŠČĆŽĐ
          ŠĆĐŠČĐ ĐŠČĆŠŽŽ ŠĐČ ŽŠĆ ĐŠČĆŽ Š
        </FitClamp>
      </div>
    )
  }
}
