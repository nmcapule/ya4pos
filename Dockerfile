FROM golang:1.18 as builder

# Copy the present working directory to our source directory in Docker.
# Change the current directory in Docker to our source directory.
COPY . /src/myapp
WORKDIR /src/myapp

# Build our application as a static build.
# The mount options add the build cache to Docker to speed up multiple builds.
RUN --mount=type=cache,target=/root/.cache/go-build \
	--mount=type=cache,target=/go/pkg \
	go build -ldflags '-s -w -extldflags "-static"' -tags osusergo,netgo,sqlite_omit_load_extension -o /usr/local/bin/myapp .

# This starts our final image; based on alpine to make it small.
FROM alpine

# Copy executable from builder.
COPY --from=builder /usr/local/bin/myapp /usr/local/bin/myapp
COPY --from=builder /src/myapp/pb_public /pb_public

RUN apk add bash

# Create data directory (although this will likely be mounted too)
RUN mkdir -p /data

# Notify Docker that the container wants to expose a port.
EXPOSE 8080

CMD [ "/usr/local/bin/myapp", "serve", "--dir=/pb_data", "--http=0.0.0.0:8080" ]
