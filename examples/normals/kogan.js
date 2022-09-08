const generator = require("../../dist/@youwol/mechanics").generatorKogan
const fs = require('fs')

const subdivision = 30000

let buffer = '# x y z\n'
const a = generator(subdivision)
a.normals.forEach( n => {
    // console.log(n)
    buffer += n[0] + ' ' + n[1] + ' ' + n[2] + '\n'
})

console.log(a.normals.length)
fs.writeFileSync('/Users/fmaerten/data/meca/kogan.xyz', buffer, 'utf8', err => {})
