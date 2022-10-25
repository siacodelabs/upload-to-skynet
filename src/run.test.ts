import path from "node:path"
import expected from "@akromio/expected"
import {constructor, interceptor, method, monitor, simulator} from "@akromio/doubles"

suite(__filename, () => {
  const portal = "https://web3portal.com"

  suite("run()", () => {
    const skynetModulePath = require.resolve("@skynetlabs/skynet-nodejs")
    const actionsCoreModulePath = require.resolve("@actions/core")
    const actionModulePath = require.resolve("./run")

    setup(() => {
      delete require.cache[skynetModulePath]
      delete require.cache[actionsCoreModulePath]
      delete require.cache[actionModulePath]
    })

    teardown(() => {
      interceptor.clear(skynetModulePath)
      interceptor.clear(actionsCoreModulePath)
    })

    test("when file exists, uploadFile() must be called and its skylink returned", async () => {
      const {SkynetClient} = await import("@skynetlabs/skynet-nodejs")
      await import("@actions/core")

      // (1) arrange
      const testFilePath = path.join(__dirname, "../../tests/data/hello-world.txt")
      const skylink = "sia://the-skylink"
      const uploadFile = monitor(method.returns(skylink))

      interceptor.module(skynetModulePath, {
        SkynetClient: constructor.returns(simulator(SkynetClient, {uploadFile}))
      })

      const getInput = monitor(
        method([
          {args: ["portal"], returns: portal},
          {args: ["path"], returns: testFilePath}
        ])
      )
      const setOutput = monitor(method())

      interceptor.module(actionsCoreModulePath, {getInput, setOutput})

      // (2) act
      const {run} = await import("./run")
      await run()

      // (3) assessment
      let log = monitor.log(getInput, {clear: true})
      expected(log.calls).equalTo(2)

      log = monitor.log(setOutput, {clear: true})
      expected(log.calls).equalTo(1)
      expected(log.call.args).equalTo(["skylink", skylink])

      log = monitor.log(uploadFile, {clear: true})
      expected(log.calls).equalTo(1)
      expected(log.call.args).equalTo([testFilePath])
    })

    test("when dir exists, uploadDirectory() must be called and its skylink returned", async () => {
      const {SkynetClient} = await import("@skynetlabs/skynet-nodejs")
      await import("@actions/core")

      // (1) arrange
      const testDirPath = path.join(__dirname, "../../tests/data")
      const skylink = "sia://the-skylink"
      const uploadDirectory = monitor(method.returns(skylink))

      interceptor.module(skynetModulePath, {
        SkynetClient: constructor.returns(simulator(SkynetClient, {uploadDirectory}))
      })

      const getInput = monitor(
        method([
          {args: ["portal"], returns: portal},
          {args: ["path"], returns: testDirPath}
        ])
      )
      const setOutput = monitor(method())

      interceptor.module(actionsCoreModulePath, {getInput, setOutput})

      // (2) act
      const {run} = await import("./run")
      await run()

      // (3) assessment
      let log = monitor.log(getInput, {clear: true})
      expected(log.calls).equalTo(2)

      log = monitor.log(setOutput, {clear: true})
      expected(log.calls).equalTo(1)
      expected(log.call.args).equalTo(["skylink", skylink])

      log = monitor.log(uploadDirectory, {clear: true})
      expected(log.calls).equalTo(1)
      expected(log.call.args).equalTo([testDirPath])
    })

    test("when entry doesn't exist, error must be returned", async () => {
      const {SkynetClient} = await import("@skynetlabs/skynet-nodejs")
      await import("@actions/core")

      // (1) arrange
      interceptor.module(skynetModulePath, {
        SkynetClient: constructor.returns(simulator(SkynetClient, {}))
      })

      const testFilePath = path.join(__dirname, "../../tests/data/unknown.txt")
      const getInput = monitor(
        method([
          {args: ["portal"], returns: portal},
          {args: ["path"], returns: testFilePath}
        ])
      )
      const setFailed = monitor(method())
      interceptor.module(actionsCoreModulePath, {getInput, setFailed})

      // (2) act
      const {run} = await import("./run")
      await run()

      // (3) assessment
      let log = monitor.log(getInput, {clear: true})
      expected(log.calls).equalTo(2)

      log = monitor.log(setFailed, {clear: true})
      expected(log.calls).equalTo(1)
      expected(log.call.args).it(0).like("ENOENT")
    })
  })
})
