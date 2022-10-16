import os from "node:os"
import path from "node:path"
import fs from "node:fs/promises"
import {run} from "./index"
import expected from "@akromio/expected"
import plugin from "@akromio/expected-fs"
expected.plugin(plugin)

suite("upload file", () => {
  const portal = "https://web3portal.com"
  const outputFile = path.join(os.tmpdir(), "GITHUB_OUTPUT")

  setup(async () => {
    await fs.writeFile(outputFile, "") // needed by core.setOutput()
  })

  test("if file exists, this must be uploaded and output set", async () => {
    // (1) arrange
    const testFilePath = path.join(__dirname, "../../tests/data/hello-world.txt")

    process.env.INPUT_PORTAL = portal
    process.env.INPUT_PATH = testFilePath
    process.env.GITHUB_OUTPUT = outputFile

    // (2) act
    await run()

    // (3) assessment
    expected.file(outputFile).toContain("sia://")
  })

  test("if file doesn't exist, process.exitCode must be set to 1", async () => {
    // (1) arrange
    const testFilePath = path.join(__dirname, "../../tests/data/unknown.txt")

    process.env.INPUT_PORTAL = portal
    process.env.INPUT_PATH = testFilePath
    process.env.GITHUB_OUTPUT = outputFile

    // (2) act
    await run()

    // (3) assessment
    expected.file(outputFile).toBeEmpty()
    expected(process.exitCode).equalTo(1)
  })
})
