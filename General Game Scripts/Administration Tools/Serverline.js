/**
 * @deprecated Serverline is deprecated at the moment.
 */

serverline.init()

serverline.setPrompt('> ')
 
serverline.on('line', function(line) {
  try {
      let output = eval(`(async () => { ${line} })()`)
      console.log(`Output: ${output}`)
  } catch (err) {
      console.error(err)
  }
})
