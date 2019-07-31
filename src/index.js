import React, { PureComponent } from "react"
import PropTypes from "prop-types"

// import styles from './styles.css'

export default class Trimmer extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    textClasses: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
  }

  state = {
    textClassIndex: 0,
    numLines: 0,
    isOverflowing: false
  }

  opmize() {
    const { textClasses } = this.props

    const { defaultView: view } = document
    const { containerEl, textEl } = this

    const containerStyle = view.getComputedStyle(containerEl, null)
    let { height: containerHeight } = containerStyle

    const textStyle = view.getComputedStyle(textEl, null)
    let { height: textHeight } = textStyle

    let newTextClassIndex = textClasses.length - 1
    while (textHeight > containerHeight && newTextClassIndex > 0) {
      newTextClassIndex--
      this.setState({ textClassIndex: newTextClassIndex })
    }
  }

  trim() {
    const { containerEl, textEl } = this

    const containerStyle = getStyle(containerEl)
    const { height: clampHeight } = containerStyle

    const textStyle = getStyle(textEl)
    const { lineHeight } = textStyle

    const numLines = Math.floor(
      parseFloat(clampHeight) / parseFloat(lineHeight)
    )

    this.setState({
      numLines
    })
  }

  componentWillMount() {
    const { textClasses } = this.props

    this.setState({
      textClassIndex: textClasses.length - 1
    })
  }

  componentDidMount() {
    this.opmize()
    this.trim()
  }

  render() {
    const { className, textClasses, children } = this.props
    const { textClassIndex, numLines } = this.state

    const currentTextClass = textClasses[textClassIndex]

    const trimStyle = {
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: numLines,
      overflow: "hidden",
      textOverflow: "ellipsis"
    }

    return (
      <div className={className} ref={r => (this.containerEl = r)}>
        <span
          style={trimStyle}
          className={currentTextClass}
          ref={r => (this.textEl = r)}
        >
          {children}
        </span>
      </div>
    )
  }
}

function formatContent(
  content,
  clampHeight,
  clampLineCount,
  lineHeight,
  fontSize
) {
  if (content && content.split) {
    const words = content.split(" ").map((word, index) => (
      <Word
        key={`word-${hashCode(word + index)}`}
        clampHeight={clampHeight}
        clampLineCount={clampLineCount}
        fontSize={fontSize}
        lineHeight={lineHeight}
      >
        {word}
      </Word>
    ))

    for (let i = words.length - 1; i > 0; i--) {
      words.splice(
        i,
        0,
        <span className="DISABLE_ABSOLUTE" key={`space-${i}`}>
          {" "}
        </span>
      )
    }

    return ({ el = "div", className = "", ...rest }) => {
      const contentClassName = `content ${className}`
      const style = {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: clampLineCount,
        // overflow: 'hidden',
        textOverflow: "ellipsis",
        fontSize: fontSize,
        lineHeight: `${lineHeight}px`,
        maxHeight: `${clampHeight}px`
      }

      const Element =
        el === "div"
          ? ({ children, ...rest }) => (
              <div className={contentClassName} {...rest}>
                {children}
              </div>
            )
          : ({ children, ...rest }) => (
              <span className={contentClassName} {...rest}>
                {children}
              </span>
            )

      return (
        <Element {...rest} style={style}>
          {words.map((w, i) => w)}
        </Element>
      )
    }
  } else {
    return ({ el = "div", ...rest }) => <el {...rest} />
  }
}

// Individual Words are rendered as transparent
// if their top offset is below the clamped height
// (Needed because webkit doesn't hide clamped text)

class Word extends PureComponent {
  state = {
    isClamped: null
  }

  componentDidMount() {
    this.setupClamping()
  }

  setupClamping() {
    const { isClamped } = this.state
    if (isClamped !== null) return isClamped

    const { clampHeight, lineHeight } = this.props
    const element = ReactDOM.findDOMNode(this)
    const { offsetTop } = element
    const newClampedState = offsetTop + parseFloat(lineHeight) > clampHeight

    this.setState({ isClamped: newClampedState })
  }

  render() {
    const { children } = this.props
    const { isClamped } = this.state

    const wordStyle = { opacity: isClamped ? 0 : 1 }

    return (
      <span style={wordStyle} className={`Word DISABLE_ABSOLUTE`}>
        {children}
      </span>
    )
  }
}

const styleCache = []
function getStyle(element) {
  if (styleCache[element]) {
    return styleCache[element]
  } else if (element.currentStyle) {
    styleCache[element] = element.currentStyle
    return element.currentStyle
  } else if (window.getComputedStyle) {
    const computedStyle = document.defaultView.getComputedStyle(element, null)
    styleCache[element] = computedStyle
    return computedStyle
  }
}
