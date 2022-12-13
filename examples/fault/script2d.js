const meca = require('../../dist/@youwol/mechanics')
const io = require('../../../io/dist/@youwol/io')
const geom = require('../../../geometry/dist/@youwol/geometry')
const fs = require('fs')

const dataframe = io.decodeGocadTS(
    fs.readFileSync(
        '/Users/fmaerten/data/arch/figure-superposition/chamber.ts',
        'utf8',
    ),
)[0]

const env = new meca.FaultSystemEnvelope2D()
env.addSurface({
    positions: dataframe.series.positions,
    indices: dataframe.series.indices,
})
env.system.remote = (p) => [0, 0, 0, 0, 0, -Math.abs(p[2])]

console.log('start')

const N = 50
env.setAxis('x', 'friction', { n: N, min: 0, max: 2 })
env.setAxis('y', 'lambda', { n: N, min: 0, max: 1 })
const s = env.run()

console.log('stop')

// --------------------------------------------------

const dataframe2 = geom.triangulate(env.getPositions(true))
dataframe2.series['E'] = s

const bufferOut = io.encodeGocadTS(dataframe2)
fs.writeFile('/Users/fmaerten/data/meca/2d.ts', bufferOut, 'utf8', () => {})
