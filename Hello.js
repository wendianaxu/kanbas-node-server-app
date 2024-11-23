export default function Hello(app) { // function accepts app reference to express module to create routes
    app.get('/hello', (req, res) => { res.send('Life is good!') }) // "/hello" is the url to get request from; res.send() responds to the request with the text
    app.get('/', (req, res) => {
        res.send('Welcome to Full Stack Development!')
    })
}