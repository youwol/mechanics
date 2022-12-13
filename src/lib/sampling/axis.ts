/**
 * Usually used with a Sampler.
 *
 * Usage
 * ```js
 * const axis = new Axis(object, 'friction', {n: 10, min: 0, max: 2, reverse: false})
 * ```
 * @category Sampling
 */
export class Axis {
    private p_: object
    private prop_: string
    private n_: number
    private min_: number
    private max_: number
    private reverse_: boolean

    constructor(
        parent: object,
        prop: string,
        params = { n: 10, min: 0, max: 1, reverse: false },
    ) {
        this.p_ = parent
        this.prop_ = prop
        this.n_ = params.n
        this.min_ = params.min
        this.max_ = params.max
        this.reverse_ = params.reverse
    }

    get property() {
        return this.prop_
    }
    get min() {
        return this.min_
    }
    get max() {
        return this.max_
    }

    value(i: number) {
        if (this.reverse_) {
            return (
                this.min_ +
                ((this.n_ - 1.0 - i) * (this.max_ - this.min_)) /
                    (this.n_ - 1.0)
            )
        }
        return this.min_ + (i * (this.max_ - this.min_)) / (this.n_ - 1.0)
    }

    get currentValue() {
        return this.p_[this.prop_]
    }

    get currentNormalizedValue() {
        return (this.p_[this.prop_] - this.min_) / (this.max_ - this.min_)
    }

    update(i: number): number {
        const v = this.value(i)
        this.p_[this.prop_] = v
        return v
    }

    set sampling(n: number) {
        this.n_ = n
    }

    get sampling() {
        return this.n_
    }
}
