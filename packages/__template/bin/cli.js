#!/usr/bin/env node
import('./__cli.mjs')
  .then((mod) => {
    mod.default();
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
