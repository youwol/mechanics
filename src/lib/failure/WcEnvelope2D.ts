import { Wc } from './Wc'
import { Envelope2D } from '../envelope'
import { GeneratorType } from '../types'

/**
 * Generate a 2D regular sampling in order to compute Wc at each point, so
 * that iso-contours can be extracted.
 * @example
 * ```ts
 * const wc = new Wc
 * // set wc parameters if necessary...
 *   
 * const f = new WcEnvelope2D(wc, 30)
 * const n = 10
 * f.setAxis('x', 'S1',       {n})
 * f.setAxis('y', 'friction', {n})
 * f.property = 'distortional'
 * const cube = f.run()
 * ```
 * @category Envelope
 */
export class WcEnvelope2D extends Envelope2D {
    constructor(wc: Wc, generator: GeneratorType) {
        super()
        this.setAlgo(wc)
        this.generator = generator
    }

    set generator(gen: GeneratorType) {
        this.getAlgo().setNormalsAndArea( gen )
    }
}
