/**
 * Example showing how to compyutre 2D and 3D envelopes for WC
 *
 * ```js
 * const meca = require("../../dist/@youwol/mechanics")
 *
 * const env = new meca.WcEnvelope2D(25)
 *
 * env.setAxis('x', 'S1', {n: 50, min:0, max:10})
 * env.setAxis('y', 'friction', {n: 50, min:0, max:1})
 * const s = env.run()
 *
 * console.log(s)
 * console.log(env.positions)
 * ```
 */
export namespace Example_WC {}
