const fs = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')
const chalk = require('chalk')
const dowloadGit = require('download-git-repo')

async function create(appName, options) {
    // const cwd = 
    console.log(appName, options)
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
                console.log(`\n Removing ${chalk.cyan(targetDir)}...`)
                await fs.remove(targetDir)
            }
        }
    }else {
        const anoQuestions = [
            {
                type: 'input',
                name: 'version',
                message: 'verson(v1.0.0)：',
                default: 'v1.0.0',
                validate (val) {
                    return val !== ''
                }
            },
            {
                type: 'input',
                name: 'author',
                message: 'author:'
            },
            {
                type: 'input',
                name: 'description',
                message: 'project description:'
            }
        ]
        const ans = await inquirer.prompt(anoQuestions)
        if (ans.version) {
            dowloadGit('')
        }
    }
}

module.exports = (...args) => {
    return create(...args).catch(err => {
        error(err)
    })
}