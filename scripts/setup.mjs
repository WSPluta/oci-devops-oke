#!/usr/bin/env zx

import { getVersionGradle } from "./lib/gradle.mjs";
import { getNpmVersion } from "./lib/npm.mjs";
import { exitWithError, readEnvJson } from "./lib/utils.mjs";

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

const { containerRegistryURL, containerRegistryUser, namespace } =
  await readEnvJson();

const containerRegistryToken = await setVariableFromEnvOrPrompt(
  "OCI_OCIR_TOKEN",
  "OCI Auth Token for OCI Registry"
);

configureKubectl();

createRegistrySecret();

printFollowingSteps();

async function createKustomizationYaml(regionKey, namespace) {
  const pwdOutput = (await $`pwd`).stdout.trim();
  await cd("./src/hello-server");
  const helloVersion = await getNpmVersion();
  await cd("../src/auth-server");
  const authVersion = await getNpmVersion();
  await cd("../src/japp-server");
  const jappVersion = await getVersionGradle();
  await cd("..");

  await cd("./k8s/overlay/prod");
  try {
    let { exitCode, stderr } =
      await $`sed 's/REGION_KEY/${regionKey}/' kustomization.yaml_template \
         | sed 's/AUTH_VERSION/${authVersion}/' \
         | sed 's/HELLO_VERSION/${helloVersion}/' \
         | sed 's/JAPP_VERSION/${jappVersion}/' \
         | sed 's/NAMESPACE/${namespace}/' > kustomization.yaml`;
    if (exitCode !== 0) {
      exitWithError(`Error creating kustomization.yaml: ${stderr}`);
    }
    console.log(`Overlay ${chalk.green("kustomization.yaml")} created.`);
  } catch (error) {
    exitWithError(error.stderr);
  } finally {
    await cd(pwdOutput);
  }
}

async function configureKubectl() {
  const currentFolderPath = (await $`pwd`).stdout.trim();
  const pathToKubeConfig = path.join(
    currentFolderPath,
    "tf",
    "generated",
    "kubeconfig"
  );
  $.prefix += `export KUBECONFIG=${pathToKubeConfig};`;
  await checkKubectlConfigured();
}

async function checkKubectlConfigured() {
  console.log("Check kubectl is configured...");
  try {
    const { exitCode } = await $`kubectl cluster-info`;
    if (exitCode !== 0) {
      exitWithError("kubectl not configured");
    } else {
      console.log(`${chalk.green("[ok]")} kubectl connects to cluster`);
      const kubectlContext = (
        await $`kubectl config current-context`
      ).stdout.trim();
      console.log(`Context: ${chalk.green(kubectlContext)}`);
    }
  } catch (error) {
    exitWithError(error.stderr);
  }
  console.log();
}

async function createRegistrySecret() {
  console.log("Create registry secret on Kubernetes cluster...");
  try {
    await cleanRegisterSecret();
    const { exitCode, stdout } =
      await $`kubectl create secret docker-registry ocir-secret \
          --docker-server=${containerRegistryURL} \
          --docker-username=${namespace}/${containerRegistryUser} \
          --docker-password=${containerRegistryToken} \
          --docker-email=${containerRegistryUser}`;
    if (exitCode !== 0) {
      exitWithError("docker-registry secret not created");
    } else {
      console.log(`${chalk.green("[ok]")} ${stdout}`);
    }
  } catch (error) {
    exitWithError(error.stderr);
  }
  console.log();
}

async function cleanRegisterSecret() {
  try {
    let { exitCode } = await $`kubectl get secret ocir-secret`;
    if (exitCode === 0) {
      console.log("Deleting exiting ocir-secret secret");
      await $`kubectl delete secret ocir-secret`;
    }
  } catch (error) {}
}

async function printFollowingSteps() {
  console.log(`Ready to deploy, run:`);
  console.log(chalk.yellow("kubectl apply -k k8s/overlay/prod"));
  console.log(
    `Get Load Balancer IP address with: ${chalk.yellow(
      "kubectl -n ingress-nginx get svc"
    )}`
  );
  console.log();
}
