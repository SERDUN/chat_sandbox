# Dockerfile
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
# (додай інші файли якщо треба: CSS, JS, і т.д.)

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
