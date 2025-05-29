#!/bin/bash
cd /home/kavia/workspace/code-generation/easycalc-25783-e71aca14/easycalc_calculator
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

