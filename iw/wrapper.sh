#!/bin/bash

PYTHONPATH="${PYTHONPATH}:/home/pwned/netpolling"
export PYTHONPATH

#python /home/damien/netpolling/netpolling/iw/wrapper.py
export DJANGO_SETTINGS_MODULE=netpolling.settings
python /home/pwned/netpolling/netpolling/iw/scanner.py