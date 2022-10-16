# `siacodelabs/upload-to-skynet`

This action allows to upload a file or a directory to a Skynet platform.

## Usage

See [action.yaml](action.yaml)

### Basic

```yaml
steps:
  - name: Upload file to Skynet platform
    uses: siacodelabs/upload-to-skynet
    with:
      portal: https://web3portal.com
      path: ${{ github.workspace }}/tests/data/file.txt
```
