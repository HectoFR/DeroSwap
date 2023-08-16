class Asset {
    atomicBalance = 0;
    name = null;
    digit = null;
    scid = null;

    constructor(name) {
        this.name = name;
    }

    get realBalance() {
        return this.atomicBalance / Math.pow(10, this.digit);
    }
}

class Pair {
    contract = null;
    asset1 = null;
    asset2 = null;
    val1 = null;
    val2 = null;
    fees = null;

    constructor(contract, asset1, asset2) {
        this.contract = contract;
        this.asset1 = asset1;
        this.asset2 = asset2;
    }

    get realVal1() {
        return this.val1 / Math.pow(10, this.asset1.digit);
    }
    get realVal2() {
        return this.val2 / Math.pow(10, this.asset2.digit);
    }
    get realRatio() {
        return this.realVal2 / this.realVal1;
    }
}

export { Asset, Pair }