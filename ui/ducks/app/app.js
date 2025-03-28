import {
  WEBHID_CONNECTED_STATUSES,
  TRANSPORT_STATES,
} from '../../../shared/constants/hardware-wallets';
import * as actionConstants from '../../store/actionConstants';

// actionConstants
const SET_THREEBOX_LAST_UPDATED = 'metamask/app/SET_THREEBOX_LAST_UPDATED';

export default function reduceApp(state = {}, action) {
  // default state
  const appState = {
    shouldClose: false,
    menuOpen: false,
    modal: {
      open: false,
      modalState: {
        name: null,
        props: {},
      },
      previousModalState: {
        name: null,
      },
    },
    alertOpen: false,
    alertMessage: null,
    qrCodeData: null,
    networkDropdownOpen: false,
    accountDetail: {
      subview: 'transactions',
    },
    // Used to display loading indicator
    isLoading: false,
    // Used to display error text
    warning: null,
    buyView: {},
    isMouseUser: false,
    defaultHdPaths: {
      trezor: `m/44'/60'/0'/0`,
      ledger: `m/44'/60'/0'/0/0`,
      prokey: `m/44'/60'/0'/0`,
      lattice: `m/44'/60'/0'/0`,
    },
    networksTabSelectedRpcUrl: '',
    loadingMethodData: false,
    show3BoxModalAfterImport: false,
    threeBoxLastUpdated: null,
    requestAccountTabs: {},
    openMetaMaskTabs: {},
    currentWindowTab: {},
    showWhatsNewPopup: true,
    singleExceptions: {
      testKey: null,
    },
    gasLoadingAnimationIsShowing: false,
    smartTransactionsError: null,
    smartTransactionsErrorMessageDismissed: false,
    ledgerWebHidConnectedStatus: WEBHID_CONNECTED_STATUSES.UNKNOWN,
    ledgerTransportStatus: TRANSPORT_STATES.NONE,
    newNetworkAdded: '',
    newCollectibleAddedMessage: '',
    sendInputCurrencySwitched: false,
    newTokensImported: '',
    ...state,
  };

  switch (action.type) {
    // dropdown methods
    case actionConstants.NETWORK_DROPDOWN_OPEN:
      return {
        ...appState,
        networkDropdownOpen: true,
      };

    case actionConstants.NETWORK_DROPDOWN_CLOSE:
      return {
        ...appState,
        networkDropdownOpen: false,
      };

    // alert methods
    case actionConstants.ALERT_OPEN:
      return {
        ...appState,
        alertOpen: true,
        alertMessage: action.value,
      };

    case actionConstants.ALERT_CLOSE:
      return {
        ...appState,
        alertOpen: false,
        alertMessage: null,
      };

    // qr scanner methods
    case actionConstants.QR_CODE_DETECTED:
      return {
        ...appState,
        qrCodeData: action.value,
      };

    // Smart Transactions errors.
    case actionConstants.SET_SMART_TRANSACTIONS_ERROR:
      return {
        ...appState,
        smartTransactionsError: action.payload,
      };

    case actionConstants.DISMISS_SMART_TRANSACTIONS_ERROR_MESSAGE:
      return {
        ...appState,
        smartTransactionsErrorMessageDismissed: true,
      };

    // modal methods:
    case actionConstants.MODAL_OPEN: {
      const { name, ...modalProps } = action.payload;

      return {
        ...appState,
        modal: {
          open: true,
          modalState: {
            name,
            props: { ...modalProps },
          },
          previousModalState: { ...appState.modal.modalState },
        },
      };
    }

    case actionConstants.MODAL_CLOSE:
      return {
        ...appState,
        modal: Object.assign(
          appState.modal,
          { open: false },
          { modalState: { name: null, props: {} } },
          { previousModalState: appState.modal.modalState },
        ),
      };

    case actionConstants.CLEAR_ACCOUNT_DETAILS:
      return {
        ...appState,
        accountDetail: {},
      };

    case actionConstants.FORGOT_PASSWORD:
      return {
        ...appState,
        forgottenPassword: action.value,
      };

    case actionConstants.SHOW_SEND_TOKEN_PAGE:
      return {
        ...appState,
        warning: null,
      };

    case actionConstants.LOCK_METAMASK:
      return {
        ...appState,
        warning: null,
      };

    // accounts

    case actionConstants.GO_HOME:
      return {
        ...appState,
        accountDetail: {
          subview: 'transactions',
          accountExport: 'none',
          privateKey: '',
        },
        warning: null,
      };

    case actionConstants.SHOW_ACCOUNT_DETAIL:
      return {
        ...appState,
        forgottenPassword: appState.forgottenPassword
          ? !appState.forgottenPassword
          : null,
        accountDetail: {
          subview: 'transactions',
          accountExport: 'none',
          privateKey: '',
        },
      };

    case actionConstants.SHOW_ACCOUNTS_PAGE:
      return {
        ...appState,
        isLoading: false,
        warning: null,
        scrollToBottom: false,
        forgottenPassword: false,
      };

    case actionConstants.SHOW_CONF_TX_PAGE:
      return {
        ...appState,
        txId: action.id,
        warning: null,
        isLoading: false,
      };

    case actionConstants.COMPLETED_TX:
      if (action.value.unconfirmedActionsCount > 0) {
        return {
          ...appState,
          txId: null,
          warning: null,
        };
      }
      return {
        ...appState,
        // indicate notification should close
        shouldClose: true,
        warning: null,
        txId: null,
        accountDetail: {
          subview: 'transactions',
        },
      };

    case actionConstants.TRANSACTION_ERROR:
      return {
        ...appState,
      };

    case actionConstants.UNLOCK_FAILED:
      return {
        ...appState,
        warning: action.value || 'Incorrect password. Try again.',
      };

    case actionConstants.UNLOCK_SUCCEEDED:
      return {
        ...appState,
        warning: '',
      };

    case actionConstants.SET_HARDWARE_WALLET_DEFAULT_HD_PATH: {
      const { device, path } = action.value;
      const newDefaults = { ...appState.defaultHdPaths };
      newDefaults[device] = path;

      return {
        ...appState,
        defaultHdPaths: newDefaults,
      };
    }

    case actionConstants.SHOW_LOADING:
      return {
        ...appState,
        isLoading: true,
        loadingMessage: action.value,
      };

    case actionConstants.HIDE_LOADING:
      return {
        ...appState,
        isLoading: false,
      };

    case actionConstants.DISPLAY_WARNING:
      return {
        ...appState,
        warning: action.value,
        isLoading: false,
      };

    case actionConstants.HIDE_WARNING:
      return {
        ...appState,
        warning: undefined,
      };

    case actionConstants.SHOW_PRIVATE_KEY:
      return {
        ...appState,
        accountDetail: {
          subview: 'export',
          accountExport: 'completed',
          privateKey: action.value,
        },
      };

    case actionConstants.SET_MOUSE_USER_STATE:
      return {
        ...appState,
        isMouseUser: action.value,
      };

    case actionConstants.SET_SELECTED_SETTINGS_RPC_URL:
      return {
        ...appState,
        networksTabSelectedRpcUrl: action.value,
      };

    case actionConstants.SET_NEW_NETWORK_ADDED:
      return {
        ...appState,
        newNetworkAdded: action.value,
      };

    case actionConstants.SET_NEW_TOKENS_IMPORTED:
      return {
        ...appState,
        newTokensImported: action.value,
      };

    case actionConstants.SET_NEW_COLLECTIBLE_ADDED_MESSAGE:
      return {
        ...appState,
        newCollectibleAddedMessage: action.value,
      };

    case actionConstants.LOADING_METHOD_DATA_STARTED:
      return {
        ...appState,
        loadingMethodData: true,
      };

    case actionConstants.LOADING_METHOD_DATA_FINISHED:
      return {
        ...appState,
        loadingMethodData: false,
      };

    case SET_THREEBOX_LAST_UPDATED:
      return {
        ...appState,
        threeBoxLastUpdated: action.value,
      };

    case actionConstants.SET_REQUEST_ACCOUNT_TABS:
      return {
        ...appState,
        requestAccountTabs: action.value,
      };

    case actionConstants.SET_OPEN_METAMASK_TAB_IDS:
      return {
        ...appState,
        openMetaMaskTabs: action.value,
      };

    case actionConstants.SET_CURRENT_WINDOW_TAB:
      return {
        ...appState,
        currentWindowTab: action.value,
      };

    case actionConstants.HIDE_WHATS_NEW_POPUP:
      return {
        ...appState,
        showWhatsNewPopup: false,
      };

    case actionConstants.CAPTURE_SINGLE_EXCEPTION:
      return {
        ...appState,
        singleExceptions: {
          ...appState.singleExceptions,
          [action.value]: null,
        },
      };

    case actionConstants.TOGGLE_GAS_LOADING_ANIMATION:
      return {
        ...appState,
        gasLoadingAnimationIsShowing: action.value,
      };

    case actionConstants.SET_WEBHID_CONNECTED_STATUS:
      return {
        ...appState,
        ledgerWebHidConnectedStatus: action.value,
      };

    case actionConstants.SET_LEDGER_TRANSPORT_STATUS:
      return {
        ...appState,
        ledgerTransportStatus: action.value,
      };
    case actionConstants.TOGGLE_CURRENCY_INPUT_SWITCH:
      return {
        ...appState,
        sendInputCurrencySwitched: !appState.sendInputCurrencySwitched,
      };
    default:
      return appState;
  }
}

