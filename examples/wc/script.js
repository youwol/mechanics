const WC = require('../../dist/@youwol/mechanics')
const io = require('../../../io/dist/@youwol/io')
const geom = require('../../../geometry/dist/@youwol/geometry')
const fs = require('fs')

// ---------------------------------------------------
const subdivision = 25
const _maxStars = 20
const friction = 0
const N = 31
const S1 = 10
const S3 = 1
const lambda = 0.5
// ---------------------------------------------------

const env = new WC.WcEnvelope2D(subdivision)
env.wc.friction = friction
env.wc.S1 = S1
env.wc.S3 = S3
env.wc.lambda = lambda

env.setAxis('x', 'friction', { n: N, min: 0, max: 1 })
env.setAxis('y', 'S2', { n: N, min: 0, max: 1 })

const dataframe = geom.triangulate(env.getPositions(true))
dataframe.series['wc'] = env.run()

const bufferOut = io.encodeGocadTS(dataframe)
fs.writeFile('/Users/fmaerten/data/meca/wc2d.ts', bufferOut, 'utf8', () => {})
