#!/usr/bin/env zx
import { readEnvJson } from "./lib/utils.mjs";
import { getNpmVersion } from "./lib/npm.mjs";
import { getNamespace } from "./lib/oci.mjs";
import {
  checkPodmanMachineRunning,
  buildImage,
  tagImage,
  pushImage,
} from "./lib/container.mjs";
import { getVersionGradle } from "./lib/gradle.mjs";

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

checkPodmanMachineRunning();

let properties = await readEnvJson();
const { containerRegistryURL } = properties;

const namespace = await getNamespace();

console.log({ containerRegistryURL, namespace });

const { a, _ } = argv;
const [action, push] = _;

const project = "oci-devops-oke";

if (action === "hello-server") {
  await releaseNpm("hello-server", push);
  process.exit(0);
}

if (action === "auth-server") {
  await releaseNpm("auth-server", push);
  process.exit(0);
}

if (action === "japp-server") {
  await releaseGradle("japp-server", push);
  process.exit(0);
}

if (a || action === "all") {
  await releaseNpm("hello-server", push);
  await releaseNpm("auth-server", push);
  await releaseGradle("japp-server", push);
  process.exit(0);
}

console.log("Usage:");
console.log("\tnpx zx scripts/build.mjs all");
console.log("\tnpx zx scripts/build.mjs -a");
console.log("\tnpx zx scripts/build.mjs hello-server");
console.log("\tnpx zx scripts/build.mjs auth-server");
console.log("\tnpx zx scripts/build.mjs japp-server");

async function releaseNpm(service, push) {
  await cd(`src/${service}`);
  const currentVersion = await getNpmVersion();
  await buildImage(`${service}`, currentVersion);
  const localImage = `${service}:${currentVersion}`;
  const remoteImage = `${containerRegistryURL}/${namespace}/${project}/${service}:${currentVersion}`;
  await tagImage(localImage, remoteImage);
  if (push) {
    await pushImage(remoteImage);
    console.log(`Released: ${chalk.yellow(remoteImage)}`);
  }
  await cd("../..");
}

async function releaseGradle(service, push) {
  await cd(`src/${service}`);
  const currentVersion = await getVersionGradle();
  await buildImage(`${service}`, currentVersion);
  const localImage = `${service}:${currentVersion}`;
  const remoteImage = `${containerRegistryURL}/${namespace}/${project}/${service}:${currentVersion}`;
  await tagImage(localImage, remoteImage);
  if (push) {
    await pushImage(remoteImage);
    console.log(`Released: ${chalk.yellow(remoteImage)}`);
  }
  await cd("..");
}
