const React = require('react')

const config = require('../../config')

module.exports = class VodWebList extends React.Component {
  render () {
    const state = this.props.state
    return (
      <div className={state.location.url()}>
        <webview src={config.WINDOW_WEB} preload={config.WINDOW_PRELOAD}></webview>
      </div>
    )
  }
}
