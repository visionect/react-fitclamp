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
          Booked
        </Trimmer>
        <Trimmer className={containerClass} textClasses={textClasses}>
          Vacant
        </Trimmer>
        <Trimmer className={containerClass} textClasses={textClasses}>
          Advertising sync: Budget
        </Trimmer>
        <Trimmer className={containerClass} textClasses={textClasses}>
          Joan - Sprint planning
        </Trimmer>
        <Trimmer className={containerClass} textClasses={textClasses}>
          Worst case scenario plan
        </Trimmer>
        <Trimmer className={containerClass} textClasses={textClasses}>
          Email marketing automation
        </Trimmer>
        <Trimmer className={containerClass} textClasses={textClasses}>
          Visionect &lt;&gt; Petrol: Intro video conference call
        </Trimmer>
        <Trimmer className={containerClass} textClasses={textClasses}>
          New videos advertising strategy for Eastern Europe
        </Trimmer>
        <Trimmer className={containerClass} textClasses={textClasses}>
          New videos advertising strategy for Eastern European markets
        </Trimmer>
        <Trimmer className={containerClass} textClasses={textClasses}>
          Lorem ipsum dolor sit amet adipiscig automation testing line clipping
          it can ĐŠČĆŽĐ ŠĆĐŠČĐ ĐŠČĆŠŽŽ ŠĐČ ŽŠĆ ĐŠČĆŽ Š
        </Trimmer>
      </div>
    )
  }
}
