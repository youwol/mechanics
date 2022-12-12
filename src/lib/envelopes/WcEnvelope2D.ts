import { Wc } from './Wc'
import { Envelope2D } from '../envelopes'
import { generator } from './utils'

/**
 * Generate a 2D regular sampling in order to compute Wc at each point, so
 * that iso-contours can be extracted.
 * @example
 * ```ts
 * const f = new WcEnvelope2D(30)
 *
 * // set wc parameters if necessary...
 * f.wc.S1 = 0.3
 *
 * const n = 10
 * f.setAxis('x', 'S1',       {n})
 * f.setAxis('y', 'friction', {n})
 * f.property = 'distortional'
 * const cube = f.run()
 * ```
 * @category Envelope
 */
export class WcEnvelope2D extends Envelope2D {
    constructor(n = 30) {
        super()
        const wc = new Wc()
        wc.setNormalsAndAreas(generator(n))
        this.setAlgo(wc)
    }

    get wc(): Wc {
        return this.getAlgo() as Wc
    }
}
