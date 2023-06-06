#!/usr/bin/env zx
import { readEnvJson } from "./lib/utils.mjs";
import { getNpmVersion } from "./lib/npm.mjs";
import {
  checkPodmanMachineRunning,
  buildImage,
  tagImage,
  pushImage,
} from "./lib/container.mjs";

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

checkPodmanMachineRunning();

let properties = await readEnvJson();
const { containerRegistryURL, namespace } = properties;

const { a, _ } = argv;
const [action, push] = _;

const project = "oci_devops_oke";

if (action === "hello-server") {
  await releaseNpm("hello-server", push);
  process.exit(0);
}

if (action === "auth-server") {
  await releaseNpm("auth-server", push);
  process.exit(0);
}

if (a || action === "all") {
  await releaseNpm("hello-server", push);
  await releaseNpm("auth-server", push);
  process.exit(0);
}

console.log("Usage:");
console.log("\tnpx zx scripts/release.mjs all");
console.log("\tnpx zx scripts/release.mjs -a");
console.log("\tnpx zx scripts/release.mjs hello-server");
console.log("\tnpx zx scripts/release.mjs auth-server");

async function releaseNpm(service, push) {
  await cd(`src/${service}`);
  const currentVersion = await getNpmVersion();
  const image_name = `${project}/${service}`;
  await buildImage(`localhost/${image_name}`, currentVersion);
  const local_image = `localhost/${image_name}:${currentVersion}`;
  const remote_image = `${containerRegistryURL}/${namespace}/${image_name}:${currentVersion}`;
  console.log(`Local: ${chalk.yellow(local_image)}`);
  await tagImage(local_image, remote_image);
  if (push) {
    await pushImage(remote_image);
    console.log(`Released: ${chalk.yellow(remote_image)}`);
  }
  await cd("../..");
}
