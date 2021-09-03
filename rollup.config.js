// 各種プラグインを読み込む
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import toGlobal from "@jo12bar/rollup-plugin-hoist-entry-exports-to-global-scope";

import camelCase from "lodash.camelcase";
import upperFirst from "lodash.upperfirst";

import pkg from "./package.json";

const moduleName = upperFirst(camelCase(pkg.name.replace(/^@.*\//, "")));
const formatDate = (date) => {
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

const banner = `/*!
  ${moduleName}.js v${pkg.version}
  ${pkg.homepage}
  Deployed at ${formatDate(new Date())}
  Released under the ${pkg.license} License.
*/`;

const outDir = `./dist`;

export default [
  {
    input: "src/index.ts",
    output: [
      {
        name: moduleName,
        file: `${outDir}/index.js`,
        format: "iife",
        preferConst: "true",
        banner,
      },
    ],
    plugins: [
      typescript(),
      commonjs({
        extensions: [".js", ".ts"],
      }),
      resolve(),
      toGlobal(moduleName),
    ],
  },
];
