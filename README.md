
# socketIOSimpleChat
Socket io simple chat app with some other functions like a private message.

This doc was my training doc for express but somehow I just turned it into a socket io chat server.
It works simple.
If you simply go to **127.0.0.1:3000** it will give you a random nickname. 
If you use **?nick=Example** in your query your nickname will be Example.
If there are other users already using your nickname, you will get a name like *Example(123).*

If someone wants to send a private message to another one he just needs to use tagging in text input like:

> **@Example;** how are u doing?

The message will only be seen by the **Example's session.**
