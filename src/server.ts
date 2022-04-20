import express from "express";
import dotenv from 'dotenv';
import apiRoutes from './Routers/api';
import path from 'path';

dotenv.config();

const server = express();

server.use(express.json());
server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({extended: true}));

server.use('/api', apiRoutes);

server.listen(process.env.PORT, ()=>{
    console.log('Server is running on port: ' + process.env.PORT)
})
