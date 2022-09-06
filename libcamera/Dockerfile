FROM node:16-bullseye as build

RUN apt update && apt install -y git \
    meson \ 
    ninja-build \
    g++ \
    openssl \
    pkg-config \
    cmake \
    python3 \
    libyaml-dev \
    python3-pip \
    python3-yaml \
    python3-ply \
    python3-jinja2

RUN git clone https://git.libcamera.org/libcamera/libcamera.git --depth=1 && \
    cd libcamera && \
    meson build && \
    meson configure -Dpipelines=raspberrypi -Dtest=false && \
    ninja -C build install && \
    cd / && \
    rm -rf /tmp/* /var/tmp/* ~/.cache

RUN apt update && apt install -y cmake libboost-program-options-dev libdrm-dev libexif-dev

RUN cd && \
    git clone https://github.com/raspberrypi/libcamera-apps.git --depth=1 && \
    cd libcamera-apps && \
    mkdir build && \
    cd build && \
    cmake .. -DENABLE_DRM=1 -DENABLE_X11=1 -DENABLE_QT=1 -DENABLE_OPENCV=0 -DENABLE_TFLITE=0 && \
    make -j4 && \
    make install && \
    ldconfig

EXPOSE 8080

ENTRYPOINT ["libcamera-vid", "-t", "0", "--inline", "--listen", "--codec", "mjpeg", "--width", "1024", "--height", "768", "--nopreview", "-o", "tcp://0.0.0.0:8080"]