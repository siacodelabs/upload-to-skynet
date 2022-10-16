declare module "@skynetlabs/skynet-nodejs" {
  export const defaultPortalUrl: string

  export class SkynetClient {
    constructor(portal: string)
    uploadFile(path: string): Promise<string>
    uploadDirectory(path: string): Promise<string>
  }
}
