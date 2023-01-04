const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const messageRouter = require("./routers/messages");
const conversationRouter = require("./routers/conversations");
const authRouter = require('./routers/authRoutes');
const userRouter = require('./routers/user');
const invitationRouter = require('./routers/invitations');
const Pusher = require("pusher");

const dbURI = 'mongodb+srv://hfghfg123456:hfghfg123456@profile.hxemy.mongodb.net/Database?retryWrites=true&w=majority';
mongoose.connect(dbURI);

const pusher = new Pusher({
    appId: "1409971",
    key: "64873375849c544489d1",
    secret: "52eff0c6be1b882524f0",
    cluster: "ap1",
    useTLS: true
});

const db = mongoose.connection;

db.once("open", () => {
    console.log('connected to database');
    const messageCollection = db.collection('messages');
    const userCollection = db.collection('users');
    const conversationCollection = db.collection('conversations');
    const invitationCollection = db.collection('invitations');
    const messageChangeStream = messageCollection.watch();
    const userChangeStream = userCollection.watch({ fullDocument: "updateLookup" });
    const invitationChangeStream = invitationCollection.watch();
    const conversationChangeStream = conversationCollection.watch({ fullDocument: "updateLookup" });



    messageChangeStream.on('change', (changes) => {
        console.log("message changeeee");

        if (changes.operationType == "insert") {
            const messageDetails = changes.fullDocument;
            pusher.trigger("message", "insert", { message: messageDetails });
        }
        if (changes.operationType == "delete") {
            console.log("message deleted");
        }
    })
    userChangeStream.on('change', (changes) => {
        console.log("user change");
        if (changes.operationType == "update") {
            const userDetails = changes.fullDocument;
            console.log(userDetails);
            pusher.trigger("user", "update", { user: userDetails });
        }
    })
    conversationChangeStream.on('change', (changes) => {
        console.log("conversation change");
        console.log(changes.operationType);
        if (changes.operationType == "insert") {
            let conversationDetails = changes.fullDocument;
            pusher.trigger("conversation", "insert", { conversation: conversationDetails });
        }
        if (changes.operationType == "update") {
            let conversationDetails = changes.fullDocument;

            console.log(conversationDetails);
            pusher.trigger("conversation", "delete", { conversation: conversationDetails });
        }
    })
    invitationChangeStream.on('change', (changes) => {
        console.log("invitation change");
        if (changes.operationType == "insert") {
            let invitationDetails = changes.fullDocument;
            pusher.trigger("invitation", "insert", { invitation: invitationDetails });
        }
        if (changes.operationType == "delete") {
            pusher.trigger("invitation", "delete", { invitation: "xoa invitation" });
        }

    })
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/invitations", invitationRouter);
app.listen(8800, () => {
    console.log("Backend server is running!");
});