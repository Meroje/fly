import Fly from "../fly"
import { plugins } from "../util"
import path from "path"
import resolve from "resolve"

/**
  @desc Resolve flyfile using flypath and create a new Fly instance.
  @param {String} flypath Path to a flyfile
  */
export default function* (flypath) {
  let root = path.dirname(flypath)
  let load = (...file) => require(path.join(root, ...file))
  let pkg = (pkg) => {
    try { return load(pkg) } catch (_) {}
  }("package")
  let paths = (process.env.NODE_PATH ? process.env.NODE_PATH.split((process.platform === "win32" ? ";" : ":")) : [])

  return new Fly({
    root,
    host: require(flypath),
    plugins: plugins({ pkg }).reduce((prev, next) => prev.concat(require(resolve.sync(next, {basedir: root, paths: paths}))), [])
  })
}
