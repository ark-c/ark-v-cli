const fs = require('fs-extra') // 替代fs模块
const inquirer = require('inquirer') // 命令行输入
const path = require('path')
const chalk = require('chalk') // 颜色

const Creator = require('./Creator')

async function create (appName, options) {
    const cwd = options.cwd || process.cwd()
    const targetDir = path.resolve(cwd, appName || '.')
    if (fs.existsSync(targetDir)) {
        if (options.force) {
            await fs.remove(targetDir)
        } else {
            const { ok } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'ok',
                    message: `genrate the project in currentDir`
                }
            ])
            if (!ok) return
            const { action } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: `Targe directory ${chalk.cyan(targetDir)} already exists. Pick one action:`,
                    choices: [
                        { name: 'Overwrite', value: 'overwrite' },
                        { name: 'Merge', value: 'merge' },
                        { name: 'Cancel', value: false }
                    ]
                }
            ])
            if (!action) return
            else if (action === 'overwrite') {
                await fs.remove(targetDir)
            }
        }
    }
    
    const creator = new Creator(appName, targetDir)
    creator.create(options)
}

module.exports = (...args) => {
    return create(...args).catch(err => {
        error(err)
    })
}
