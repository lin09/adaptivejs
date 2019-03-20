/**
 * 打包后的文件用于发布到npm
 */
import fs from 'fs'
import path from 'path'
import jsonfile from 'jsonfile'
import { DICT } from './config'

const pick = (object, paths) => {
  const newObj = {}

  for (const path of paths) {
    newObj[path] = object[path]
  }

  return newObj
}

// 创建文件夹
if (!fs.existsSync(DICT.NPM_DIR)) {
  fs.mkdirSync(DICT.NPM_DIR);
}

// 拷贝文件
for (const fileName of ['LICENSE', 'README.md']) {
  const npmFileName = path.join(DICT.NPM_DIR, fileName)
  fs.copyFile(fileName, npmFileName, err => {
    if (err) throw err
    console.log(`${ fileName } was copied to ${ npmFileName }✔️`)
  })
}

// 创建 npm 包的 package.json
const packageFile = 'package.json'
const npmPackageFile = path.join(DICT.NPM_DIR, packageFile)
jsonfile.readFile(packageFile)
  .then(data => {
    data = pick(data, ['name', 'version', 'description', 'repository', 'keywords', 'author', 'license', 'bugs', 'homepage'])
    return jsonfile.writeFile(npmPackageFile, { ...data, main: DICT.INPUT_FILENAME }, { spaces: 2 })
    .then(() => {
      console.log(`created ${ npmPackageFile }✔️`)
    })
  })
  .catch(err => { throw err })
