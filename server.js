import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import models from './src/models';
import routes from './src/routes';

const app = express();

app.use((req, res, next) => {
    req.context = {
        models
    };
    next();
});

app.listen(3000, () => {
    console.log(process.env.ENVIRONMENT);
    console.log('Example app listening on port 3000')
})

app.get('/users', (req, res) => {
    res.send(Object.values(req.context.models.users));
});

app.post('/users', (req, res) => {
    res.send('POST HTTP method on user resource');
});

app.put('/users/:userId', (req, res) => {
    res.send(`PUT HTTP method on user/${req.params.userId} resource`);
});

app.delete('/users/:userId', (req, res) => {
    res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
});

app.get('user/:userId', (req, res) => {
    res.send(req.context.models.users[req.params.userId]);
})

app.get('/messages', (req, res) => {
    return res.send(Object.values(req.context.models.messages));
});

app.get('messages/:messageId', (req, res) => {
    return res.send(req.context.models.messages[req.params.messageId]);
});

app.post('/messages', (req, res) => {
    const id = uuidv4();
    const message = {
        id,
        text: req.body.text,
    };
    req.context.models.messages[id] = message;

    res.send(message);
});

app.use((req, res, next) => {
    req.serverMessage = 'server generated message';
    next();
});

app.use(cors());

app.use('/users', routes.user);
app.use('/messages', routes.message);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));