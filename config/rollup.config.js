/**
 * 打包后的文件用于发布到npm
 */
import path from 'path'
import { rollupConfig, DICT } from './config'
import './file'

// rollup config
export default {
  ...rollupConfig,
  output: {
    ...rollupConfig.output,
    file: path.join(DICT.NPM_DIR, DICT.INPUT_FILENAME),
    exports: 'named'
  }
}
