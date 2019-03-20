import http from 'http';
import app from './routes/index';

const port = process.env.PORT || 3000;

app.set('poort', port);

const server = http.createServer(app);

server.listen(port, () =>{
    console.log(`Server started successfully on ${port}`);
})
