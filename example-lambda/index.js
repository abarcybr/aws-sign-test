exports.handler = function (event, context, callback) {
    console.log('Received event: ', event)
    callback(null, "Hello")
}