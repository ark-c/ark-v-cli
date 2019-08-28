const fs = require('fs-extra')
const path =  require('path')
const deepMerge = require('deepmerge')
const jsonFormat = require('json-format')

async function readJson(context) {
    const pageJson = await fs.readFile(context)
    return JSON.parse(pageJson)
}

async function writeJson (context, dataPackage) {
    const cwd = path.resolve(process.cwd(), context)
    if (!fs.existsSync(cwd)) {
        throw new Error('file not exist')
        return
    }
    const cbDataPackage = await readJson(cwd)
    const newDataPackage = deepMerge(cbDataPackage, dataPackage)
    await fs.writeFile(context, jsonFormat(newDataPackage))
}
module.exports = writeJson