const normals = require('./sphere-normals') // {l: array, m: array, n: array}

class Wc {
    constructor(normals) {
        this.l = normals.l
        this.m = normals.m
        this.n = normals.n
        this.friction = 0
        this.cohesion = 0
        this.S1 = 10
        this.S2 = 1
        this.S3 = 1
        this.vThreshold = 0
        this.hThreshold = 0.8
        this.bins = 10
    }

    compute(friction) {
        this.friction = friction
        const bars = []

        for (let i=0; i<this.bins; ++i) {
            const {E, n, array} = this.run(friction, i/(this.bins-1) )
            bars.push( {E, n, array: [...array]} )
        }

        const mean = bars.reduce( (cur, v) => cur+v.E, 0 ) / this.bins
        const threshMean = mean / this.vThreshold
        console.log('mean', mean)
        console.log('threshMean', threshMean)

        // Vertical threshold
        const c = bars.map( bar => {
            let low=0, high=0
            bar.array.forEach( v => {
                if (v>0 && v>=threshMean) high++
                if (v>0 && v< threshMean) low++
            })
            return {
                low : low/this.l.length,
                high: high/this.l.length
            }
        })

        return c

        // Horizontal threshold
        // lows = lows.map( n => Math.round(n-minN*this.hThreshold) )

        // return {
        //     low : lows,
        //     high: highs
        // }
    }


    run(friction, R) {
        this.friction = friction
        this.S2 = (this.S1 - this.S3)*R + this.S3
        const array = []
        for (let i = 0; i < this.l.length; ++i) {
            const l   = this.l[i]
            const m   = this.m[i]
            const n   = this.n[i]
            const S1  = this.S1
            const S2  = this.S2
            const S3  = this.S3
            const S12 = (S1 - S2) * (S1 - S2)
            const S23 = (S2 - S3) * (S2 - S3)
            const S31 = (S3 - S1) * (S3 - S1)
            const l2  = l * l
            const m2  = m * m
            const n2  = n * n
            const Tn  = Math.sqrt(S12 * l2 * m2 + S23 * m2 * n2 + S31 * n2 * l2)
            const Sn  = (S1 * l2 + S2 * m2 + S3 * n2)
            const Co  = this.friction * Sn + this.cohesion

            if (Tn >= Co) {
                array.push( (Tn - Co)**2 )
            }
            else {
                array.push( 0 )
            }
        }

        const nb = array.length

        let E   = 0
        let n   = 0
        let min = Number.POSITIVE_INFINITY
        let max = 0
        
        array.forEach( (e,i) => {
            if (e > 0) {
                n++
                E += e
            }
            if (e>max) max = e
            if (e<min) min = e
        })

        E /= n

        return {E, n, array}
    }
}

const wc = new Wc(normals)
wc.S1 = 10
wc.S3 = 1
wc.cohesion = 0
wc.hThreshold = 0
wc.vThreshold = 0.8
wc.bins = 10
const r = wc.compute(0.27)

console.log('')
r.forEach( v => console.log(v.low.toString().replace('.',',')) )

console.log('')
r.forEach( v => console.log(v.high.toString().replace('.',',')) )
