#!/usr/bin/env node
import path from 'path'
import chalk from 'chalk'
import inquirer from 'inquirer'
import fs from 'fs-extra'
import { createSpinner } from 'nanospinner'
import  * as dl from 'gitee-repo'
const download = dl.default
import figlet from 'figlet'
//删除目录
function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
  fs.rmSync(dir, { recursive: true, force: true })
}
async function run() {
  figlet('er-cli', {
    font: "Isometric3",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 100,
    whitespaceBreak: true,
  },async function (err, data) {
      //打印文字图案
      console.log(data)
    //询问用户
    const answers = await inquirer.prompt([
      {
        name: 'dirname',
        type: 'input',
        message: '请输入项目名：',
        default() {
          return 'ercli-starter'
        },
      },
      {
        name:'template',
        type:'list',
        message:'请选择模板',
        choices:['x-admin-template','nuxt3-template'],
      }
    ])


    //目录是否已经存在
    const dirIsExists = fs.existsSync(answers.dirname)

    if (dirIsExists) {
    } else {
      //显示下载动画
      const spinner = createSpinner('开始下载...').start()
      //下载git代码
      const dl_url = `direct:https://gitee.com/fxzer/${answers.template}`
      download(`${dl_url}#master`, answers.dirname, function (err) {
        if (err) {
          spinner.error({ text: `下载异常：${err.message}` })
        } else {
          spinner.success({
            text: '项目搭建成功，请依次执行以下命令',
          })
          console.log(chalk.green(`\r\ncd ${answers.dirname}`))
          console.log(chalk.green('pnpm i'))
          console.log(chalk.green('pnpm run dev\r\n'))
          return
        }
      })
    }
  })
}
run()
