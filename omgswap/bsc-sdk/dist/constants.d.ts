import JSBI from 'jsbi';
export declare type BigintIsh = JSBI | bigint | string;
export declare enum ChainId {
    MAINNET = 56,
    ROPSTEN = 3,
    RINKEBY = 4,
    GÖRLI = 5,
    KOVAN = 42
}
export declare enum TradeType {
    EXACT_INPUT = 0,
    EXACT_OUTPUT = 1
}
export declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
export declare const FACTORY_ADDRESS = "0xF1aDA0a86C04644131ee898372696c12834bf86E";
export declare const INIT_CODE_HASH = "0x1f75751327e54f763aff020420cc39ddcd2c5a32e67492961b8a6fea2b0c1018";
export declare const MINIMUM_LIQUIDITY: JSBI;
export declare const ZERO: JSBI;
export declare const ONE: JSBI;
export declare const TWO: JSBI;
export declare const THREE: JSBI;
export declare const FIVE: JSBI;
export declare const TEN: JSBI;
export declare const _100: JSBI;
export declare const _997: JSBI;
export declare const _1000: JSBI;
export declare enum SolidityType {
    uint8 = "uint8",
    uint256 = "uint256"
}
export declare const SOLIDITY_TYPE_MAXIMA: {
    uint8: JSBI;
    uint256: JSBI;
};
