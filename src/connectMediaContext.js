import React from 'react'
import debounce from 'lodash.debounce'

const defaultQueries = {
  xsmall: 'screen and (max-width: 40em)',
  small: 'screen and (min-width: 40em)',
  medium: 'screen and (min-width: 52em)',
  large: 'screen and (min-width: 64em)'
}

const connectMediaContext = (config = {}) => (Comp) => {
  const queries = config.queries || defaultQueries

  class MediaContext extends React.Component {
    constructor () {
      super()
      this.state = {
        media: [
          'server'
        ]
      }
      this.match = this.match.bind(this)
      this.handleMediaChange = debounce(this.handleMediaChange.bind(this), 100)
    }

    getChildContext () {
      return this.state
    }

    match () {
      const media = []

      for (var key in queries) {
        const { matches } = window.matchMedia(queries[key])
        if (matches) {
          media.push(key)
        }
      }

      this.setState({ media })
    }

    handleMediaChange () {
      this.match()
    }

    componentDidMount () {
      this.match()
      for (let key in queries) {
        window.matchMedia(queries[key]).addListener(this.handleMediaChange)
      }
    }

    componentWillUnmount () {
      for (let key in queries) {
        window.matchMedia(queries[key]).removeListener(this.handleMediaChange)
      }
    }

    render () {
      return <Comp {...this.props} {...this.state} />
    }
  }

  MediaContext.childContextTypes = {
    media: React.PropTypes.array
  }

  return MediaContext
}

export default connectMediaContext

