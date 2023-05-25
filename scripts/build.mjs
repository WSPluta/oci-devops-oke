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
const [action] = _;

const project = "oci_devops_oke";

if (action === "hello-server") {
  await releaseNpm("hello-server");
  process.exit(0);
}

if (a || action === "all") {
  await releaseNpm("hello-server");
  process.exit(0);
}

console.log("Usage:");
console.log("\tnpx zx scripts/release.mjs all");
console.log("\tnpx zx scripts/release.mjs -a");
console.log("\tnpx zx scripts/release.mjs hello-server");

async function releaseNpm(service) {
  await cd(`src/${service}`);
  const currentVersion = await getNpmVersion();
  const image_name = `${project}/${service}`;
  await buildImage(`localhost/${image_name}`, currentVersion);
  const local_image = `localhost/${image_name}:${currentVersion}`;
  const remote_image = `${containerRegistryURL}/${namespace}/${image_name}:${currentVersion}`;
  await tagImage(local_image, remote_image);
  await pushImage(remote_image);
  console.log(`Released: ${chalk.yellow(remote_image)}`);
  await cd("..");
}
