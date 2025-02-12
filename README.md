Boilerplate server for [Tauri Updater](https://v2.tauri.app/plugin/updater).

After building the app, we must copy the update release (\*.app.tar.gz, \*.exe, \*.msi) and signature (\*.app.tar.gz.sig, \*.exe.sig, \*.msi.sig) to the folder app-release. Also update the `semver.json` file with version property as latest version.

```json
{
  "version": "<your latest version>"
}
```

Edit `tauri.conf.json`

```json
{
  "plugins": {
    "updater": {
      "dialog": true,
      "pubkey": "your-pubkey",
      "endpoints": [
        "<your domain>/updater/{{target}}/{{arch}}/latest-version?currentVersion={{current_version}}"
      ]
    }
  }
}
```
