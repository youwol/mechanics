const Wc        = require("../../dist/@youwol/mechanics").Wc
const generator = require("../../dist/@youwol/mechanics").generator
const generatorKogan = require("../../dist/@youwol/mechanics").generatorKogan
// const fs   = require('fs')

const normals = require('./sphere-normals') // {l: array, m: array, n: array}

function generatorFromNormals(normals) {
    const r = {
        normals  : [],
        areas    : []
    }

    for (let i=0; i<normals.l.length; ++i) {
        r.normals.push( [normals.l[i], normals.m[i], normals.n[i]] )
        r.areas  .push( 1 )
        // console.log(face.normal)
    }

    return r
}

function run(wc, friction, R) {
    wc.friction = friction
    wc.S2 = (wc.S1 - wc.S3)*R + wc.S3
    wc.run()
    let high = 0
    let low = 0
    const mean = wc.distortionalInfo.mean*vThreashold
    wc.distortionalInfo.array.forEach( v => {
        if (v>0) {
            if (v<mean) low++
            else high++
        }
    })
    return {low, high}
}

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



/**
 * 1. For each fracture, compute its Weff for a given R and mu
 * 2. Compute the corresponding mean energy
 * 3. Choose a threshold percent
 * 4. Keep fractures that are reactivated AND below the threshold
 * 5. Count the number of corresponding fractures
 * 6. Do that for each R
 * 7. Plot the histogram
 * 
 * What is missing
 * 1. Horizontal threshold (DONE)
 * 2. Use the normals from a sphere (DONE)
 */

// ---------------------------------------------------
const friction      = 0.27
const cohesion      = 0
const lambda        = 0
const S1            = 10
const S3            = 1
const vThreashold   = 0.8 // 80%
const hThreshold    = 0
const N             = 10
// ---------------------------------------------------

const wc = new Wc()
wc.S1 = S1
wc.S3 = S3
wc.poisson  = 0
wc.cohesion = cohesion
wc.lambda   = lambda

// const subdivision = 250
// wc.setNormalsAndAreas( generatorKogan(subdivision*555) )
// wc.setNormalsAndAreas( generator(subdivision) )
wc.setNormalsAndAreas( generatorFromNormals(normals) )

let lows = []
let highs = []
let minN = Number.MAX_SAFE_INTEGER
for (let i=0; i<N; ++i) {
    const R = i/(N-1)
    const {low, high} = run(wc, friction, R)
    lows.push(low)
    highs.push(high)
    if (low<minN) minN=low
}

// Horizontal threshold
lows = lows.map( n => n-minN*hThreshold)

lows.forEach( n => console.log(Math.round(n)) )
console.log('')
highs.forEach( n => console.log(Math.round(n)) )











// const testFct = (item, bin) => (item.R > bin.minNum && item.R <= bin.maxNum) ? item.n : 0
// const res = binning(values, testFct, 1/12)
// res.forEach( r => console.log(r.count) )


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