import React, { PureComponent, Fragment } from "react"
import { findDOMNode } from "react-dom"
import PropTypes from "prop-types"
import { relative } from "path"

// import styles from './styles.css'

export default class Trimmer extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    textClasses: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
  }

  state = {
    textClassIndex: 0,
    numLines: 0,
    isTrimmed: false,
  }

  containerHeight = 0

  readContainerDimensions() {
    const { containerEl } = this
    const { top, height } = containerEl.getBoundingClientRect()
    this.containerTop = top
    this.containerHeight = height
  }

  getStyle(element) {
    const { defaultView: view } = document
    return view.getComputedStyle(element, null)
  }

  opmizeSize() {
    const { textClassIndex } = this.state
    const { containerEl, textEl } = this

    const containerStyle = this.getStyle(containerEl)
    let { height: containerHeight } = containerStyle
    containerHeight = parseFloat(containerHeight)

    const textStyle = this.getStyle(textEl)
    let { height: textHeight, lineHeight } = textStyle
    textHeight = parseFloat(textHeight)
    lineHeight = parseFloat(lineHeight)

    if (textHeight >= containerHeight && textClassIndex > 0) {
      this.setState({ textClassIndex: textClassIndex - 1 })
    } else if (textHeight >= containerHeight) {
      this.trim(lineHeight)
    } else {
      // debugger
    }
  }

  trim(lineHeight) {
    const { innerText: content } = this.textEl

    const numLines = Math.floor(this.containerHeight / lineHeight)

    this.setState({
      content,
      numLines,
      lineHeight,
      isTrimmed: true,
    })
  }

  componentWillMount() {
    const { textClasses } = this.props

    this.setState({
      textClassIndex: textClasses.length - 1,
    })
  }

  componentDidMount() {
    this.readContainerDimensions()
    this.opmizeSize()
  }

  componentDidUpdate() {
    const { isTrimmed } = this.state
    !isTrimmed && this.opmizeSize()
  }

  render() {
    const { className, textClasses, children } = this.props
    const {
      textClassIndex,
      numLines,
      lineHeight,
      isTrimmed,
      content,
    } = this.state

    const currentTextClass = textClasses[textClassIndex]

    const trimStyle = {
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: numLines,
      textOverflow: "ellipsis",
      // wordBreak: "keep-all",
      // overflow: "hidden",
      // whiteSpace: "nowrap",
    }

    return (
      <div className={className} ref={r => (this.containerEl = r)}>
        {!isTrimmed ? (
          <span
            ref={r => (this.textEl = r)}
            style={trimStyle}
            className={currentTextClass}
          >
            {children}
          </span>
        ) : (
          formatContent({
            content,
            clampHeight: this.containerTop + numLines * lineHeight,
            lineHeight,
            className: currentTextClass,
            style: trimStyle,
          })
        )}
      </div>
    )
  }
}

function formatContent({
  content = "",
  clampHeight,
  lineHeight,
  className,
  style,
}) {
  const words = content.split(" ").map((word, index) => (
    <Word
      key={`word-${hashCode(word + index)}`}
      clampHeight={clampHeight - lineHeight}
    >
      {word}
    </Word>
  ))

  for (let i = words.length - 1; i > 0; i--) {
    words.splice(
      i,
      0,
      <Word
        key={`space-${hashCode(words[i] + i)}`}
        clampHeight={clampHeight - lineHeight}
      >
        {" "}
      </Word>,
    )
  }

  return (
    <span className={className} style={style}>
      {words.map((w, i) => w)}
    </span>
  )
}

// Individual Words are rendered as transparent
// if their top offset is below the clamped height
// (Needed because webkit doesn't hide clamped text)

class Word extends PureComponent {
  state = {
    isClamped: null,
  }

  componentDidMount() {
    this.clampIfNeeded()
  }

  clampIfNeeded() {
    const { isClamped } = this.state
    if (isClamped !== null) return isClamped

    const { clampHeight } = this.props
    const element = findDOMNode(this)
    const { top } = element.getBoundingClientRect()
    const newClampedState = top >= clampHeight

    this.setState({ top, isClamped: newClampedState })
  }

  render() {
    const { children } = this.props
    const { isClamped } = this.state
    const style = isClamped
      ? {
          opacity: 0,
          pointerEvents: "none",
        }
      : {}
    return <span style={style}>{children}</span>
  }
}

function hashCode(code) {
  var hash = 0
  if (code.length == 0) {
    return hash
  }
  for (var i = 0; i < code.length; i++) {
    var char = code.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash
}
