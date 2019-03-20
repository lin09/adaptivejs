import path       from 'path'
import babel      from 'rollup-plugin-babel'
import resolve    from 'rollup-plugin-node-resolve'
import commonjs   from 'rollup-plugin-commonjs'
import { eslint } from 'rollup-plugin-eslint'
import jsonfile from 'jsonfile'

export const DICT = {
  NPM_DIR        : 'npm_package', // 此文件夹存放的文件用于发布到npm
  OUTPUT_NAME    : 'adaptivejs',  // 打包后的文件名
  OUTPUT_DIR     : 'dist',        // 打包后的文件
  INPUT_FILENAME : 'main.js'      // 入口文件
}

const { version, author, license, homepage, description } = jsonfile.readFileSync('package.json')
const banner = `/**
 * version     : ${ version }
 * author      : ${ author }
 * license     : ${ license }
 * homepage    : ${ homepage }
 * description : ${ description }
 */`

// rollup 基础配置
export const rollupConfig = {
  input: path.join('src', DICT.INPUT_FILENAME),
  output: {
    file: path.join(DICT.OUTPUT_DIR, DICT.OUTPUT_NAME + '.js'),
    /**
     * amd – 异步模块定义，用于像RequireJS这样的模块加载器
     * cjs – CommonJS，适用于 Node 和 Browserify/Webpack
     * es – 将软件包保存为ES模块文件
     * iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
     * umd – 通用模块定义，以amd，cjs 和 iife 为一体
     */
    format: 'cjs',
    name: DICT.OUTPUT_NAME,
    banner
  },
  plugins: [
    // babel 必需优先
    babel(),
    eslint(),
    resolve(),
    commonjs()
  ]
}
