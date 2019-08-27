const fs = require('fs-extra') // 替代fs模块
const inquirer = require('inquirer') // 命令行输入
const ora = require('ora') // 命令行loading
const path = require('path')
const chalk = require('chalk') // 颜色
const downloadGit = require('download-git-repo') // 下载git模版
const execa = require('execa') // 

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
        },
        {
            type: 'list',
            name: 'template',
            description: 'lazy, there are some template:',
            choices: [
                {name: 'h5', value: 'template-h5'},
                {name: 'pc', value: 'template-pc'},
                {name: 'nothing', value: ''}
            ]
        }
    ]
    const ans = await inquirer.prompt(anoQuestions)
    if (ans.template) { // TODO 抽离
        const gitBaseUri = require('../utils/constants').gitUri
        const writeJson = require('../utils/pkgJson')
        const hasYarn = require('../utils/env').hasYarn
        const gitUrl = `${gitBaseUri}ark-v-${ans.template}`
        const loading = ora(`fetch template from ${gitUrl}...`)
        loading.start()
        downloadGit(`direct:${gitUrl}`, 
            `${appName}`, 
            {clone: true}, 
            async function(err) {
                if (err) return
                loading.succeed()
                delete ans.template
                const jsonConfig = {
                    ...ans,
                    name: appName
                }

                writeJson(`${appName}/package.json`, jsonConfig)
                await execa('git',['init'], {cwd: targetDir})
                if (hasYarn()) {
                    await execa('yarn', ['install'], {cwd: targetDir})
                }else {
                    await execa('npm', ['install'], {cwd: targetDir})
                }
                // await execa('npm', ['install'], {cwd: targetDir})
                const consoleTxt = `🎉  Successfully created project ${appName}.\n` + 
                    `👉  Get started with the following commands:\n\n`
                console.log(consoleTxt,
                    chalk.cyan(`$ cd ${appName}\n`),
                    chalk.cyan(`$ npm run server\n`)
                )
            })
    }
}

module.exports = (...args) => {
    return create(...args).catch(err => {
        error(err)
    })
}
