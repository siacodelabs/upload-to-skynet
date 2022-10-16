import fs from "node:fs/promises"
import * as core from "@actions/core"
import {SkynetClient} from "@skynetlabs/skynet-nodejs"

/**
 * Runs the action.
 */
export async function run(): Promise<void> {
  try {
    // (1) get parameters
    const portal = core.getInput("portal")
    const entryPath = core.getInput("path")

    // (2) upload
    const skynet = new SkynetClient(portal)
    const entry = await fs.stat(entryPath)
    const skylink = await (entry.isDirectory()
      ? skynet.uploadDirectory(entryPath)
      : skynet.uploadFile(entryPath))

    // (3) set output
    core.setOutput("skylink", skylink)
  } catch (err: any) {
    core.setFailed(err)
  }
}
