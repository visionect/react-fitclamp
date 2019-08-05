import React, { PureComponent, Fragment } from "react"
import { findDOMNode } from "react-dom"
import PropTypes from "prop-types"

// import styles from './styles.css'

export default class FitClamp extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    textClasses: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
  }

  state = {
    textClassIndex: 0,
    numLines: 0,
    isTrimmed: false,
    isMeasuring: true,
  }

  containerHeight = 0
  containerWidth = 0

  constructor(props) {
    super(props)

    const {
      state,
      props: { textClasses },
    } = this

    this.state = {
      ...state,
      textClassIndex: textClasses.length - 1,
    }
  }

  readContainerDimensions() {
    const { containerEl } = this
    const { top, width, height } = containerEl.getBoundingClientRect()

    this.containerTop = top
    this.containerWidth = width
    this.containerHeight = height
  }

  getStyle(element) {
    const { defaultView: view } = document
    return view.getComputedStyle(element, null)
  }

  optimizeSize() {
    const { textClassIndex } = this.state
    const { textEl } = this

    const textStyle = this.getStyle(textEl)
    let { lineHeight } = textStyle
    lineHeight = parseFloat(lineHeight)

    const {
      width: textWidth,
      height: textHeight,
    } = textEl.getBoundingClientRect()

    if (
      (textHeight >= this.containerHeight || textWidth > this.containerWidth) &&
      textClassIndex > 0
    ) {
      this.setState({ textClassIndex: textClassIndex - 1 })
    } else if (textHeight >= this.containerHeight) {
      this.trim(lineHeight)
    } else {
      this.setState({ isMeasuring: false })
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
      isMeasuring: false,
    })
  }

  componentDidMount() {
    const { innerText: content } = this.textEl
    this.setState({ content })
    this.readContainerDimensions()
    this.optimizeSize()
  }

  componentDidUpdate() {
    const { isMeasuring } = this.state
    isMeasuring && this.optimizeSize()
  }

  getContainerEl = () => {
    return this.containerEl
  }

  getTextEl = () => {
    return this.textEl
  }

  render() {
    const { className, textClasses, children } = this.props
    const {
      textClassIndex,
      numLines,
      lineHeight,
      isTrimmed,
      isMeasuring,
      content,
    } = this.state

    const currentTextClass = textClasses[textClassIndex]

    const measureStyle = {
      display: "inline-block",
    }

    const trimStyle = {
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: numLines,
      textOverflow: "ellipsis",
    }

    const clampWidth = this.containerWidth

    const formattedProps = {
      content,
      lineHeight,
      className: currentTextClass,
      clampHeight: numLines * lineHeight,
      clampWidth: clampWidth,
      style: trimStyle,
      getContainerEl: this.getContainerEl,
    }

    if (isMeasuring) {
      return (
        <div
          key={`measuring-${hashCode(content || "")}`}
          className={className}
          ref={r => (this.containerEl = r)}
        >
          <span
            ref={r => (this.textEl = r)}
            style={measureStyle}
            className={currentTextClass}
          >
            {children}
          </span>
        </div>
      )
    } else if (isTrimmed) {
      return (
        <div
          key={`trimmed-${hashCode(content || "")}`}
          className={className}
          ref={r => (this.containerEl = r)}
        >
          <FormattedContent {...formattedProps} />
        </div>
      )
    } else {
      return (
        <div
          key={`non-trimmed-${hashCode(content || "")}`}
          className={className}
          ref={r => (this.containerEl = r)}
        >
          <FormattedContent {...formattedProps} />
        </div>
      )
    }
  }
}

class FormattedContent extends PureComponent {
  getTextEl = () => {
    return this.textEl
  }

  render() {
    const {
      content = "",
      clampHeight,
      clampWidth,
      lineHeight,
      className,
      style,
      getContainerEl,
    } = this.props

    const wordProps = {
      clampHeight: clampHeight,
      clampWidth: clampWidth,
      lineHeight: lineHeight,
      getContainerEl: getContainerEl,
      getTextEl: this.getTextEl,
    }

    const words = content.split(" ").map((word, index) => (
      <Word key={`word-${hashCode(word + index)}`} {...wordProps}>
        {word}
      </Word>
    ))

    for (let i = words.length - 1; i > 0; i--) {
      words.splice(
        i,
        0,
        <Word
          key={`space-${hashCode(words[i] + i)}`}
          {...wordProps}
          isSpace={true}
        >
          {" "}
        </Word>,
      )
    }

    return (
      <div className={className} style={style} ref={r => (this.textEl = r)}>
        {words.map((w, i) => w)}
      </div>
    )
  }
}

// Individual Words are rendered as transparent
// if their top offset is below the clamped height
// (Needed because webkit doesn't hide clamped text)

class Word extends PureComponent {
  state = {
    isClamped: null,
    isVisible: false,
  }

  componentDidMount() {
    setTimeout(() => {
      this.clampIfNeeded()
    }, 0)
  }

  clampIfNeeded() {
    const { isClamped } = this.state
    if (isClamped !== null) return isClamped

    const { clampHeight, getContainerEl, getTextEl } = this.props
    const element = findDOMNode(this)
    const { top, width } = element.getBoundingClientRect()

    const { top: containerTop } = getContainerEl().getBoundingClientRect()
    const { top: textTop } = getTextEl().getBoundingClientRect()
    const delta = textTop - containerTop

    const newClampedState = top >= containerTop + clampHeight - delta

    this.setState({ top, width, isClamped: newClampedState, isVisible: true })
  }

  render() {
    const { children, clampWidth, isSpace } = this.props
    const { isClamped, isVisible, width } = this.state
    const style =
      isClamped || !isVisible
        ? {
            opacity: 0,
            pointerEvents: "none",
          }
        : !isSpace
        ? {
            display: width > clampWidth ? "inline-block" : "inline",
            textOverflow: "ellipsis",
            maxWidth: `${clampWidth}px`,
            overflowX: "hidden",
            overflowY: "visible",
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
