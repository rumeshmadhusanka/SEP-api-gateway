FROM alpine
RUN apk add --update npm
ENTRYPOINT ["/bin/sh"]
EXPOSE 8000