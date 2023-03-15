
module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log('a user connected');
        // socket.on("message", (msg)=>{
        //     console.log(msg);
        // });
        // socket.on("message-received", (sms)=>{
        //     console.log(sms);
        //     socket.emit("sms",sms);
        // });

        // socket.on("BTACS", (data)=>{
        //     console.log(data);
        // });
    });

   
}