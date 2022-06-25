
let Myapp = (function () {
    let user_id = "";
    let meeting_id = "";
    function init(uid, mid) {
        user_id = uid;
        meeting_id = mid;
        event_process_for_signaling_server();
    };

    let socket = null;
    function event_process_for_signaling_server() {
        socket = io.connect();
        socket.on("connect", () => {
            // alert("connected");  ////for client side, for server side in server.js
            if (socket.connected) {
                if (user_id != "" && meeting_id != "") {
                    socket.emit("userconnect", {
                        displayName: user_id,
                        meeting_id: meeting_id,
                    });
                }
            }
        });

        socket.on("inform_others_about_me",(data)=>{
            addUser(data.other_user_id,data.connId);
        });
    };

    return {
        _init: function (uid, mid) {
            init(uid, mid);
        },
    };
})();