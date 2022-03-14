const Wc   = require("../../dist/@youwol/mechanics").Wc
const generator   = require("../../dist/@youwol/mechanics").generator
// const math = require('@youwol/math')

// ---------------------------------------------------
const subdivision   = 25
const maxStars      = 20
const friction      = 0.3
const N             = 11
const S1            = 10
const S3            = 1
const lambda        = 0.
// ---------------------------------------------------

const f = new Wc()
f.setNormalsAndArea( generator(subdivision) )
f.S1 = S1
f.S3 = S3
f.lambda = lambda
f.friction = friction

let what = 'distortional'
what = 'nbDistortionalPlanes'

f.S2 = f.S3
f.run()
max = f.nbDistortionalPlanes

for (let friction=0; friction<1.21; friction+=0.1) {
    f.friction = friction
    const n = []
    let nb = 0
    for (let i=0; i<N; ++i) {
        let R = i/(N-1)
        f.S2 = (f.S1-f.S3)*R + f.S3
        f.run()
        n.push(f[what])
        nb += f.nbDistortionalPlanes
    }

    console.log("μ=",friction.toFixed(1)+", "+ (100*nb/(f.nbTotalPlanes*N)).toFixed(1)+'%' )
    let s = ''
    n.forEach( v => s += "|"+Array(Math.trunc(maxStars*v/max)+1).join("*")+ '\n')
    console.log(s)
}
