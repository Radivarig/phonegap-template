import { Store } from 'flummox'

export default class StoreApp extends Store {
  constructor({ actionsApp }) {
    super()
    this.register(actionsApp.setState, this.handleSetState)

    //initial state
    this.state = {
      input: ''
    }
  }

  handleSetState(s) {
    this.setState(s)
  }

}
