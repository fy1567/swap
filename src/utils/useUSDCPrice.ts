import { ChainId, Currency, currencyEquals, JSBI, Price, WBNB } from 'bsc-sdk'
import { useMemo } from 'react'
import { BUSD } from '../constants'
import { PairState, usePairs } from '../data/Reserves'
import { useActiveWeb3React } from '../hooks'
import { wrappedCurrency } from './wrappedCurrency'

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useUSDCPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals(WBNB[chainId], wrapped) ? undefined : currency,
        chainId ? WBNB[chainId] : undefined
      ],
      [wrapped?.equals(BUSD) ? undefined : wrapped, chainId === ChainId.MAINNET ? BUSD : undefined],
      [chainId ? WBNB[chainId] : undefined, chainId === ChainId.MAINNET ? BUSD : undefined]
    ],
    [chainId, currency, wrapped]
  )
  const [[ethPairState, ethPair], [usdcPairState, usdcPair], [usdcEthPairState, usdcEthPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle wbnb/eth
    if (wrapped.equals(WBNB[chainId])) {
      if (usdcPair) {
        const price = usdcPair.priceOf(WBNB[chainId])
        return new Price(currency, BUSD, price.denominator, price.numerator)
      } else {
        return undefined
      }
    }
    // handle usdc
    if (wrapped.equals(BUSD)) {
      return new Price(BUSD, BUSD, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WBNB[chainId])
    const ethPairETHUSDCValue: JSBI =
      ethPairETHAmount && usdcEthPair ? usdcEthPair.priceOf(WBNB[chainId]).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the usdc pair
    if (usdcPairState === PairState.EXISTS && usdcPair && usdcPair.reserveOf(BUSD).greaterThan(ethPairETHUSDCValue)) {
      const price = usdcPair.priceOf(wrapped)
      return new Price(currency, BUSD, price.denominator, price.numerator)
    }
    if (ethPairState === PairState.EXISTS && ethPair && usdcEthPairState === PairState.EXISTS && usdcEthPair) {
      if (usdcEthPair.reserveOf(BUSD).greaterThan('0') && ethPair.reserveOf(WBNB[chainId]).greaterThan('0')) {
        const ethUsdcPrice = usdcEthPair.priceOf(BUSD)
        const currencyEthPrice = ethPair.priceOf(WBNB[chainId])
        const usdcPrice = ethUsdcPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, BUSD, usdcPrice.denominator, usdcPrice.numerator)
      }
    }
    return undefined
  }, [chainId, currency, ethPair, ethPairState, usdcEthPair, usdcEthPairState, usdcPair, usdcPairState, wrapped])
}
