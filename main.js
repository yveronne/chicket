/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import express from 'express';
import consign from "consign";

const PORT = 3500;
const app = express();

app.get('/', (req, res) =>
    res.send('Hello World!')
);

app.listen(PORT , () => console.log ('Connecté sur le port ' +  PORT));