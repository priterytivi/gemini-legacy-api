Gemini Legacy API (For the purpose of application or website development)

This is the API I'm currently using on my Gemini Android app; I created it to enable Gemini on older Android devices.
You can also use it to program applications for Android, iOS, Windows Phone, or any other device. To launch it, please follow these instructions:

Conditions for launch:
- Download Node from version v18 or later
- Download Notepad++ software as well.
- I have a computer running Windows (this can run on other operating systems, but I don't know how it runs on them)
- Also, load the server.js file located there (that's obvious)

How to launch it:
- After downloading the server.js file, save it to any location (for example, your Downloads folder)
- Right-click on the server.js file, then select "Edit with Notepad++"
- Find the section containing the text "API_KEY1" up to "API-KEY10" (This is where you can enter the key and run it on the server), To obtain those keys and then install them, you can go to the website (https://aistudio.google.com/api-keys) to get the keys, In that server.js file, I've included many API keys to ensure the server runs stably without limitations, It is recommended that people prepare multiple Google accounts to generate various API keys. If you don't need to enter too many keys to run the program, you can remove the "API_KEY2" and "API_KEY10"
- After modifying and adding the AI key, you can save the file and then open CMD with administrator privileges.
- In this step, please enter the following commands:
  npm init -y
- Then add the following: cd C:/"The path to your server.js file"
- Then continue by entering the following command:
  npm install express cors
  npm install axios express
- After entering both commands and receiving a success message, to launch the program, enter the following command:
  node server.js
- When it shows "Gemini Proxy Server currently operating at the port", the server has successfully started!

Additionally, if you want to open ports to allow the server to access the external network instead of the internal network, open CMD as an administrator and then enter this command:
  netsh advfirewall firewall add rule name="Open Port 80" dir=in action=allow protocol=TCP localport=80
After the process is complete and it reports success, you can try running this command to test it: netstat -ano | findstr :80

Upon successful completion, it will return an API link in this format: http://IP_SERVER/api/chat

Hopefully, this guide will show everyone how to launch it. Good luck!
