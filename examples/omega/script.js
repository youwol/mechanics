const Wc        = require("../../dist/@youwol/mechanics").Wc
const math      = require("../../../math/dist/@youwol/math")
const df        = require("../../../dataframe/dist/@youwol/dataframe")
const generator = require("../../dist/@youwol/mechanics").generator
const generatorKogan = require("../../dist/@youwol/mechanics").generatorKogan
const fs   = require('fs')

/**
 * Use the Omega distribution
 */

// ---------------------------------------------------
const subdivision   = 250
const friction      = 0.2
const N             = 5000
const S1            = 10
const S3            = 1
const lambda        = 0
const useKogan      = false
// ---------------------------------------------------

const f = new Wc()
if (useKogan) {
    f.setNormalsAndAreas( generatorKogan(subdivision*555) )
}
else {
    f.setNormalsAndAreas( generator(subdivision) )
}

f.S1 = S1
f.S3 = S3
f.lambda   = lambda
f.friction = friction

let what = 'distortional'
what     = 'nbDistortionalPlanes'

f.S2 = f.S3
f.run()
max = f.nbDistortionalPlanes

const a    =  0
const b    =  1
const beta =  2
const cdf = math.inverseCDF( x => a + b*(x**2 - x + 1)**(-beta), 100 )
const omega = () => cdf(Math.random())

function run(friction) {
    f.friction = friction
    const values = []
    let nb = 0
    for (let i=0; i<N; ++i) {
        // for (let i=0; i<N; ++i) {
        // let R = omega() // Our own probability distribution
        const R = i/(N-1)
        f.S2 = (f.S1-f.S3)*R + f.S3
        f.run()
        values.push({n: f[what], R})
        nb += f[what]
    }
    console.log("μ=",friction.toFixed(1)+", "+ (100*nb/(f.nbTotalPlanes*N)).toFixed(1)+'%' )
    return values
}

let values = run(1.0)

function binning(arr, fct, interval = 0.1) {
    const bins = []
    const numOfBuckets = 1
    let binCount = 0

    // Setup Bins
    for(let i = 0; i < numOfBuckets-interval; i += interval) {
        bins.push({
            binNum: binCount,
            minNum: i,
            maxNum: i + interval,
            count : 0
        })
        binCount++
    }

    // Loop through data and add to bin's count
    arr.forEach( item => bins.forEach( bin => bin.count += fct(item, bin) ) )

    return bins
}

const testFct = (item, bin) => (item.R > bin.minNum && item.R <= bin.maxNum) ? item.n : 0

const res = binning(values, testFct, 1/12)
res.forEach( r => console.log(r.count) )





// Save as CSV file
//
// let buffer = ''
// for (let i=0; i<frics.length; ++i) {
//     i===array.length-1 ? buffer += 'mu='+frics[i].toFixed(2) + '\n' : buffer += 'mu='+frics[i].toFixed(2) + ',' 
// }

// const nb = array[0].length
// for (let i=0; i<nb; ++i) {
//     array.forEach( (a, j) => {
//         j===array.length-1 ? buffer += a[i] + '\n' : buffer += a[i] + ','
//     })
// }
// const name = useKogan ? 'kogan' : 'basic'
// fs.writeFile('/Users/fmaerten/data/meca/'+name+'.csv', buffer, 'utf8', err => {})