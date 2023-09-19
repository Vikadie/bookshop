# create container with python 3
FROM python:3

ENV PYTHONUNBUFFERED=1

# make directory app
WORKDIR /app
COPY ./requirements.txt /app/
RUN pip install -r requirements.txt

# copy all
COPY . /app/