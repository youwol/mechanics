const WC   = require("../../dist/@youwol/mechanics")

// ---------------------------------------------------
const subdivision   = 25
const maxStars      = 20
const friction      = 0.3
const N             = 11
const S1            = 10
const S3            = 1
const lambda        = 0.
// ---------------------------------------------------

const env = new WC.WcEnvelope2D(subdivision)
env.wc.friction = friction
env.wc.S1 = S1
env.wc.S3 = S3
env.wc.lambda = lambda

env.setAxis('x', 'S1', {n: N, min:0, max:1})
env.setAxis('y', 'S2', {n: N, min:0, max:1})
const s = env.run()

console.log(s)
console.log(env.positions)