const meca = require("../../dist/@youwol/mechanics")
const io   = require("../../../io/dist/@youwol/io")
const math = require("../../../math/dist/@youwol/math")
const geom = require("../../../geometry/dist/@youwol/geometry")
const df   = require("../../../dataframe/dist/@youwol/dataframe")
const fs   = require('fs')

const dataframe = io.decodeGocadTS(fs.readFileSync('/Users/fmaerten/data/arch/figure-superposition/s1.ts', 'utf8'))[0]

const env = new meca.FaultSystemEnvelope3D()
env.addSurface({
    positions: dataframe.series.positions,
    indices: dataframe.series.indices
})
env.system.remote = p => [0, 0, 0, 0, 0, -Math.abs(p[2])]

const N = 10
env.setAxis('x', 'friction', { n: N, min: 0, max: 2 })
env.setAxis('y', 'cohesion', { n: N, min: 0, max: 1000 })
env.setAxis('z', 'lambda', { n: N, min: 0, max: 1 })
const s = env.run()

// --------------------------------------------------

class Grid {
    constructor(sizes, dimensions, origin) {
        this.spacing = [
            dimensions[0] / sizes[0],
            dimensions[1] / sizes[1],
            dimensions[2] / sizes[2]
        ]
        this.sizes = sizes
        this.origin = origin ? origin : [0,0,0]
    }

    pos(i, j, k) {
        return [
            this.origin[0] + i * this.spacing[0],
            this.origin[1] + j * this.spacing[1],
            this.origin[2] + k * this.spacing[2]
        ]
    }
}

const grid = new Grid([N,N,N], [1, 1, 1])
const mm = math.minMax(s)
console.log(mm)
const marching = new geom.MarchingCubes(grid, s.array)
const { positions, indices } = marching.run(mm[0] + (mm[1]-mm[0])*0.2) 

const dataframe2 = df.DataFrame.create({
    series: {
        positions: df.Serie.create({array: positions, itemSize: 3}),
        indices  : df.Serie.create({array: indices, itemSize: 3})
    }
})

const bufferOut = io.encodeGocadTS(dataframe2)
fs.writeFile('/Users/fmaerten/data/meca/3d.ts', bufferOut, 'utf8', err => { })
