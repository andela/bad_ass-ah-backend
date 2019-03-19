import express from 'express';

const app = express();
const port = process.env.PORT || 3000;
app.set('port', port);
app.use((req, res ) =>{
    res.status(404).send({
        status: 404,
        error: 'resource not found',
    });
})


app.listen(port, () =>{
    console.log(`Server started successfully on ${port}`);
})

export default app;
