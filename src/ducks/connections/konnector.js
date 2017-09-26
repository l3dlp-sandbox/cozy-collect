import {
  CREATE_CONNECTION,
  ENQUEUE_CONNECTION,
  PURGE_QUEUE,
  UPDATE_CONNECTION_ERROR,
  UPDATE_CONNECTION_RUNNING_STATUS
} from './'

import account, {
  getConnectionStatus,
  hasError as hasAccountError,
  hasRun,
  isQueued,
  isRunning
} from './account'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_CONNECTION:
    case ENQUEUE_CONNECTION:
    case UPDATE_CONNECTION_ERROR:
    case UPDATE_CONNECTION_RUNNING_STATUS:
      return { ...state, [action.account._id]: account(state[action.account._id], action) }
    case PURGE_QUEUE:
      return Object.keys(state).reduce((accounts, accountId) => {
        return { ...accounts, [accountId]: account(state[accountId], action) }
      }, state)
    default:
      return state
  }
}

export default reducer

// selectors
const getKonnectorIconURL = (registryKonnector) => {
  let icon = null
  try {
    icon = require(`../../assets/icons/konnectors/${registryKonnector.slug}.svg`)
  } catch (error) {
    console.warn(`Cannot get icon ${registryKonnector.slug}: ${error.message}`)
  }
  return icon
}

export const getQueuedConnections = (state, registryKonnector) => {
  return Object.keys(state).reduce((runningConnections, accountId) => {
    const label = registryKonnector.name
    const status = getConnectionStatus(state[accountId])
    const icon = getKonnectorIconURL(registryKonnector)
    return isQueued(state[accountId])
      ? runningConnections.concat({ label, status, icon })
        : runningConnections
  }, [])
}

export const hasError = (state) => {
  return Object.keys(state).find(accountId => hasAccountError(state[accountId]))
}

export const hasQueuedConnection = (state) => {
  return Object.keys(state).find(accountId => isQueued(state[accountId]))
}

export const hasRunConnection = (state) => {
  return Object.keys(state).find(accountId => hasRun(state[accountId]))
}

export const hasRunningConnection = (state) => {
  return Object.keys(state).find(accountId => isRunning(state[accountId]))
}
