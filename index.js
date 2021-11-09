import appSrc from './app.js';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import m from 'mongoose';
import crypto from 'crypto';
import http from 'http';
import CORS from './CORS.js';
import UserModel from './models/User.js';

const User = UserModel(m);

const app = appSrc(express, bodyParser, fs, crypto, http, CORS, User, m);

const PORT = process.env.PORT || 4321;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
