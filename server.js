import { Socket } from 'dgram';
import express from 'express'
import path from 'path';
import {Server} from 'socket.io';
import { fileURLToPath } from 'url';


const PORT=3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();

//server will automatically choose index.html for '/'
app.use(express.static(path.join(__dirname,"")));  //making root folder static,will load all files from root folder so that action and index.html can be loaded

const server= app.listen(PORT);
const io= new Server(server);
const userConnections=[];

io.on("connection",(socket)=>{
    console.log("socket id:",socket.id);
    socket.on("userconnect",(data)=>{
        console.log(data.displayName,data.meeting_id);
        let other_users=userConnections.filter((p)=> p.meeting_id = data.meeting_id);
        userConnections.push({
            connection_id:socket.id,
            user_id:data.displayName,
            meeting_id:data.meeting_id,
        });

        other_users.forEach((v)=>{
                socket.to(v.connection_id).emit("inform_others_about_me",{
                    other_user_id:data.displayName,
                    connId:socket.id,
                });
        });
    });
});