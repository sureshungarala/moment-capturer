#!/bin/bash
echo "--- LIST PUBLIC ---" > debug.log
ls -R public >> debug.log
echo "--- GIT STATUS MOMENT-CAPTURER ---" >> debug.log
cd /Users/vijayavenkatasuresh.ungarala/Documents/My-GitHub/moment-capturer
git status >> ../debug.log 2>&1

echo "--- GIT STATUS MOMENTCAPTURER-API ---" >> ../debug.log
cd /Users/vijayavenkatasuresh.ungarala/Documents/My-GitHub/momentcapturer-API
git status >> ../../../moment-capturer/debug.log 2>&1
