# How to Port Forward.

A tutorial by Edge.

----

Port forwarding, also known as "Opening Ports" lets outcoming traffic access your network indirectly, in this case we'll use it to let other users access our Node Hill server.

### Things to know.

Brick Hill uses TCP Services (Not UDP)

Brick hill uses by default the ports 42480 for the servers.

----

## How to Port-forward.

Port-forwarding settings are different on EACH ROUTER. Therefore i will try to be as universal as possible.

First of all we need to know our **Internal IP** address. And our Router Ip address too.

In order to get our IP Address you need to open up the CMD, search it up on your windows search bar.

![](https://media.discordapp.net/attachments/724012957432021062/732277363118702632/unknown.png?width=970&height=658)

Open it and type this command:

Windows: `ipconfig`
Linux: `sudo apt install ifconfig && ifconfig`
MacOS: `ifconfig`

And it should output this:
![](https://media.discordapp.net/attachments/724012957432021062/732278400181338132/unknown.png)

The ip's are censored as it's my personal pc, now, copy the Ipv4 ip and save it on a notepad or something.

Now we have to go to our router settings. 

Access your router by typing into the address bar one of these IP's:

192.168.1.1, 192.168.0.1 or 192.168.l.l.

If one of these dont work, just try the next one.

Once accessed the IP's you should see a login screen. It will ask you for a password, locate this password under your router. 

![](https://media.discordapp.net/attachments/724012957432021062/732279162399883315/unknown.png)

Type in the password and you will be able of editing any of your router settings...

### The correct setting.

Port-forwarding has different names on each router. In my case it's named "Redirect ports", in other cases it's simply named "open ports" or "port-forwarding" 

If you are unsure check your router manual or search up online your router company + "Port forward"

In my case: Vodafone Router Port forward settings

Aight, now this setting would look like this:

![](https://media.discordapp.net/attachments/728234556905226240/732280912506650625/unknown.png)

Now, you're port-forwarding!