// Action Creators
export function setThreeBoxLastUpdated(lastUpdated) {
  return {
    type: SET_THREEBOX_LAST_UPDATED,
    value: lastUpdated,
  };
}

export function hideWhatsNewPopup() {
  return {
    type: actionConstants.HIDE_WHATS_NEW_POPUP,
  };
}

export function toggleGasLoadingAnimation(value) {
  return { type: actionConstants.TOGGLE_GAS_LOADING_ANIMATION, value };
}

export function setLedgerWebHidConnectedStatus(value) {
  return { type: actionConstants.SET_WEBHID_CONNECTED_STATUS, value };
}

export function setLedgerTransportStatus(value) {
  return { type: actionConstants.SET_LEDGER_TRANSPORT_STATUS, value };
}

// Selectors
export function getQrCodeData(state) {
  return state.appState.qrCodeData;
}

export function getGasLoadingAnimationIsShowing(state) {
  return state.appState.gasLoadingAnimationIsShowing;
}

export function getLedgerWebHidConnectedStatus(state) {
  return state.appState.ledgerWebHidConnectedStatus;
}

export function getLedgerTransportStatus(state) {
  return state.appState.ledgerTransportStatus;
}

export function toggleCurrencySwitch() {
  return { type: actionConstants.TOGGLE_CURRENCY_INPUT_SWITCH };
}
