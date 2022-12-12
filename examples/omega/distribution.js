const math = require('../../../math/dist/@youwol/math')
const df = require('../../../dataframe/dist/@youwol/dataframe')
const fs = require('fs')

const a = -1
const b = 1
const beta = 4
const cdf = math.inverseCDF((x) => a + b * (x ** 2 - x + 1) ** -beta, 100)
const omega = () => cdf(Math.random())

const array = []
for (let i = 0; i < 50000; i++) {
    array.push(omega())
}

const s = math.bins(df.Serie.create({ array, itemSize: 1 }), { nb: 11 })
s.forEach((v) => console.log(v))
