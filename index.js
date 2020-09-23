#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const chalk = require('chalk')
const download = require('download-git-repo')
const inquirer = require('inquirer') //用户交互
const ora = require('ora') //进度条
const symbols = require('log-symbols')
const handlebars = require('handlebars') //模板引擎

program.version(require('./package.json').version, '-v, --version')
    .command('init <name>')
    .action(
        (name) => {
            if (!fs.existsSync(name)) {
                inquirer.prompt(
                    [
                        {
                            name: 'templateType',
                            message: 'which template type you need to create?',
                            type: 'list',
                            choices: ['empty', 'pc_antd', 'h5_ant-mobile'],
                        },
                        {
                            name: 'description',
                            message: "please input program description:",
                        },
                        {
                            name: 'author',
                            message: "please input author info:",
                        },
                    ]
                ).then(
                    (answers) => {
                        console.log(answers);
                        //下载项目
                        const spinner = ora('downloading template...')
                        spinner.start();
                        let type = answers.templateType === "empty" ?  "master" : answers.templateType
                        const downloadPath = `direct:https://git.zhonganinfo.com/za-zhangxiaobo/subao_frontend_project_templete.git#${type}`

                        download(downloadPath, name, {clone: true}, err => {
                            if (err) {
                                spinner.fail();
                                console.error(symbols.error,
                                    chalk.red(`${err}download template fail,please check your network connection and try again`))
                                process.exit(1);
                            }

                            spinner.succeed();
                            const meta = {
                                name,
                                description: answers.description,
                                author: answers.author,
                            }

                            const fileName = `${name}/package.json`;
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result)

                        })

                    }
                )

            } else {
                console.error(symbols.error, chalk.red('project had exist'))
            }
        }
    )
    .on(
        '--help', ()=>{
            console.log("just run \'subao-starter init XXX\'")
        }
    )

program.parse(process.argv)







