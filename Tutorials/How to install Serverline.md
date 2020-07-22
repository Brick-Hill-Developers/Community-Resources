### Steps:

Install the serverline module by running `npm i serverline` on the home directory of the node-hill template.

Then add this to your sandbox:

```js
    sandbox: {
        serverline: require("serverline"),
        process: {
            stdout: process.stdout
        }
    }
```

And that would be it.
