#!/usr/bin/env zx
import { getNpmVersion } from "./lib/npm.mjs";
import { getNamespace, getRegionByName } from "./lib/oci.mjs";
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

const namespace = await getNamespace();
console.log({ namespace });
const ociRegionNameFromEnv = (await $`echo $OCI_REGION`).stdout.trim();
const region = await getRegionByName(ociRegionNameFromEnv);
const regionKey = region["region-key"].toLowerCase();
console.log({ regionKey });

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

async function releaseNpm(service, push = false) {
  await cd(`src/${service}`);
  const currentVersion = await getNpmVersion();
  console.log(
    `Releasing ${service}:${currentVersion} (push: ${push.toString()})`
  );
  await buildImage(`${service}`, currentVersion);
  const localImage = `${service}:${currentVersion}`;
  const remoteImage = `${regionKey}.ocir.io/${namespace}/${project}/${service}:${currentVersion}`;
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
  const remoteImage = `${regionKey}.ocir.io/${namespace}/${project}/${service}:${currentVersion}`;
  await tagImage(localImage, remoteImage);
  if (push) {
    await pushImage(remoteImage);
    console.log(`Released: ${chalk.yellow(remoteImage)}`);
  }
  await cd("..");
}
