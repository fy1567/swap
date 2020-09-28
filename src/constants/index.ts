import { ChainId, JSBI, Percent, Token, WBNB } from 'bsc-sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected } from '../connectors'

export const ROUTER_ADDRESS = '0xf5b768f9e46d45bbebe5452ac383d80c8715052a'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const DAI = new Token(ChainId.MAINNET, '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', 18, 'DAI', 'Dai Stablecoin')
export const BUSD = new Token(ChainId.MAINNET, '0xe9e7cea3dedca5984780bafc599bd69add087d56', 6, 'BUSD', 'Binance USD')
export const USDT = new Token(ChainId.MAINNET, '0x55d398326f99059ff775485246999027b3197955', 6, 'USDT', 'Tether USD')


const WBNB_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WBNB[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WBNB[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WBNB[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WBNB[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WBNB[ChainId.KOVAN]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WBNB_ONLY,
  [ChainId.MAINNET]: [...WBNB_ONLY[ChainId.MAINNET], DAI, BUSD, USDT]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [BUSD.address]: [DAI, WBNB[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WBNB_ONLY,
  [ChainId.MAINNET]: [...WBNB_ONLY[ChainId.MAINNET], DAI, BUSD, USDT]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WBNB_ONLY,
  [ChainId.MAINNET]: [...WBNB_ONLY[ChainId.MAINNET], DAI, BUSD, USDT]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', 18, 'DAI', 'Dai Stable'),
      new Token(ChainId.MAINNET, '0xe9e7cea3dedca5984780bafc599bd69add087d56', 18, 'BUSD', 'Binance USD Coin')
    ],
    [BUSD, USDT],
    [DAI, USDT]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 BNB
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))
