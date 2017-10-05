# Health Data Analytics Frontend

# Installation:
    npm install -g ember-cli@2.11
    clone project
    cd to project
    ember install ember-cli-mirage
    npm update
    bower install

Project can then be run with: 'ember server' and built wiith 'ember build'.

# Example ngnix config:


```
user 'details here';
worker_processes  1;
 
events {
    worker_connections  1024;
}
 
http {
	include    mime.types;
	server {
        listen      XXXPortNumber;
        server_name localhost;

        location / {
            proxy_pass http://127.0.0.1:49153;
        }
        location /health-analytics-api {
			proxy_pass https://dev-health-analytics.ihtsdotools.org/health-analytics-api;
		}
    }
}
```